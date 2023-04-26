import { pathOr } from "rambda";
import {
  locales,
  DEFAULT_LOCALE,
  PAGE_URLS,
  PAGE_NAMES,
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

export function useTranslation(locale: Language) {
  return (domain: LocaleDomain, key: string): string => {
    return pathOr(`TODO: ${domain}.${key}`, [domain, key], locales[locale]);
  };
}

// Re exporting some types to avoid src to use the i18n module directly
export { PAGE_NAMES, DEFAULT_LOCALE, type Language, type PageName };
