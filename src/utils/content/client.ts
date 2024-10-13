import type { Language } from "@/utils/i18n";
import { type CollectionKey, Collections } from "./types";

// We know SITE is defined because we triple check on build time.
// The idea behind not using this here is to avoid the need to import zod in the client.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const SITE: string = import.meta.env.SITE || "";

export function getCollectionName(key: string): undefined | (typeof Collections)[CollectionKey] {
  return Collections[key as CollectionKey];
}

export function getEntryURL(entryType: CollectionKey, id: string): string {
  const collection = getCollectionName(entryType);

  if (!collection) throw new Error(`Invalid collection name: ${entryType}`);

  const [lang, rawSlug] = id.split("/") as [Language, string];
  return `/${lang}/${collection}/${rawSlug}`;
}

export function slugToCanonical(id: string, base: string = SITE): string {
  return new URL(id, base).toString();
}
