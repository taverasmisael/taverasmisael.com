import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content";
import { type Language, DEFAULT_LOCALE } from "./i18n";

const Collections = {
  blog: "blog",
} as const;
type CollectionKeys = keyof typeof Collections;

export function getCollectionName(key: string): undefined | (typeof Collections)[CollectionKeys] {
  return Collections[key as CollectionKeys];
}

export async function getBlogEntry(slug: string): Promise<BlogEntry | undefined> {
  const [lang, rawSlug] = slug.split("/") as [Language, string];
  const entry = await getEntryBySlug("blog", slug);

  if (!entry) return;
  const translations: BlogTranslationReference[] = (
    await getCollection("blog", p => {
      const [pLang, pSlug] = p.slug.split("/") as [Language, string];
      return pLang !== lang && pSlug === rawSlug;
    })
  ).map(p => {
    const pLang = p.slug.split("/")[0] as Language;
    return {
      lang: pLang,
      slug: getEntryURL("blog", p.slug),
      isOriginal: pLang === DEFAULT_LOCALE,
    };
  });

  const meta: BlogEntryMeta = {
    lang,
    title: entry.data.title,
    description: entry.data.description,
    canonical: entry.slug, // TODO: use real canonical
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

export function getEntryURL(entryType: CollectionKeys, slug: string): string {
  const collection = getCollectionName(entryType);

  if (!collection) throw new Error(`Invalid collection name: ${entryType}`);

  const [lang, rawSlug] = slug.split("/") as [Language, string];
  return `/${lang}/${collection}/${rawSlug}`;
}

export interface BlogEntry {
  entry: CollectionEntry<"blog">;
  isOriginal: boolean;
  meta: BlogEntryMeta;
  translations: BlogTranslationReference[];
}

export interface BlogTranslationReference {
  isOriginal: boolean;
  lang: Language;
  slug: string;
}

export interface BlogEntryMeta {
  canonical: string;
  description: string;
  lang: Language;
  ogTitle: string;
  ogType: string;
  title: string;
}
