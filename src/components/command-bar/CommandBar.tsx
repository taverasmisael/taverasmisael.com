import { createEffect, createMemo, createSignal } from "solid-js";
import { hideCommandBar, commandBarState, CommandBarMode } from "@/stores/command-bar.store";

export default function CommandBar() {
  let ref: HTMLDialogElement;
  const [command, setCommand] = createSignal("");

  const onCommandChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setCommand(target.value);
  };

  createEffect(() => {
    // NOTE: There's a reported (by me) issue with Arc Browser, where
    // the inert attribute causes the page to crash for some reason.
    // So for now no inert. The good news is that we don't "neeed" it because
    // we are using a dialog element, which has all the accessibility benefits.
    if (commandBarState.isVisible) ref.showModal();
    ref.addEventListener("close", () => {
      setCommand("");
      hideCommandBar();
    });
  });

  const icon = createMemo(() =>
    commandBarState.mode === CommandBarMode.Search ? (
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    ) : (
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    )
  );

  return (
    <>
      <dialog
        aria-hidden="true"
        ref={c => (ref = c)}
        class="fixed -top-1/2 z-50 w-full max-w-4xl rounded-lg border-slate-100 bg-slate-50 p-4 shadow-xl backdrop:bg-neutral-950/80"
      >
        <div>
          <div class="flex w-full rounded-lg bg-white ring-blue-50 focus-within:ring-2">
            <div class="flex items-center justify-center px-4">
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {icon()}
              </svg>
            </div>
            <label for="command-bar-input" class="sr-only">
              Search
            </label>
            <input
              id="command-bar-input"
              name="command-bar-input"
              class="flex-1 appearance-none p-4 focus:outline-none"
              placeholder="Search or type a command"
              type="text"
              value={command()}
              onInput={onCommandChange}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
