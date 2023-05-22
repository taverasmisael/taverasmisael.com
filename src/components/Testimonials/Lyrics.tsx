import { getCurrent, state } from "./store";

export default function TestimonialsLyrics() {
  return (
    <div
      id="lyrics"
      class={`mx-auto mb-8 max-h-80 overflow-auto rounded-md ${state.colors.background || "bg-red-500"} p-4`}
    >
      <div class={`m-auto max-w-xl text-2xl font-semibold leading-relaxed ${state.colors.inactive || "text-red-950"}`}>
        {getCurrent()?.data.quote}
      </div>
    </div>
  );
}
