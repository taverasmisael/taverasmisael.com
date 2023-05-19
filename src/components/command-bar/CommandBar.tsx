import { debounce } from "@solid-primitives/scheduled";
import { Show, createEffect, createMemo, createResource, createSignal } from "solid-js";
import { hideCommandBar, commandBarState, CommandBarMode } from "@/stores/command-bar.store";
import SearchResults from "./SearchResults";
import type { CommandBarLinkItem } from "./command-bar-item.type";
import { getEntryURL } from "@/utils/content";
import { useTranslation, type Language } from "@/utils/i18n";

export default function CommandBar(props: { lang: Language }) {
  let ref: HTMLDialogElement;
  const t = useTranslation(props.lang);
  const [command, setCommand] = createSignal<string>();
  const [results] = createResource(command, fetchSearchResults);

  const mappedResults = createMemo<CommandBarLinkItem[]>(() => {
    const response = results();
    if (!response) return [];
    console.log(response);
    return response.items.map(
      item =>
        ({
          id: item.objectID,
          title: item.title,
          href: getEntryURL("blog", item.objectID),
          type: "link",
        } satisfies CommandBarLinkItem)
    );
  });

  const onCommandChange = debounce((e: Event) => {
    const target = e.target as HTMLInputElement;
    setCommand(target.value.length >= 3 ? target.value : undefined);
  }, 1000);

  createEffect(() => {
    // NOTE: There's a reported (by me) issue with Arc Browser, where
    // the inert attribute causes the page to crash for some reason.
    // So for now no inert. The good news is that we don't "neeed" it because
    // we are using a dialog element, which has all the accessibility benefits.
    if (commandBarState.isVisible) ref.showModal();
    ref.addEventListener("close", () => {
      setCommand("");
      hideCommandBar();
    });
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
      ref={c => (ref = c)}
      class="h-100 flex w-full justify-center bg-transparent backdrop:bg-neutral-950/80 md:-top-1/3"
    >
      <div class="container h-fit w-full max-w-4xl rounded-lg border-slate-100 bg-slate-50 p-2 shadow-xl md:p-4">
        <div class="flex w-full rounded-lg bg-white ring-blue-50 focus-within:ring-2">
          <div class="flex items-center justify-center pl-2 pr-0 text-slate-600 md:pl-4">
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
            class="flex-1 appearance-none p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none md:p-4"
            placeholder={t("ui", "commandbar.placeholder")}
            type="text"
            onInput={onCommandChange}
          />
        </div>
        <Show when={command()}>
          <SearchResults
            isLoading={results.loading}
            loadingMessage={t("ui", "commandbar.loading")}
            emptyMessage={t("ui", "commandbar.empty")}
            items={mappedResults()}
          />
        </Show>
      </div>
    </dialog>
  );
}

interface SearchResult {
  objectID: string;
  title: string;
}

interface SearchResponse {
  items: SearchResult[];
}

function fetchSearchResults(query: string): Promise<SearchResponse> {
  return fetch(`/api/search?query=${query}`).then(res => res.json()) as Promise<SearchResponse>;
}
