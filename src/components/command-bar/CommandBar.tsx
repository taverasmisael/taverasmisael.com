import { Dialog } from "@kobalte/core";
import { debounce } from "@solid-primitives/scheduled";
import { createFetch, withAbort, withCatchAll, fetchRequest } from "@solid-primitives/fetch";
import { Show, createSignal, onCleanup, createEffect, createMemo } from "solid-js";
import { commandBarState, hideCommandBar, showCommandBar } from "@/stores/command-bar.store";
import { getEntryURL } from "@/utils/content/client";
import { useTranslation, type Language } from "@/utils/i18n";
import SearchResults from "./SearchResults";
import type { CommandBarItem, CommandBarLinkItem } from "./command-bar-item.type";
import { createComboboxStore } from "@/stores/combobox";
import { gTag } from "@/utils/analytics";
import { withMapper } from "./withMapper";

const fetcher = fetchRequest();

export default function CommandBar(props: { lang: Language }) {
  let inputRef: HTMLInputElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  const t = useTranslation(props.lang);
  const [command, setCommand] = createSignal<string>();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we check for undefined in the ternary
  const requestURL = createMemo(() => (command() ? `/api/search?query=${command()!}` : undefined));

  const [results, { abort }] = createFetch<CommandBarItem[]>(requestURL, { ...fetcher }, [
    withCatchAll(),
    withAbort(),
    withMapper(mapSearchResponse),
  ]);

  createEffect(() => gTag("event", "search", { search_term: command() }));

  const comboboxStore = createComboboxStore<CommandBarItem>([]);

  createEffect(() => comboboxStore.setItems(results() ?? []));

  const setCommandDebounced = debounce((v?: string) => setCommand(v), 500);

  const onCommandChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCommandDebounced(target.value.length >= 3 ? target.value : undefined);
  };

  const handleOpenChange = (v: boolean) => {
    if (v) {
      showCommandBar();
      gTag("event", "commandbar", "open");
    } else {
      if (abort) abort();
      hideCommandBar();
      setCommandDebounced();
      gTag("event", "commandbar", "close");
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Down":
      case "ArrowDown":
        e.preventDefault();
        comboboxStore.selectNext();
        break;
      case "Up":
      case "ArrowUp":
        e.preventDefault();
        comboboxStore.selectPrevious();
        break;
      case "Enter":
        e.preventDefault();
        handleSelection(comboboxStore.getSelectedItem());
        break;
    }
  };

  const handleSelection = (item: CommandBarItem | undefined) => {
    if (!item) return;
    if (item.type === "link") {
      const href = new URL(item.href, window.location.origin);

      window.location.href = href.toString();
      if (href.pathname === window.location.pathname) {
        hideCommandBar();
        setCommand(undefined);
        gTag("event", "commandbar", "refresh", href);
      } else {
        gTag("event", "commandbar", "link", href);
      }
    }
  };

  const onOpenAutoFocus = (e: Event) => {
    e.preventDefault();
    inputRef?.focus();

    // This can't be onMount nor onOpen because the dialog is not yet in the DOM
    if (contentRef) contentRef.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      if (contentRef) contentRef.removeEventListener("keydown", handleKeyDown);
    });
  };

  return (
    <Dialog.Root open={commandBarState.isVisible} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-sm" />
        <div class="fixed inset-0 z-50">
          <Dialog.Content ref={e => (contentRef = e)} onOpenAutoFocus={onOpenAutoFocus} class="contents">
            <div class="sr-only">
              <Dialog.Title>{t("ui", "search")}</Dialog.Title>
              <Dialog.Description>{t("ui", "commandbar.placeholder.search")}</Dialog.Description>
            </div>
            <div class="p-4 md:translate-y-32">
              <div class="container mx-auto h-fit w-full max-w-4xl rounded border-slate-100 bg-blue-50 p-2 shadow-xl dark:border-gray-900 dark:bg-gray-950 md:p-4">
                <div class="relative flex w-full overflow-hidden rounded bg-white ring-blue-100 focus-within:ring-2 dark:bg-gray-900 dark:ring-gray-800">
                  <div class="flex items-center justify-center pl-2 pr-0 text-slate-600 dark:text-blue-50 md:pl-4">
                    <svg
                      class="w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    autofocus
                    ref={r => (inputRef = r)}
                    aria-label={t("ui", "search")}
                    placeholder={t("ui", "commandbar.placeholder.search")}
                    aria-activeDescendant={comboboxStore.getSelectedItem()?.id}
                    enterkeyhint="go"
                    spellcheck={false}
                    id="command-bar-input"
                    name="command-bar-input"
                    class="flex-1 appearance-none bg-white p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-transparent dark:text-blue-50 dark:placeholder:text-gray-300 md:p-4"
                    role="combobox"
                    aria-controls="search-results"
                    aria-autocomplete="list"
                    autocomplete="off"
                    autoCapitalize="none"
                    autocorrect="off"
                    type="text"
                    onInput={onCommandChange}
                  />
                  <Dialog.CloseButton class="inline-block bg-blue-100 p-2 md:hidden">
                    {t("ui", "cancel")}
                  </Dialog.CloseButton>
                </div>
                <Show when={command()}>
                  <SearchResults
                    selected={comboboxStore.getSelectedItem}
                    isLoading={results.loading}
                    isError={!!results.error}
                    errorMessage={t("ui", "commandbar.error")}
                    loadingMessage={t("ui", "commandbar.loading")}
                    emptyMessage={t("ui", "commandbar.empty")}
                    items={results() ?? []}
                  />
                </Show>
                <Show when={command()}>
                  <div class="flex items-center gap-2 p-4 text-sm text-slate-400 dark:text-slate-50">
                    <span>{t("messages", "serch_powered_by")}</span>
                    <svg viewBox="0 0 500 500.34" aria-label="Algolia" class="w-4 text-[#003dff] dark:text-slate-50">
                      <path
                        d="M250 0C113.38 0 2 110.16.03 246.32c-2 138.29 110.19 252.87 248.49 253.67 42.71.25 83.85-10.2 120.38-30.05 3.56-1.93 4.11-6.83 1.08-9.52l-23.39-20.74c-4.75-4.22-11.52-5.41-17.37-2.92-25.5 10.85-53.21 16.39-81.76 16.04-111.75-1.37-202.04-94.35-200.26-206.1C48.96 136.37 139.26 47.15 250 47.15h202.83v360.53L337.75 305.43c-3.72-3.31-9.43-2.66-12.43 1.31-18.47 24.46-48.56 39.67-81.98 37.36-46.36-3.2-83.92-40.52-87.4-86.86-4.15-55.28 39.65-101.58 94.07-101.58 49.21 0 89.74 37.88 93.97 86.01.38 4.28 2.31 8.28 5.53 11.13l29.97 26.57c3.4 3.01 8.8 1.17 9.63-3.3 2.16-11.55 2.92-23.6 2.07-35.95-4.83-70.39-61.84-127.01-132.26-131.35-80.73-4.98-148.23 58.18-150.37 137.35-2.09 77.15 61.12 143.66 138.28 145.36 32.21.71 62.07-9.42 86.2-26.97L483.39 497.8c6.45 5.71 16.62 1.14 16.62-7.48V9.49C500 4.25 495.75 0 490.51 0H250z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </Show>
              </div>
            </div>
            <Dialog.CloseButton
              class="fixed right-8 top-6 hidden rounded-full bg-slate-950/30 p-2 text-slate-50 md:block"
              aria-label={t("ui", "close")}
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
            </Dialog.CloseButton>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
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

function mapSearchResponse(results: SearchResponse): CommandBarLinkItem[] {
  // I'm strongly considering moving this to the server
  return results.items.map(item => {
    const relevantMatch = getRelevantMatch(item.matches);
    const link = getEntryURL("blog", item.id);
    const result: CommandBarLinkItem = {
      type: "link",
      id: item.id.replaceAll("/", "-"),
      title: item.title,
      href: relevantMatch ? `${link}#:~:text=${matchToTextFragment(relevantMatch)}` : link,
      description: relevantMatch,
    };
    return result;
  });
}

// Remove ellipsis and highlight tags
function matchToTextFragment(value: string) {
  const cleanMatch = value.replace(/…/g, "").trim();
  const words = cleanMatch.split(" ").filter(Boolean);

  const matchIdx = words.findIndex(w => w.includes("<mark>"));
  const startIdx = Math.max(0, matchIdx - 1);
  const endIdx = Math.min(words.length - 1, matchIdx + 1);
  const start = encodeURIComponent(words[startIdx].replace(/<(\/)?mark>/g, ""));
  const match = encodeURIComponent(words[matchIdx].replace(/<(\/)?mark>/g, ""));
  const end = encodeURIComponent(words[endIdx].replace(/<(\/)?mark>/g, ""));

  return `${start}-,${match},-${end}`;
}
