import type { EntryTranslationReference } from "@/utils/content";
import type { Language } from "@/utils/i18n";
import type { AstroBuiltinAttributes } from "astro";

type OGTypes = "website" | "article" | "blog" | "author";
export interface DefaultLayoutProps {
  title: string;
  canonical: string;
  image?: string;
  ogType?: OGTypes;
  lang?: Language;
  description: string;
  class?: string;
  "class:list"?: AstroBuiltinAttributes["class:list"];
  fullHeight?: boolean;
  translations: EntryTranslationReference[];
}
