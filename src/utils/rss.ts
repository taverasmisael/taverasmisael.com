import type { RSSOptions } from "@astrojs/rss";
import { getEntryURL, type BlogEntry } from "./content";
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

export function getRSSCustomData(lang: Language) {
  const t = useTranslation(lang);

  return `
    <language>${lang}</language>
    <ttl>60</ttl>
    <category>Web Development</category>
    <category>Software Development</category>
    <category>Programming</category>
    <copyright>${t("ui", "copyright")} ©️${new Date().getFullYear()} Misael Taveras</copyright>
  `
}