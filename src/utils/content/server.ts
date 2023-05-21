import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content";
import { type Language, DEFAULT_LOCALE } from "@/utils/i18n";
import type { BlogEntry, BlogEntryMeta, CollectionKey, Entry } from "./types";
import { getEntryURL, slugToCanonical } from "./client";

export async function blogCollectionToBlogEntry(entry: CollectionEntry<"blog">, slug: string): Promise<BlogEntry> {
  const [lang, rawSlug] = slug.split("/") as [Language, string];

  const translationsEntities = await getCollection("blog", p => {
    const [pLang, pSlug] = p.slug.split("/") as [Language, string];
    return pLang !== lang && pSlug === rawSlug;
  });

  const translations = translationsEntities.map(p => {
    const pLang = p.slug.split("/")[0] as Language;
    return { lang: pLang, slug: getEntryURL("blog", p.slug), isOriginal: pLang === DEFAULT_LOCALE };
  });

  const meta: BlogEntryMeta = {
    lang,
    formattedDate: entry.data.date.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" }),
    title: entry.data.title,
    description: entry.data.description,
    canonical: slugToCanonical(getEntryURL("blog", entry.slug)),
    ogTitle: entry.data.title,
    ogType: "article",
  };

  return {
    entry,
    meta,
    translations,
    isOriginal: lang === DEFAULT_LOCALE,
  };
}

export async function getBlogEntry(slug: string): Promise<BlogEntry | undefined> {
  const entry = await getEntryBySlug("blog", slug);

  if (!entry) return;
  return blogCollectionToBlogEntry(entry, slug);
}

export async function getBlogEntriesByLang(lang: Language): Promise<BlogEntry[]> {
  const entries = await getCollection("blog", p => p.slug.startsWith(`${lang}/`));
  return Promise.all(entries.map(e => blogCollectionToBlogEntry(e, e.slug)));
}

export function getEntriesByLang(collection: CollectionKey, lang: Language): Promise<Entry[]> {
  switch (collection) {
    case "blog":
      return getBlogEntriesByLang(lang);
    default:
      throw new Error(`Invalid collection name: ${collection as string}`);
  }
}

// RE-EXPORTS
export { getCollection };
