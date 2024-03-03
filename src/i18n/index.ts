export type BaseLocale = typeof import("./es.json");

export const LANGUAGES = ["es", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LOCALE = "es" satisfies Language;

export type LocaleSet = Record<Language, BaseLocale>;

export const PAGE_NAMES = ["home", "about", "blog", "contact", "feed"] as const;
export type PageName = (typeof PAGE_NAMES)[number];
type PageURL = Record<PageName, Readonly<string>>;

export const PAGE_URLS = {
  // ~~This might look silly now, but maybe in the future the keys and values will be different.~~
  // We now have feed->rss.xml, so it's not silly anymore.
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
