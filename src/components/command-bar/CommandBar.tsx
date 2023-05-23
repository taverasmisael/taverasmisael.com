import { CommandBarMode, commandBarState, hideCommandBar } from "@/stores/command-bar.store";
import { useTranslation, type Language } from "@/utils/i18n";
import { debounce } from "@solid-primitives/scheduled";
import { Show, createEffect, createMemo, createResource, createSignal, onMount } from "solid-js";
import SearchResults from "./SearchResults";
import type { CommandBarLinkItem } from "./command-bar-item.type";
import { getEntryURL } from "@/utils/content/client";

export default function CommandBar(props: { lang: Language }) {
  let dialogRef: HTMLDialogElement;
  const t = useTranslation(props.lang);
  const [command, setCommand] = createSignal<string>();
  const [results] = createResource(command, fetchSearchResults);

  const onCommandChange = debounce((e: Event) => {
    const target = e.target as HTMLInputElement;
    setCommand(target.value.length >= 3 ? target.value : undefined);
  }, 1000);

  createEffect(() => {
    if (commandBarState.isVisible) dialogRef.showModal();
  });

  onMount(() => {
    const closeDialog = () => {
      setCommand(undefined);
      hideCommandBar();
    };
    dialogRef.addEventListener("close", closeDialog);

    return () => dialogRef.addEventListener("close", closeDialog);
  });

  const icon = createMemo(() =>
    commandBarState.mode === CommandBarMode.Search ? (
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    ) : (
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    )
  );

  // I am seriously considering ditching the dialog and just using a div with a backdrop filter.
  // The dialog is a pain to interact, the only "benefit" I'm getting is the tab trapping, but
  // I'm not sure it's worth it. There's so much more I want to do with the command bar, and
  // the dialog is just getting in the way.
  return (
    <dialog
      ref={c => (dialogRef = c)}
      class="h-100 w-full justify-center bg-transparent backdrop:bg-neutral-950/80 md:-top-1/3"
      classList={{ flex: commandBarState.isVisible, hidden: !commandBarState.isVisible }}
    >
      <Show when={commandBarState.isVisible}>
        <div class="container h-fit w-full max-w-4xl rounded border-slate-100 bg-blue-50 p-2 shadow-xl dark:border-slate-900 dark:bg-slate-700 md:p-4">
          <div class="relative flex w-full overflow-hidden rounded bg-white ring-blue-100 focus-within:ring-2 dark:bg-slate-600 dark:ring-slate-500">
            <div class="flex items-center justify-center pl-2 pr-0 text-slate-600 dark:text-blue-50 md:pl-4">
              <svg
                class="w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {icon()}
              </svg>
            </div>
            <label for="command-bar-input" class="sr-only">
              {t("ui", "search")}
            </label>
            <input
              id="command-bar-input"
              name="command-bar-input"
              class="flex-1 appearance-none bg-white p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-600 dark:text-blue-50 dark:placeholder:text-slate-300 md:p-4"
              placeholder={t("ui", "commandbar.placeholder.search")}
              autocomplete="off"
              autoCapitalize="none"
              autocorrect="off"
              spellcheck={false}
              type="text"
              onInput={onCommandChange}
            />
          </div>
          <Show when={command()}>
            <SearchResults
              isLoading={results.loading}
              isError={!!results.error}
              errorMessage={t("ui", "commandbar.error")}
              loadingMessage={t("ui", "commandbar.loading")}
              emptyMessage={t("ui", "commandbar.empty")}
              items={results() ?? []}
            />
          </Show>
          <Show when={command() && commandBarState.mode === CommandBarMode.Search}>
            <div class="flex items-center gap-2 p-4 text-sm text-slate-400 dark:text-slate-50">
              <span>{t("messages", "serch_powered_by")}</span>
              <svg viewBox="0 0 500 500.34" class="w-4 text-[#003dff] dark:text-slate-50">
                <path
                  d="M250 0C113.38 0 2 110.16.03 246.32c-2 138.29 110.19 252.87 248.49 253.67 42.71.25 83.85-10.2 120.38-30.05 3.56-1.93 4.11-6.83 1.08-9.52l-23.39-20.74c-4.75-4.22-11.52-5.41-17.37-2.92-25.5 10.85-53.21 16.39-81.76 16.04-111.75-1.37-202.04-94.35-200.26-206.1C48.96 136.37 139.26 47.15 250 47.15h202.83v360.53L337.75 305.43c-3.72-3.31-9.43-2.66-12.43 1.31-18.47 24.46-48.56 39.67-81.98 37.36-46.36-3.2-83.92-40.52-87.4-86.86-4.15-55.28 39.65-101.58 94.07-101.58 49.21 0 89.74 37.88 93.97 86.01.38 4.28 2.31 8.28 5.53 11.13l29.97 26.57c3.4 3.01 8.8 1.17 9.63-3.3 2.16-11.55 2.92-23.6 2.07-35.95-4.83-70.39-61.84-127.01-132.26-131.35-80.73-4.98-148.23 58.18-150.37 137.35-2.09 77.15 61.12 143.66 138.28 145.36 32.21.71 62.07-9.42 86.2-26.97L483.39 497.8c6.45 5.71 16.62 1.14 16.62-7.48V9.49C500 4.25 495.75 0 490.51 0H250z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </Show>
          <button
            type="button"
            onClick={() => dialogRef.close()}
            class="fixed right-8 top-6 rounded-full bg-slate-950/30 p-2 text-slate-50"
            title={t("ui", "close")}
          >
            <svg
              class="w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </Show>
    </dialog>
  );
}

interface SearchResult {
  id: string;
  title: string;
  matches: { key: string; value: string }[];
}

interface SearchResponse {
  items: SearchResult[];
}

function getRelevantMatch(matches: { key: string; value: string }[]): string {
  if (!matches.length) return "";
  return matches.sort((a, b) => {
    if (a.key === "body" || a.key === "excerpt") return -1;
    if (b.key === "body" || b.key === "excerpt") return 1;
    return 0;
  })[0].value;
}

async function fetchSearchResults(query: string): Promise<CommandBarLinkItem[]> {
  const response = await fetch(`/api/search?query=${query}`);
  if (!response.ok) throw new Error("Something went wrong");
  const data = (await response.json()) as SearchResponse;
  return data.items.map(
    item =>
      ({
        id: item.id,
        title: item.title,
        href: getEntryURL("blog", item.id),
        description: getRelevantMatch(item.matches),
        type: "link",
      } satisfies CommandBarLinkItem)
  );
}
