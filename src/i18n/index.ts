import Spanish from "./es.json";
import English from "./en.json";

type BaseLocale = typeof Spanish;

export const LANGUAGES = ['es', 'en'] as const
export type Language = typeof LANGUAGES[number];

export const DEFAULT_LOCALE = "es" satisfies Language;

export const locales = {
  es: Spanish,
  en: English,
} as const satisfies Record<Language, BaseLocale>;

export const PAGE_NAMES = ['blog', 'about', 'contact'] as const
export type PageName = typeof PAGE_NAMES[number];
type PageURL = Record<PageName, Readonly<Record<Language, string>>>

export const PAGE_URLS = {
  blog: {
    es: "/es/blog",
    en: "/en/blog",
  },
  about: {
    es: "/es/sobre-mi",
    en: "/en/about",
  },
  contact: {
    es: "/es/contacto",
    en: "/en/contact",
  },
} as const satisfies PageURL

export type LocaleDomain = keyof BaseLocale