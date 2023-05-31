import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Select } from "@kobalte/core";
import { useTranslation, type Language } from "@/utils/i18n";

import { SelectItem, SelectTrigger, SelectValue, SelectListbox } from "./Select";

interface Props {
  lang: Language;
}

const options: ThemeOption[] = ["theme.dark", "theme.light"];
type ThemeOption = "theme.dark" | "theme.light";

export default function LanguageSelector(props: Props) {
  const t = useTranslation(props.lang);

  const [value, setValue] = createSignal<ThemeOption>("theme.light");

  onMount(() => {
    setValue(toThemeOption(localStorage.getItem("theme") ?? "auto"));
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeAutoTheme);
    onCleanup(() => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeAutoTheme);
    });
  });

  const changeAutoTheme = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setTheme = (value: ThemeOption) => {
    const theme = themeOptionToString(value);
    localStorage.setItem("theme", theme);
    setValue(value);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  createEffect(() => {
    console.log(value());
  });

  return (
    <>
      <Select.Root
        value={value()}
        title={t("ui", "theme.select")}
        onChange={setTheme}
        options={options}
        placeholder={t("ui", "theme.select")}
        itemComponent={p => (
          <SelectItem item={p.item}>
            <Select.ItemLabel>{t("ui", p.item.rawValue)}</Select.ItemLabel>
          </SelectItem>
        )}
      >
        <SelectTrigger aria-label={t("ui", "theme.select")}>
          <SelectValue class="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4">
              {value() === "theme.dark" ? (
                <path
                  fill-rule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clip-rule="evenodd"
                />
              ) : (
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              )}
            </svg>

            <span>{t("ui", value())}</span>
          </SelectValue>
        </SelectTrigger>
        <Select.Portal>
          <Select.Content>
            <SelectListbox />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}

const toThemeOption = (theme: string): ThemeOption =>
  theme === "light" || theme === "dark" ? `theme.${theme}` : "theme.light";

const themeOptionToString = (theme: ThemeOption): string => theme.split(".")[1];
