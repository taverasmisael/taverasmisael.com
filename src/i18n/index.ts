import Spanish from "./es.json";
import English from "./en.json";

type BaseLocale = typeof Spanish;

export const LANGUAGES = ["es", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LOCALE = "es" satisfies Language;

export type LocaleSet = Record<Language, BaseLocale>;

export const locales = {
  es: Spanish,
  en: English,
} as const satisfies LocaleSet;

export const PAGE_NAMES = ["home", "blog", "about", "contact", "feed"] as const;
export type PageName = (typeof PAGE_NAMES)[number];
type PageURL = Record<PageName, Readonly<string>>;

export const PAGE_URLS = {
  // This might look silly now, but maybe in the future the keys and values will be different.
  // For example, if we want to have a "promo23" page, we can have it as a key, but the URL
  // can be "promo-2023" or something like that.
  home: "",
  blog: "blog",
  about: "about",
  contact: "contact",
  feed: "rss.xml",
} as const satisfies PageURL;

export type LocaleDomain = keyof BaseLocale;

export const LANGUAGES_NAMES = {
  es: "Español",
  en: "English",
} as const satisfies Record<Language, string>;
