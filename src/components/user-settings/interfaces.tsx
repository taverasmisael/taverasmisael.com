import type { EntryTranslationReference } from "@/utils/content";
import type { Language } from "@/utils/i18n";

export type ThemeOption = "dark" | "light" | "auto";
export type ThemeSelectorProps = {
  localeStrings: {
    selectTheme: string;
    themes: Record<ThemeOption, string>;
  };
};

export type LanguageSelectorProps = {
  lang: Language;
  options: Array<EntryTranslationReference & { name: string }>;
  value: EntryTranslationReference;
  localeStrings: { selectLanguage: string; unavailable: string };
};
