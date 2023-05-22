import { onMount } from "solid-js";
import type { Language } from "@/utils/i18n";
import type { TestimonialEntry } from "@/utils/content";
import TestimonialPlayer from "./Player";
import TestimonialsLyric from "./Lyrics";
import { setTestimonials } from "./store";

interface TestimonialsProps {
  items: TestimonialEntry[];
  lang: Language;
}

export default function Testimonials(props: TestimonialsProps) {
  onMount(() => {
    setTestimonials(props.items);
  });

  return (
    <>
      <TestimonialsLyric />
      <TestimonialPlayer />
    </>
  );
}
