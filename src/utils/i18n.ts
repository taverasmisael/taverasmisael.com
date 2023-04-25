import locales, { DEFAULT_LOCALE, type LocaleKey } from "@/i18n";

export function getFullLocalizedPath(locale: string) {
  return (path: string): string => {
    return `/${locale || DEFAULT_LOCALE}${path}/`;
  };
}

export function getLangFromUrl(url: URL, withFallback?: boolean): string {
  const [, lang] = url.pathname.split("/");

  if (withFallback) {
    return isSupportedLang(lang) ? lang : DEFAULT_LOCALE;
  }

  return lang;
}

export function isSupportedLang(lang: string): lang is LocaleKey {
  return lang in locales;
}

export { DEFAULT_LOCALE };
