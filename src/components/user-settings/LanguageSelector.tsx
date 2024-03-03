import { For, createMemo, createSignal } from "solid-js";
import type { LanguageSelectorProps } from "./interfaces";

export default function LanguageSelector(props: LanguageSelectorProps) {
  // We do not need to set the value, because we navigate to translated page
  const [value] = createSignal(props.value);
  const shouldDisable = createMemo(() => props.options.length <= 1);
  const title = shouldDisable() ? props.localeStrings.unavailable : props.localeStrings.selectLanguage;
  const setValue = (e: Event) => (window.location.href = (e.currentTarget as HTMLSelectElement).value);

  return (
    <label
      for="lang-selector"
      class="relative rounded-md bg-white shadow ring-1 ring-blue-50 focus-within:outline-none focus-within:ring dark:bg-gray-950 dark:ring-gray-900"
    >
      <span class="sr-only">{title}</span>
      <select
        name="lang-selector"
        id="lang-selector"
        onChange={setValue}
        title={title}
        disabled={shouldDisable()}
        value={value().slug}
        class="w-full appearance-none bg-transparent px-4 py-2 pr-10 focus:outline-none disabled:opacity-50 aria-expanded:ring-2"
      >
        <For each={props.options}>
          {option => (
            <option value={option.slug} disabled={option.lang === props.lang} selected={value().lang === option.lang}>
              {option.name}
            </option>
          )}
        </For>
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="pointer-events-none absolute right-4 top-1/2 w-4 -translate-y-1/2 aria-disabled:opacity-50"
        aria-hidden="true"
        aria-disabled={shouldDisable()}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
        />
      </svg>
    </label>
  );
}
