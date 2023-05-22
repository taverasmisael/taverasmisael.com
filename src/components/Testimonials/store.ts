import type { TestimonialEntry } from "@/utils/content";
import { createStore } from "solid-js/store";

interface TestimonialColor {
  background: string;
  active: string;
  inactive: string;
}

type TestimonialWords = Record<TestimonialEntry["id"], string[]>;
type TestimonialColors = Record<TestimonialEntry["id"], TestimonialColor>;
type PlayingState = "PAUSED" | "PLAYING";
interface TestimonialState {
  testimonials: TestimonialEntry[];
  current: number;
  colors?: TestimonialColors;
  lines?: TestimonialWords;
  progress: number;
  state: PlayingState;
}

const DEFAULT_COLORS: TestimonialColor = {
  background: "bg-gray-400",
  active: "text-slate-50",
  inactive: "text-slate-950",
};

const [store, setStore] = createStore<TestimonialState>({
  testimonials: [],
  current: 0,
  progress: 0,
  state: "PAUSED",
});

export { store as state };

export function setTestimonials(testimonials: TestimonialEntry[]) {
  const state: PlayingState = "PLAYING";
  const lines = splitWords(testimonials);
  const colors = getColorsForTestimonial(testimonials);
  setStore({ testimonials, lines, state, colors });
}

function setCurrent<T extends TestimonialState>(store: T, c: number): T {
  let current = c;
  if (!store.testimonials.length || current >= store.testimonials.length) current = 0;
  if (current < 0) current = store.testimonials.length - 1;

  return { ...store, current, progress: 0 };
}

export function next() {
  setStore(s => setCurrent(s, s.current + 1));
}

export function previous() {
  setStore(s => setCurrent(s, s.current - 1));
}

export function getCurrent(): TestimonialEntry | undefined {
  return store.testimonials[store.current];
}

export function getCurrentLines(): string[] {
  if (!store.lines) return [];
  const current = getCurrent();
  if (current) return store.lines[current.id];
  return [];
}

export function getCurrentProgress(): number {
  return store.progress;
}

export function setCurrentProgress(progress: number) {
  if (progress === store.progress || getPlayingState() === "PAUSED") return;
  setStore(store => {
    const newProgress = Math.min(100, Math.max(0, progress));
    if (newProgress >= 100) {
      return setCurrent({ ...store, progress: 0 }, store.current + 1);
    }

    return { ...store, progress: newProgress };
  });
}

export function getColors(): TestimonialColor {
  const current = getCurrent();
  if (!current || !store.colors) return DEFAULT_COLORS;

  return store.colors[current.id];
}

export function getPlayingState(): PlayingState {
  return store.state;
}

export function togglePlaying() {
  setStore("state", store.state === "PAUSED" ? "PLAYING" : "PAUSED");
}

function getColorsForTestimonial(testimonial: TestimonialEntry[]): TestimonialColors {
  const colors = ["red", "orange", "teal", "blue", "indigo", "purple", "pink", "yellow", "green"];
  return testimonial.reduce(
    // TODO: Add support for custom colors
    (acc, t, idx) => ({
      ...acc,
      [t.id]: {
        background: `bg-${colors[idx]}-500`,
        active: `text-${colors[idx]}-50`,
        inactive: `text-${colors[idx]}-950`,
      } satisfies TestimonialColor,
    }),
    // TypeScript will think that the type is TestimonialEntries if we don't cast it here
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as TestimonialColors
  );
}

function splitWords(testimonials: TestimonialEntry[]): TestimonialWords {
  return testimonials.reduce(
    (acc, t) => ({ ...acc, [t.id]: splitToLines(t.data.quote) }),
    // TypeScript will think that the type is TestimonialEntries if we don't cast it here
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as TestimonialWords
  );
}

function splitToLines(quote: string) {
  const words = quote.trim().split(" ");
  // TODO: Find a better way to split the words, this is accurate but is not the natural way to read
  const { lines } = new Array(Math.ceil(words.length / WORDS_PER_LINE))
    .fill(undefined)
    .reduce<{ lines: string[]; lastIndex: number }>(
      acc => {
        const newIndex = Math.min(WORDS_PER_LINE + acc.lastIndex, words.length);
        const line = words.slice(acc.lastIndex, newIndex).join(" ");
        return {
          ...acc,
          lastIndex: newIndex,
          lines: acc.lines.concat(line),
        };
      },
      { lines: [], lastIndex: 0 }
    );

  return lines;
}

export const WPM = 300;
export const WORDS_PER_LINE = 6;
