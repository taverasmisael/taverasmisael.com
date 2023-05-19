import { For, Switch, Match } from "solid-js";
import type { CommandBarItem } from "./command-bar-item.type";
import styles from  './CommandBarStyles.module.css'

interface SearchResultsProps {
  items: CommandBarItem[];
  emptyMessage: string;
  isLoading: boolean;
  loadingMessage: string;
  isError: boolean;
  errorMessage: string;
}

export default function SearchResults(props: SearchResultsProps) {
  return (
    <div class="mt-2 max-h-72 overflow-auto md:mt-4">
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
        <Match when={props.items.length && !props.isLoading && !props.isError}>
          <ul class="m-0 appearance-none divide-y divide-blue-50 dark:divide-slate-800/20">
            <For each={props.items}>
              {item => (
                <li>
                  {item.type === "link" ? (
                    <a
                      href={item.href}
                      class="transition-color block rounded p-2 text-sm hover:bg-slate-100 hover:text-blue-700 focus:bg-slate-200 focus:text-blue-700 focus-visible:outline-none active:bg-slate-200 active:text-blue-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-blue-50 
                    dark:focus:bg-slate-800 dark:focus:text-blue-50 dark:active:bg-slate-800 dark:active:text-blue-50 md:p-4 md:text-lg
                    "
                    >
                      <span class="flex items-center justify-between">
                        <span>{item.title}</span>
                        {item.icon}
                      </span>
                      {item.description && (
                        <span class={`mt-2 inline-block max-w-3xl truncate text-xs text-slate-400 ${styles.description}`} innerHTML={item.description} />
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
