import { type CommandBarMode, setCommandBarCommandsMode, setCommandBarSearchMode } from "@/stores/command-bar.store";

document.addEventListener("DOMContentLoaded", addKBShortcuts);

type CommandMap = Record<string, CommandBarMode>;

const SIMPLE_SHORTCUTS = {
  "/": "SEARCH",
  "?": "SEARCH",
} as const satisfies CommandMap;

const COMPLEX_SHORTCUTS = {
  k: "COMMANDS",
} as const satisfies CommandMap;

function addKBShortcuts() {
  document.addEventListener("keydown", e => {
    // If target is input type, ignore
    if (e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) return

    if (e.metaKey || e.ctrlKey) {
      if (Object.keys(COMPLEX_SHORTCUTS).includes(e.key)) {
        e.preventDefault();
        setCommandBarCommandsMode();
      }
    } else {
      if (Object.keys(SIMPLE_SHORTCUTS).includes(e.key)) {
        e.preventDefault();
        setCommandBarSearchMode();
      }
    }
  });
}
