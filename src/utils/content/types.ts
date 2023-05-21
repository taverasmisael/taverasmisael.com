import { type CollectionEntry, type getCollection } from "astro:content";
import { type Language } from "@/utils/i18n";

export const Collections = {
  blog: "blog",
} as const satisfies Record<string, Parameters<typeof getCollection>["0"]>;

export type CollectionKey = keyof typeof Collections;
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
  formattedDate: string;
  description: string;
  lang: Language;
  ogTitle: string;
  ogType: string;
  title: string;
}

export type Entry = BlogEntry;
