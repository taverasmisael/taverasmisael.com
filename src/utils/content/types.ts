import { type CollectionEntry, getCollection } from "astro:content";
import { type Language } from "@/utils/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CollectionNames = typeof getCollection extends (name: infer T, ...args: any[]) => any ? T : never;
export const Collections = {
  blog: "blog",
  testimonial: "testimonial",
  author: "author",
} as const satisfies Record<string, CollectionNames>;

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

type EntryType = BlogEntry | TestimonialEntry;

export interface Entry extends Record<CollectionKey, EntryType> {
  blog: BlogEntry;
  testimonial: TestimonialEntry;
}
