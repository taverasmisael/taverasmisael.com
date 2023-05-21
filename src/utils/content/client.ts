import { type Language } from "@/utils/i18n";
import { getPublicEnv } from "@/utils/env";
import { type CollectionKey, Collections } from "./types";

const env = getPublicEnv();

export function getCollectionName(key: string): undefined | (typeof Collections)[CollectionKey] {
  return Collections[key as CollectionKey];
}

export function getEntryURL(entryType: CollectionKey, slug: string): string {
  const collection = getCollectionName(entryType);

  if (!collection) throw new Error(`Invalid collection name: ${entryType}`);

  const [lang, rawSlug] = slug.split("/") as [Language, string];
  return `/${lang}/${collection}/${rawSlug}`;
}

export function slugToCanonical(slug: string, base: string = env.SITE): string {
  return new URL(slug, base).toString();
}
