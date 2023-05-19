import { debounce } from "@solid-primitives/scheduled";
import { Show, createEffect, createMemo, createResource, createSignal } from "solid-js";
import { hideCommandBar, commandBarState, CommandBarMode } from "@/stores/command-bar.store";
import SearchResults from "./SearchResults";
import type { CommandBarLinkItem } from "./command-bar-item.type";
import { getEntryURL } from "@/utils/content";
import { useTranslation, type Language } from "@/utils/i18n";

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
    dialogRef.addEventListener("close", () => {
      setCommand(undefined);
      hideCommandBar();
    });

    return () => dialogRef.close();
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

  return (
    <dialog
      aria-hidden="true"
      ref={c => (dialogRef = c)}
      class="h-100 flex w-full justify-center bg-transparent backdrop:bg-neutral-950/80 md:-top-1/3"
    >
      <Show when={commandBarState.isVisible}>
        <div onClick={() => dialogRef.close()} class="fixed inset-0 -z-10" aria-hidden="true" />
      </Show>
      <div class="container h-fit w-full max-w-4xl rounded border-slate-100 bg-slate-50 p-2 shadow-xl dark:border-slate-900 dark:bg-slate-700 md:p-4">
        <div class="relative flex w-full overflow-hidden rounded bg-white ring-blue-50 focus-within:ring-2 dark:bg-slate-600 dark:ring-slate-500">
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
            autofocus
            id="command-bar-input"
            name="command-bar-input"
            class="flex-1 appearance-none bg-white p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-600 dark:text-blue-50 dark:placeholder:text-slate-300 md:p-4"
            placeholder={t("ui", "commandbar.placeholder")}
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
      </div>
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
