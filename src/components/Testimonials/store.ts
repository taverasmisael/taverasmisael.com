import type { TestimonialEntry } from "@/utils/content";
import { createStore } from "solid-js/store";

interface TestimonialColors {
  background: string;
  active: string;
  inactive: string;
}

interface TestimonialStore {
  testimonials: TestimonialEntry[];
  current: number;
  colors: TestimonialColors;
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

// TODO: Add support for custom colors
function getColorsForTestimonial(testimonial: TestimonialEntry): TestimonialColors {
  return { background: "bg-red-500", active: "bg-red-50", inactive: "bg-red-950" };
}
