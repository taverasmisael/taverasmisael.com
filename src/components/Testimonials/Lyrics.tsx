import { For } from "solid-js";
import { getCurrentLines, state } from "./store";

export default function TestimonialsLyrics() {
  return (
    <div
      class={`mx-auto mb-8 max-h-80 overflow-auto scroll-smooth rounded-md ${
        state.colors.background || "bg-red-500"
      } p-4`}
    >
      <div class={`m-auto max-w-xl text-2xl font-semibold leading-relaxed ${state.colors.inactive || "text-red-950"}`}>
        <For each={getCurrentLines()}>
          {(line, i) => (
            // TODO: Use the real logic for active state (there's also a "previously active" state) WIP
            <span class="contents" classList={{ [state.colors.active]: i() === 0 }}>
              {line}{" "}
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
