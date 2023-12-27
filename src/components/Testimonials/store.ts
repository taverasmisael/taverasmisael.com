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
  return testimonial.reduce(
    (acc, t, idx) => {
      const colors = COLOR_CLASSES[idx] || DEFAULT_COLORS;
      return { ...acc, [t.id]: colors };
    },
    // TypeScript will think that the type is TestimonialEntries if we don't cast it here
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as TestimonialColors,
  );
}

function splitWords(testimonials: TestimonialEntry[]): TestimonialWords {
  return testimonials.reduce(
    (acc, t) => ({ ...acc, [t.id]: splitToLines(t.data.quote) }),
    // TypeScript will think that the type is TestimonialEntries if we don't cast it here
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as TestimonialWords,
  );
}

function splitToLines(quote: string) {
  const words = quote.trim().split(" ");
  // TODO: P4 - Find a better way to split the words, this is accurate but is not the natural way to read #11
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
      { lines: [], lastIndex: 0 },
    );

  return lines;
}

export const WPM = 200;
export const WORDS_PER_LINE = 6;
export const COLOR_CLASSES: TestimonialColor[] = [
  { background: "bg-indigo-500", inactive: "text-indigo-950", active: "text-indigo-50" },
  { background: "bg-yellow-500", inactive: "text-yellow-950", active: "text-yellow-50" },
  { background: "bg-red-500", inactive: "text-red-950", active: "text-red-50" },
  { background: "bg-teal-500", inactive: "text-teal-950", active: "text-teal-50" },
  { background: "bg-green-500", inactive: "text-green-950", active: "text-green-50" },
  { background: "bg-orange-500", inactive: "text-orange-950", active: "text-orange-50" },
  { background: "bg-blue-500", inactive: "text-blue-950", active: "text-blue-50" },
  { background: "bg-purple-500", inactive: "text-purple-950", active: "text-purple-50" },
  { background: "bg-pink-500", inactive: "text-pink-950", active: "text-pink-50" },
];
