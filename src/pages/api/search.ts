import { DEFAULT_LOCALE, type Language } from "@/utils/i18n";
import { getEnv } from "@/utils/env";
import { algoliasearch, type HighlightResultOption, type SnippetResultOption } from "algoliasearch";
import { isSupportedLang } from "@/utils/i18n";

const { PUBLIC_ALGOLIA_SEARCH_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } = getEnv();
const algoliaclient = algoliasearch(ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_KEY);

interface SearchHit {
  title: string;
  body: string;
  excerpt: string;
}

interface SearchMatch {
  key: string;
  value: string;
}

const validKeys = ["body", "excerpt", "title"];

export async function GET({ request }: { request: Request }) {
  const requestURL = new URL(request.url);
  const query = requestURL.searchParams.get("query");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We checked on the ternary
  const lang = getLangFromURL(request.headers.get("referer") ? new URL(request.headers.get("referer")!) : requestURL);
  if (!query) return new Response(JSON.stringify({ items: [] }), { status: 400, statusText: "No query provided" });

  try {
    const { hits } = await algoliaclient.searchSingleIndex<SearchHit>({
      indexName: ALGOLIA_INDEX_NAME,
      searchParams: {
        query,
        facetFilters: [[`lang:${lang}`]],
        attributesToRetrieve: ["title", "body", "excerpt"],
        attributesToSnippet: ["*:10"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
      },
    });

    const items = hits
      .filter(
        h =>
          h._highlightResult &&
          Object.values(h._highlightResult).some(v => (v as HighlightResultOption).matchLevel !== "none"),
      )
      .map(hit => ({
        id: hit.objectID,
        title: hit.title,
        matches: hit._snippetResult
          ? Object.entries(hit._snippetResult).reduce<SearchMatch[]>((prev, [k, v]) => {
              const value = v as SnippetResultOption;
              if (value.matchLevel === "none") return prev;
              if (!validKeys.includes(k)) return prev;
              return [...prev, { key: k, value: value.value }];
            }, [])
          : [],
      }));

    return new Response(JSON.stringify({ items, hits }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ items: [] }), { status: 500, statusText: "Internal Server Error" });
  }
}

function getLangFromURL(url: URL): Language {
  const lang = url.pathname.split("/").filter(Boolean)[0];
  if (isSupportedLang(lang)) return lang;
  const search = url.searchParams.get("lang") ?? "";
  if (isSupportedLang(search)) return search;
  return DEFAULT_LOCALE;
}
