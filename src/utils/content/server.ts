import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { type Language, DEFAULT_LOCALE } from "@/utils/i18n";
import type { BlogEntry, BlogEntryMeta, CollectionKey, Entry } from "./types";
import { getEntryURL, slugToCanonical } from "./client";

export async function blogCollectionToBlogEntry(entry: CollectionEntry<"blog">, id: string): Promise<BlogEntry> {
  const [lang, rawSlug] = id.split("/") as [Language, string];

  const translationsEntities = await getCollection("blog", p => {
    const [pLang, pSlug] = p.id.split("/") as [Language, string];
    return pLang !== lang && pSlug === rawSlug;
  });

  const translations = translationsEntities.map(p => {
    const pLang = p.id.split("/")[0] as Language;
    return { lang: pLang, id: getEntryURL("blog", p.id), isOriginal: pLang === DEFAULT_LOCALE };
  });

  const meta: BlogEntryMeta = {
    lang,
    formattedDate: entry.data.date.toLocaleDateString(lang, { year: "numeric", month: "long", day: "numeric" }),
    title: entry.data.title,
    description: entry.data.description,
    canonical: slugToCanonical(getEntryURL("blog", entry.id)),
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

export async function getBlogEntry(id: string): Promise<BlogEntry | undefined> {
  const entry = await getEntry("blog", id);

  if (!entry) return;
  return blogCollectionToBlogEntry(entry, id);
}

export async function getBlogEntriesByLang(lang: Language): Promise<Entry["blog"][]> {
  const entries = await getCollection("blog", p => p.id.startsWith(`${lang}/`));
  return Promise.all(entries.map(e => blogCollectionToBlogEntry(e, e.id)));
}

export async function getTestimonialEntriesByLang(lang: Language): Promise<Entry["testimonial"][]> {
  return getCollection("testimonial", p => p.id.startsWith(`${lang}/`));
}

export function getEntriesByLang<Key extends CollectionKey, EntryType = Entry[Key]>(
  collection: Key,
  lang: Language,
): Promise<EntryType[]> {
  switch (collection) {
    case "blog":
      return getBlogEntriesByLang(lang) as Promise<EntryType[]>;
    case "testimonial":
      return getTestimonialEntriesByLang(lang) as Promise<EntryType[]>;
    default:
      throw new Error(`Invalid collection name: ${collection as string}`);
  }
}

// RE-EXPORTS
export { getCollection };
