// TODO: P2 - Optimize this file and the whole i18n module to only load the needed translations #9
import { pathOr } from "rambda";
import {
  LANGUAGES,
  DEFAULT_LOCALE,
  PAGE_URLS,
  PAGE_NAMES,
  LANGUAGES_NAMES,
  type LocaleSet,
  type PageName,
  type Language,
  type LocaleDomain,
  type BaseLocale,
} from "@/i18n";

export function isSupportedLang(lang: string): lang is Language {
  return LANGUAGES.includes(lang);
}

export function getLocalizedPage(locale: Language, page: PageName) {
  return `/${locale}/${PAGE_URLS[page]}`;
}

const missingTranslationParams = (translation: string, translationId: string) => {
  const missingParams = translation.match(/{{(.*?)}}/g);
  if (missingParams) {
    console.warn(`Missing params for ${translationId}: ${missingParams.join(", ")}`);
  }
};

export type UseTranslation<TLocale extends Language> = <
  TDomain extends LocaleDomain,
  TKey extends keyof LocaleSet[TLocale][TDomain],
  Params extends Record<string, string>,
>(
  domain: TDomain,
  key: TKey,
  params?: Params,
) => string;

export async function useTranslation<TLocale extends Language>(locale: TLocale): Promise<UseTranslation<TLocale>> {
  try {
    if (!isSupportedLang(locale)) throw new Error(`Language ${locale} is not supported`);
    const translations = (await import(`../i18n/${locale}.json`)) as BaseLocale;
    return (domain, key, params?: Record<string, string>): string => {
      const strKey = key.toString();
      const translationId = `${domain}.${strKey}`;
      const translation = pathOr(`TODO: ${translationId}`, [domain, strKey], translations);
      if (translation.startsWith("TODO")) console.warn(`Missing translation for ${translationId}`);
      if (translation.startsWith("[NOTE]: "))
        console.error(
          `Translation ${translationId} is not meant to be used, at least on this locale (${locale}).\n ${translation}`,
        );
      if (translation.includes("{{") && !params) missingTranslationParams(translation, `${translationId}`);

      if (params) {
        const processedTranslation = Object.entries(params).reduce(
          (acc, [k, v]) => acc.replace(`{{${k}}}`, v),
          translation,
        );

        if (processedTranslation.includes("{{")) missingTranslationParams(processedTranslation, `${translationId}`);

        return processedTranslation;
      }
      return translation;
    };
  } catch (e) {
    console.error("There was an error importing the translation", e);

    return (domain, key) => `E-${domain}.${key.toString()}`;
  }
}

export function getLanguageName(lang: Language): string {
  if (!isSupportedLang(lang)) return lang;
  return LANGUAGES_NAMES[lang];
}

// Re exporting some types to avoid src to use the i18n module directly
export { PAGE_NAMES, DEFAULT_LOCALE, LANGUAGES, type Language, type PageName };
