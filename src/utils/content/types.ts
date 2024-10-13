import type { CollectionEntry } from "astro:content";
import type { Language } from "@/utils/i18n";

export const Collections = {
  blog: "blog",
  testimonial: "testimonial",
  author: "author",
} as const;

export type CollectionKey = keyof typeof Collections;
export interface BlogEntry {
  entry: CollectionEntry<"blog">;
  isOriginal: boolean;
  meta: BlogEntryMeta;
  translations: EntryTranslationReference[];
}

// The testimonials are not as complex as post, they don't need 1/1 translations, so we can just
// use the same type for both instead of having a custom type, like with BlogEntry.
export type TestimonialEntry = CollectionEntry<"testimonial">;

export interface EntryTranslationReference {
  isOriginal?: boolean;
  lang: Language;
  id: string;
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

type EntryType = BlogEntry | TestimonialEntry;

export interface Entry extends Record<CollectionKey, EntryType> {
  blog: BlogEntry;
  testimonial: TestimonialEntry;
}
