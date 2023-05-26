import { createMemo, createSignal } from "solid-js";
import { Select } from "@kobalte/core";
import { type EntryTranslationReference } from "@/utils/content";
import { useTranslation, type Language, getLanguageName } from "@/utils/i18n";

import { SelectItem, SelectTrigger, SelectValue, SelectListbox } from "./Select";

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
    <Select.Root
      disabled={shouldDisable()}
      value={value()}
      title={shouldDisable() ? t("ui", "translation.not_available") : t("ui", "translation.select")}
      onChange={setValue}
      options={props.options}
      optionValue={"lang"}
      optionDisabled={p => p.lang === props.lang}
      placeholder={t("ui", "translation.select")}
      itemComponent={p => (
        <SelectItem item={p.item}>
          <Select.ItemLabel>{getLanguageName(p.item.rawValue.lang)}</Select.ItemLabel>
        </SelectItem>
      )}
    >
      <SelectTrigger aria-label={t("ui", "translation.select")}>
        <SelectValue>
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
        </SelectValue>
      </SelectTrigger>
      <Select.Portal>
        <Select.Content>
          <SelectListbox />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
