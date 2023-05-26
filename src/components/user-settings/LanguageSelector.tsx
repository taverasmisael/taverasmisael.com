import { createMemo, createSignal } from "solid-js";
import { Select } from "@kobalte/core";
import { type EntryTranslationReference } from "@/utils/content";
import { useTranslation, type Language, getLanguageName } from "@/utils/i18n";

interface Props {
  lang: Language;
  options: EntryTranslationReference[];
  value: EntryTranslationReference;
}

export default function LanguageSelector(props: Props) {
  const t = useTranslation(props.lang);

  // We do not need to set the value, because we navigate to translated page
  const [value] = createSignal(props.value);
  const shouldDisable = createMemo(() => props.options.length <= 1);

  const setValue = (val: EntryTranslationReference) => {
    window.location.href = val.slug;
  };

  return (
    <>
      <Select.Root
        disabled={shouldDisable()}
        value={value()}
        title={shouldDisable() ? "No translations available" : "Select a language…"}
        onChange={setValue}
        options={props.options}
        optionValue={"lang"}
        optionDisabled={p => p.lang === props.lang}
        placeholder="Select a language…"
        itemComponent={p => (
          <Select.Item
            item={p.item}
            class="cursor-default appearance-none border-none p-2 outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-[disabled=false]:hover:bg-slate-900/80"
          >
            <Select.ItemLabel>{getLanguageName(p.item.rawValue.lang)}</Select.ItemLabel>
          </Select.Item>
        )}
      >
        <Select.Trigger
          aria-label="Change language"
          class="w-full rounded-md bg-white px-6 py-2 shadow ring-1 ring-slate-700 focus:outline-none focus:ring aria-expanded:ring-2 dark:bg-slate-800"
        >
          <Select.Value<string> class="flex items-center gap-2">
            {getLanguageName(value().lang)}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
              />
            </svg>
          </Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Listbox class="w-full overflow-hidden rounded shadow-md outline-none dark:bg-slate-800" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
}
