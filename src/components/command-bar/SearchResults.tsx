import { For, Switch, Match, type Accessor, createEffect } from "solid-js";
import type { CommandBarItem } from "./command-bar-item.type";
import styles from "./CommandBarStyles.module.css";

interface SearchResultsProps {
  items: CommandBarItem[];
  selected: Accessor<CommandBarItem | undefined>;
  emptyMessage: string;
  isLoading: boolean;
  loadingMessage: string;
  isError: boolean;
  errorMessage: string;
}

export default function SearchResults(props: SearchResultsProps) {
  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (containerRef) {
      if (props.selected())
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we check for undefined above
        containerRef.querySelector(`#${props.selected()!.id}`)?.scrollIntoView({ block: "nearest" });
    }
  });

  return (
    <div ref={r => (containerRef = r)} class="max-h-72 overflow-auto p-2 md:py-4">
      <Switch
        fallback={<p class="p-2 text-center text-lg text-slate-950 dark:text-blue-50 md:p-4">{props.errorMessage}</p>}
      >
        <Match when={props.isError}>
          <p class="p-2 text-center text-lg text-slate-950 dark:text-blue-50 md:p-4">{props.errorMessage}</p>
        </Match>
        <Match when={props.isLoading}>
          <p class="p-2 text-center text-lg text-slate-950 dark:text-blue-50 md:p-4">{props.loadingMessage}</p>
        </Match>
        <Match when={!props.items.length}>
          <p class="p-2 text-center text-lg text-slate-950 dark:text-blue-50 md:p-4">{props.emptyMessage}</p>
        </Match>
        <Match when={props.items.length}>
          <ul
            id="search-results"
            role="listbox"
            class="m-0 appearance-none divide-y divide-blue-50 dark:divide-slate-800/20"
          >
            <For each={props.items}>
              {item => (
                <li
                  id={item.id}
                  role="option"
                  aria-selected={false} // We don't need to select, just highlight.
                  class="group"
                  aria-labelledby={`${item.id}-desc`}
                >
                  {item.type === "link" ? (
                    <a
                      href={item.href}
                      class="transition-color aria-selected-visible:outline-none block rounded p-2 text-sm hover:bg-slate-100 hover:text-blue-700 active:bg-slate-200 active:text-blue-700 dark:text-slate-100 dark:hover:bg-gray-900 dark:hover:text-blue-50
                    dark:active:bg-gray-900 dark:active:text-blue-50  md:p-4 md:text-lg
                    "
                      classList={{
                        "bg-slate-200 text-blue-700 dark:bg-gray-900 dark:text-blue-50":
                          props.selected()?.id === item.id,
                      }}
                    >
                      <div id={`${item.id}-desc`} class="flex items-center justify-between">
                        <span class="font-display">{item.title}</span>
                        {item.icon}
                      </div>
                      {item.description && (
                        <div
                          class={`mt-2 inline-block max-w-full truncate text-xs text-slate-400 ${styles.description}`}
                          innerHTML={item.description}
                        />
                      )}
                    </a>
                  ) : (
                    <button type="button" class="apparence-none">
                      {item.title}
                    </button>
                  )}
                </li>
              )}
            </For>
          </ul>
        </Match>
      </Switch>
    </div>
  );
}
