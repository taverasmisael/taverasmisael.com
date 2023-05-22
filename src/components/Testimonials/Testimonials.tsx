import { Show, onMount } from "solid-js";
import type { Language } from "@/utils/i18n";
import type { TestimonialEntry } from "@/utils/content";
import TestimonialPlayer from "./Player";
import TestimonialsLyric from "./Lyrics";
import { state as testimonialsState, setTestimonials } from "./store";

interface TestimonialsProps {
  items: TestimonialEntry[];
  lang: Language;
}

export default function Testimonials(props: TestimonialsProps) {
  onMount(() => {
    setTestimonials(props.items);
  });

  return (
    <section
      class="testimonial mx-auto grid h-full max-w-lg bg-white p-4 shadow transition-all empty:hidden hover:shadow-slate-50 dark:bg-black dark:hover:shadow-slate-950"
      style={{ "grid-template-rows": "1fr 50px" }}
    >
      <Show when={testimonialsState.testimonials.length}>
        <TestimonialsLyric />
        <TestimonialPlayer />
      </Show>
    </section>
  );
}
