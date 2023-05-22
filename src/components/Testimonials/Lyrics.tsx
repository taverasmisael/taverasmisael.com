import { For, createEffect, createMemo } from "solid-js";
import { getCurrentProgress, getCurrentLines, getColors } from "./store";

export default function TestimonialsLyrics() {
  const lineRefs: HTMLSpanElement[] = [];
  const activeLine = createMemo(() => {
    const lines = getCurrentLines();
    const progress = getCurrentProgress();
    return Math.floor((progress / 100) * lines.length);
  });

  createEffect(() => {
    const activeLineIndex = activeLine();
    const activeLineRef = lineRefs[activeLineIndex];
    if (activeLineRef) activeLineRef.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  });

  const colors = createMemo(() => ({
    background: getColors().background || "bg-blue-500",
    inactive: getColors().inactive || "text-blue-950",
    active: getColors().active || "text-blue-50",
  }));

  return (
    <div class={`mx-auto mb-8 max-h-80 w-full overflow-auto rounded-md p-6 ${colors().background}`}>
      <div class={`m-auto max-w-xl text-2xl font-semibold leading-relaxed ${colors().inactive}`}>
        <For each={getCurrentLines()}>
          {(line, i) => (
            // TODO: Use the real logic for active state (there's also a "previously active" state) WIP
            <span
              ref={e => (lineRefs[i()] = e)}
              class="content transition-all"
              classList={{
                [colors().active]: i() <= activeLine(),
                "opacity-50": i() < activeLine() - 1,
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
