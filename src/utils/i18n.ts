import { pathOr } from "rambda";
import {
  locales,
  LANGUAGES,
  DEFAULT_LOCALE,
  PAGE_URLS,
  PAGE_NAMES,
  LANGUAGES_NAMES,
  type LocaleSet,
  type PageName,
  type Language,
  type LocaleDomain,
} from "@/i18n";

export function getFullLocalizedPath(locale: string) {
  return (path: string): string => {
    return `/${locale || DEFAULT_LOCALE}${path}`;
  };
}

export function getLangFromUrl<T extends boolean = false>(
  url: URL,
  withFallback?: T
): T extends true ? Language : string {
  const [, lang] = url.pathname.split("/");

  if (withFallback) {
    return isSupportedLang(lang) ? lang : DEFAULT_LOCALE;
  }

  return lang as T extends true ? Language : string;
}

export function isSupportedLang(lang: string): lang is Language {
  return lang in locales;
}

export function getLocalizedPage(locale: Language, page: PageName): string {
  return PAGE_URLS[page][locale];
}

export function useTranslation<TLocale extends Language>(locale: TLocale) {
  // Future Misael, the trick here is to put TDomain and TKey on the returned function instead of the useTranslation
  return <TDomain extends LocaleDomain, TKey extends keyof LocaleSet[TLocale][TDomain]>(
    domain: TDomain,
    key: TKey
  ): string => {
    return pathOr(`TODO: ${domain}.${key.toString()}`, [domain, key as string], locales[locale]);
  };
}

export function getLanguageName(lang: Language): string {
  if (!isSupportedLang(lang)) return lang;
  return LANGUAGES_NAMES[lang];
}

// Re exporting some types to avoid src to use the i18n module directly
export { PAGE_NAMES, DEFAULT_LOCALE, LANGUAGES, type Language, type PageName };
