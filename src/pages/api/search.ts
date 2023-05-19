import { DEFAULT_LOCALE } from "@/utils/i18n";
import { getEnv } from "@/utils/env";
import algoliasearch from "algoliasearch";
import { isSupportedLang } from "@/utils/i18n";

const { PUBLIC_ALGOLIA_SEARCH_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } = getEnv();
const algoliaclient = algoliasearch(ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_KEY);

export async function get({ request }: { request: Request }) {
  const requestURL = new URL(request.url);
  const query = requestURL.searchParams.get("query");
  const lang = getLangFromURL(requestURL);
  if (!query) return new Response(JSON.stringify({ items: [] }), { status: 401, statusText: "No query provided" });

  const index = algoliaclient.initIndex(ALGOLIA_INDEX_NAME);
  const { hits: items } = await index.search(query, {
    attributesToRetrieve: ["title", "objectID"],
    facetFilters: [`lang:${lang}`],
  });

  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function getLangFromURL(url: URL): "en" | "es" {
  const lang = url.pathname.split("/").filter(Boolean)[0];
  if (isSupportedLang(lang)) return lang;
  const search = url.searchParams.get("lang") ?? "";
  if (isSupportedLang(search)) return search;
  return DEFAULT_LOCALE;
}
