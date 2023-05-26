import { Select } from "@kobalte/core";
export function SelectItem(props: Select.SelectItemProps) {
  return (
    <Select.Item
      {...props}
      class="cursor-default appearance-none border-none px-6 py-2 outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-[disabled=false]:hover:bg-blue-50/80 dark:aria-[disabled=false]:hover:bg-slate-900/80"
    />
  );
}

export function SelectTrigger(props: Select.SelectTriggerProps) {
  return (
    <Select.Trigger
      {...props}
      class="w-full rounded-md bg-white py-2 pl-4 pr-8 shadow ring-1 ring-blue-50 focus:outline-none focus:ring aria-expanded:ring-2 dark:bg-slate-800 dark:ring-slate-700"
    />
  );
}

export function SelectValue<T>(props: Select.SelectValueProps<T>) {
  return <Select.Value {...props} class="flex items-center gap-2" />;
}

export function SelectListbox<T, U>(props: Select.SelectListboxProps<T, U>) {
  return (
    <Select.Listbox
      {...props}
      class="w-full overflow-hidden rounded bg-slate-50 shadow-md  outline-none ring ring-blue-50 dark:bg-slate-800 dark:ring-slate-700"
    />
  );
}
