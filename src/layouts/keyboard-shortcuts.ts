import { showCommandBar } from "@/stores/command-bar.store";

const buffer = new Set<string>();

document.addEventListener("DOMContentLoaded", () => {
  const searchTrigger = document.getElementById("search-trigger");
  if (searchTrigger) {
    searchTrigger.addEventListener("click", e => {
      e.preventDefault();
      showCommandBar();
    });
  }

  document.addEventListener("keydown", e => {
    // If target is input type, ignore
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    )
      return;

    if (e.key === "/" || e.key === "?") {
      e.preventDefault();
      showCommandBar();
    }

    if (e.key === "g") {
      if (buffer.has("g")) {
        window.scrollTo(0, 0);
        buffer.clear();
      } else {
        buffer.add(e.key);
        setTimeout(() => {
          buffer.clear();
        }, 500);
      }
    }
  });
});
