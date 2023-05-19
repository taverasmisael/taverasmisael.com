import { For, Show } from "solid-js";
import type { CommandBarItem } from "./command-bar-item.type";

interface SearchResultsProps {
  items: CommandBarItem[];
  emptyMessage: string;
  isLoading: boolean;
  loadingMessage: string;
}

export default function SearchResults(props: SearchResultsProps) {
  return (
    <div class="mt-2 max-h-72 overflow-auto">
      <Show
        when={props.items.length}
        fallback={
          <p class="p-2 text-center text-lg text-slate-950 md:p-4">
            {props.isLoading ? props.loadingMessage : props.emptyMessage}
          </p>
        }
      >
        <ul class="m-0 appearance-none divide-y divide-blue-50">
          <For each={props.items}>
            {item => (
              <li>
                {item.type === "link" ? (
                  <a
                    href={item.href}
                    class="md:text-md block rounded p-2 text-sm transition-all hover:bg-slate-100 hover:text-blue-700 focus:bg-slate-200 focus:text-blue-700 focus-visible:outline-none active:bg-slate-200 active:text-blue-700 md:p-4"
                  >
                    <span class="flex items-center justify-between">
                      <span>{item.title}</span>
                      {item.icon}
                    </span>
                    {item.description && (
                      <span class="mt-2 inline-block max-w-3xl truncate text-xs text-slate-400">
                        {item.description}
                      </span>
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
      </Show>
    </div>
  );
}
