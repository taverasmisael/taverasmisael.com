import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content";
import { type Language, DEFAULT_LOCALE } from "./i18n";
import { SITE } from "@/config";

const Collections = {
  blog: "blog",
} as const satisfies Record<string, Parameters<typeof getCollection>["0"]>;

export type CollectionKey = keyof typeof Collections;

export function getCollectionName(key: string): undefined | (typeof Collections)[CollectionKey] {
  return Collections[key as CollectionKey];
}

export async function getBlogEntry(slug: string): Promise<BlogEntry | undefined> {
  const [lang, rawSlug] = slug.split("/") as [Language, string];
  const entry = await getEntryBySlug("blog", slug);

  if (!entry) return;
  const translations: EntryTranslationReference[] = (
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

export function getEntryURL(entryType: CollectionKey, slug: string): string {
  const collection = getCollectionName(entryType);

  if (!collection) throw new Error(`Invalid collection name: ${entryType}`);

  const [lang, rawSlug] = slug.split("/") as [Language, string];
  return `/${lang}/${collection}/${rawSlug}`;
}

export function slugToCanonical(slug: string, base: string = SITE.url): string {
  return new URL(slug, base).toString();
}

export interface BlogEntry {
  entry: CollectionEntry<"blog">;
  isOriginal: boolean;
  meta: BlogEntryMeta;
  translations: EntryTranslationReference[];
}

export interface EntryTranslationReference {
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
