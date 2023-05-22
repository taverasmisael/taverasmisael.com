import { createEffect, createMemo, onCleanup } from "solid-js";
import { getCurrent, setCurrentProgress, getCurrentProgress, WPM, getCurrentLines, getColors } from "./store";

export default function TestimonialProgressBar() {
  const progress = createMemo(() => `${getCurrentProgress()}%`);
  const readingTime = createMemo(() => {
    const words = getCurrent()?.data.quote.split(" ").length ?? 0;
    return (words / WPM) * 60_000;
  });
  const ms = createMemo(() => Math.floor(readingTime() / getCurrentLines().length / 144));

  let timer: NodeJS.Timeout;

  createEffect<string>(prev => {
    const currentId = getCurrent()?.id ?? "";
    if (prev && currentId !== prev) clearInterval(timer);

    timer = setInterval(() => {
      setCurrentProgress(getCurrentProgress() + (ms() / readingTime()) * 144);
    }, ms());

    return currentId;
  });

  onCleanup(() => clearInterval(timer));

  return (
    <div class={`absolute -top-3 left-0 h-1 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800`}>
      <div
        class={`absolute left-0 top-0 h-1 rounded opacity-80 transition-all ${getColors().background}`}
        style={{ width: progress() }}
      ></div>
    </div>
  );
}
