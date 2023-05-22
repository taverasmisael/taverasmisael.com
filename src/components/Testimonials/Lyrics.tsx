import { For, createMemo } from "solid-js";
import { getCurrentProgress, getCurrentLines, getColors } from "./store";

export default function TestimonialsLyrics() {
  const activeLine = createMemo(() => {
    const lines = getCurrentLines();
    const progress = getCurrentProgress();
    return Math.floor((progress / 100) * lines.length);
  });

  return (
    <div class={`mx-auto mb-8 max-h-80 w-full overflow-auto rounded-md p-6 ${getColors().background || "bg-blue-500"}`}>
      <div class={`m-auto max-w-xl text-2xl font-semibold leading-relaxed ${getColors().inactive || "text-blue-950"}`}>
        <For each={getCurrentLines()}>
          {(line, i) => (
            // TODO: Use the real logic for active state (there's also a "previously active" state) WIP
            <span
              class="content transition-all"
              classList={{
                [getColors().active]: i() === activeLine(),
                [`${getColors().active} opacity-50`]: i() < activeLine(),
              }}
            >
              {line}{" "}
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
