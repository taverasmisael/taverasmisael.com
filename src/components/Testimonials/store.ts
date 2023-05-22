import type { TestimonialEntry } from "@/utils/content";
import { createStore } from "solid-js/store";

interface TestimonialColors {
  background: string;
  active: string;
  inactive: string;
}

type TestimonialWords = Record<TestimonialEntry["id"], string[]>;

interface TestimonialStore {
  testimonials: TestimonialEntry[];
  current: number;
  colors: TestimonialColors;
  lines?: TestimonialWords;
  progress: number;
}

const DEFAULT_COLORS: TestimonialColors = {
  background: "bg-gray-400",
  active: "text-slate-50",
  inactive: "text-slate-950",
};

const [store, setStore] = createStore<TestimonialStore>({
  testimonials: [],
  current: 0,
  colors: DEFAULT_COLORS,
  progress: 0,
});

export { store as state };

export function setTestimonials(testimonials: TestimonialEntry[]) {
  setStore("testimonials", testimonials);
  setStore("lines", splitWords(testimonials));
}

function setCurrent<T extends TestimonialStore>(store: T, c: number): T {
  let current = c;
  if (!store.testimonials.length || current >= store.testimonials.length) current = 0;
  if (current < 0) current = store.testimonials.length - 1;
  const colors = getColorsForTestimonial(store.testimonials[current]);

  return { ...store, colors, current, progress: 0 };
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

// TODO: Add support for custom colors
function getColorsForTestimonial(testimonial: TestimonialEntry): TestimonialColors {
  return { background: "bg-red-500", active: "bg-red-50", inactive: "bg-red-950" };
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
  const VISIBLE_WORDS = 6;
  const words = quote.trim().split(" ");
  const { lines } = new Array(Math.ceil(words.length / VISIBLE_WORDS))
    .fill(undefined)
    .reduce<{ lines: string[]; lastIndex: number }>(
      acc => {
        const newIndex = Math.min(VISIBLE_WORDS + acc.lastIndex, words.length);
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
