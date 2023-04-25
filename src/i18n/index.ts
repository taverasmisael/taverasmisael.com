import Spanish from "./es.json";
import English from "./en.json";

const locales = {
  es: Spanish,
  en: English,
} as const;

export default locales;

export type LocaleKey = keyof typeof locales;
export const languages = {
  es: "Español",
  en: "English",
} as const;

export const DEFAULT_LOCALE = "es";
