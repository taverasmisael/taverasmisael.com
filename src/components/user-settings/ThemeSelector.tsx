import { For, Match, Switch, createSignal, onCleanup, onMount } from "solid-js";
import type { ThemeOption, ThemeSelectorProps } from "./interfaces";

const options: ThemeOption[] = ["dark", "light", "auto"];

export default function LanguageSelector(props: ThemeSelectorProps) {
  const [value, setValue] = createSignal<ThemeOption>("auto");

  onMount(() => {
    setValue(toThemeOption(localStorage.getItem("theme") ?? "auto"));
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeAutoTheme);
    onCleanup(() => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeAutoTheme);
    });
  });

  const setTheme = (e: Event) => {
    const theme = (e.currentTarget as HTMLSelectElement).value as ThemeOption;
    localStorage.setItem("theme", theme);
    setValue(value);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <label
      for="theme-selector"
      class="relative rounded-md bg-white shadow ring-1 ring-blue-50 focus-within:outline-none focus-within:ring dark:bg-gray-950 dark:ring-gray-900"
    >
      <span class="sr-only">{props.localeStrings.selectTheme}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={true}
        viewBox="0 0 24 24"
        fill="currentColor"
        class="pointer-events-none absolute left-4 top-1/2 w-4 -translate-y-1/2"
      >
        <Switch>
          <Match when={value() === "dark"}>
            <path
              fill-rule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clip-rule="evenodd"
            />
          </Match>
          <Match when={value() === "light"}>
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </Match>
          <Match when={value() === "auto"}>
            <path
              fill-rule="evenodd"
              d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z"
              clip-rule="evenodd"
            />
          </Match>
        </Switch>
      </svg>
      <select
        name="theme-selector"
        id="theme-selector"
        onChange={setTheme}
        class="w-full appearance-none bg-transparent px-4 py-2 pl-10 focus:outline-none disabled:opacity-50 aria-expanded:ring-2"
      >
        <For each={options}>
          {option => (
            <option value={option} selected={value() === option}>
              {props.localeStrings.themes[option]}
            </option>
          )}
        </For>
      </select>
    </label>
  );
}

const toThemeOption = (theme: string): ThemeOption =>
  theme === "light" || theme === "dark" || theme === "auto" ? theme : "auto";

const changeAutoTheme = (e: MediaQueryListEvent) =>
  e.matches ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
