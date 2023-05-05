import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogEntriesByLang } from "@/utils/content";
import { blogEntryToRSSItems, getRSSCustomData } from "@/utils/rss";

export async function get(context: APIContext) {
  const site = (context.site ?? "").toString();
  const entries = await getBlogEntriesByLang("es");
  const items = blogEntryToRSSItems(entries);

  return rss({
    site,
    items,
    title: "TaverasMisael Blog",
    description: "Blog de TaverasMisael",
    customData: getRSSCustomData("es"),
  });
}
