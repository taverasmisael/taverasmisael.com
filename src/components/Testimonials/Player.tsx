import TestimonialControls from "./Controls";
import { getCurrent } from "./store";
import TestimonialProgressBar from "./ProgressBar";

export default function TestimonialPlayer() {
  return (
    <div class="relative grid grid-cols-3 items-center gap-2 px-2 md:gap-4">
      <TestimonialProgressBar />
      <div class="col-span-2 inline-flex items-center space-x-2">
        <img src={getCurrent()?.data.image.src} alt="Avatar of Jonathan" class="size-8 rounded" />
        <p class="text-xs leading-4">
          <strong class="block text-sm font-semibold text-gray-900 underline-offset-2 hover:underline dark:text-slate-100">
            <a href={getCurrent()?.data.link}>{getCurrent()?.data.name}</a>
          </strong>
          <span class="text-gray-500 dark:text-gray-400">{getCurrent()?.data.title}</span>
        </p>
      </div>
      <TestimonialControls />
    </div>
  );
}
