import { DEFAULT_LOCALE, type Language } from "@/utils/i18n";
import { getEnv } from "@/utils/env";
import algoliasearch from "algoliasearch";
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

export async function get({ request }: { request: Request }) {
  const requestURL = new URL(request.url);
  const query = requestURL.searchParams.get("query");
  const lang = getLangFromURL(requestURL);
  if (!query) return new Response(JSON.stringify({ items: [] }), { status: 401, statusText: "No query provided" });

  const index = algoliaclient.initIndex(ALGOLIA_INDEX_NAME);

  try {
    const { hits } = await index.search<SearchHit>(query, {
      facetFilters: [`lang:${lang}`],
      attributesToRetrieve: ["title", "body", "excerpt"],
      attributesToSnippet: ["*:20"],
      highlightPreTag: "<mark>",
      highlightPostTag: "</mark>",
    });

    const items = hits.map(hit => ({
      id: hit.objectID,
      title: hit.title,
      matches: hit._snippetResult
        ? Object.entries(hit._snippetResult).reduce<SearchMatch[]>((prev, [k, v]) => {
            if (v.matchLevel === "none") return prev;
            if (!validKeys.includes(k)) return prev;
            return [...prev, { key: k, value: v.value }];
          }, [])
        : [],
    }));

    return new Response(JSON.stringify({ items }), {
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
