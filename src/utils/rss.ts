import rss, { type RSSOptions } from "@astrojs/rss";
import { getEntryURL, type BlogEntry, getBlogEntriesByLang } from "@/utils/content";
import { useTranslation, type Language } from "./i18n";

export function blogEntryToRSSItems(entries: BlogEntry[]): RSSOptions["items"] {
  return entries.map(entry => ({
    title: entry.meta.title,
    description: entry.meta.description,
    link: getEntryURL("blog", entry.entry.slug),
    guid: getEntryURL("blog", entry.entry.slug),
    pubDate: entry.entry.data.date,
    categories: entry.entry.data.tags,
  }));
}

export function getRSSCustomData(lang: Language, copyright: string) {
  return `
    <language>${lang}</language>
    <ttl>60</ttl>
    <category>Web Development</category>
    <category>Software Development</category>
    <category>Programming</category>
    <copyright>${copyright} ©️${new Date().getFullYear()} Misael Taveras</copyright>
  `;
}

interface RSSConfig {
  site: string;
  description: string;
  lang: Language;
}

export async function generateRSSFeed({ site, description, lang }: RSSConfig) {
  const entries = await getBlogEntriesByLang(lang);
  const items = blogEntryToRSSItems(entries);
  const t = await useTranslation(lang);
  return rss({
    site,
    items,
    description,
    title: "Misael Taveras Blog",
    customData: getRSSCustomData(lang, t("ui", "copyright")),
  });
}
