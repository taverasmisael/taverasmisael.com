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

export function isSupportedLang(lang: string): lang is Language {
  return lang in locales;
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

export function useTranslation<TLocale extends Language>(locale: TLocale) {
  // Future Misael, the trick here is to put TDomain and TKey on the returned function instead of the useTranslation
  return <
    TDomain extends LocaleDomain,
    TKey extends keyof LocaleSet[TLocale][TDomain],
    Params extends Record<string, string>
  >(
    domain: TDomain,
    key: TKey,
    params?: Params
  ): string => {
    const translationId = `${domain}.${key.toString()}`;
    const translation = pathOr(`TODO: ${translationId}`, [domain, key as string], locales[locale]);
    if (translation.startsWith("TODO")) console.warn(`Missing translation for ${translationId}`);
    if (translation.startsWith("[NOTE]: "))
      console.error(
        `Translation ${translationId} is not meant to be used, at least on this locale (${locale}).\n ${translation}`
      );
    if (translation.includes("{{") && !params) missingTranslationParams(translation, `${translationId}`);

    if (params) {
      const processedTranslation = Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
        translation
      );

      if (processedTranslation.includes("{{")) missingTranslationParams(processedTranslation, `${translationId}`);

      return processedTranslation;
    }
    return translation;
  };
}

export function getLanguageName(lang: Language): string {
  if (!isSupportedLang(lang)) return lang;
  return LANGUAGES_NAMES[lang];
}

// Re exporting some types to avoid src to use the i18n module directly
export { PAGE_NAMES, DEFAULT_LOCALE, LANGUAGES, type Language, type PageName };
