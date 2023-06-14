import { statSync } from "node:fs";
import { resolve } from "node:path";
import { getCollection, getEntryURL } from "@/utils/content";
import { SitemapStream, EnumChangefreq, type SitemapItemLoose, streamToPromise } from "sitemap";
import { Readable } from "stream";
import type { Language } from "@/utils/i18n";

export const prerender = true;

type SitemapItem = Pick<SitemapItemLoose, "url" | "lastmod" | "changefreq" | "priority" | "links">;
const ContentDIR = resolve(process.cwd(), "src/content");

export async function createEntriesSitemap(hostname: string) {
  const sitemapStream = new SitemapStream({ hostname });
  const blogCollection = await getCollection("blog");
  const blogEntries = blogCollection.map(e => {
    const [lang, slug] = e.slug.split("/") as [Language, string];
    return { id: e.id, lang, slug, url: getEntryURL("blog", e.slug), date: e.data.date.toISOString() };
  });

  const blogItems = blogEntries.map<SitemapItem>(entry => {
    const { lang, slug } = entry;
    const fileStats = statSync(resolve(ContentDIR, "blog", entry.id));
    const translationsEntities = blogEntries.filter(e => e.lang !== lang && e.slug === slug);

    return {
      ...entry,
      lastmod: fileStats.mtime.toISOString(),
      changefreq: EnumChangefreq.MONTHLY,
      priority: 0.6,
      links: translationsEntities,
    } satisfies SitemapItem;
  });

  return streamToPromise(Readable.from(blogItems).pipe(sitemapStream));
}
