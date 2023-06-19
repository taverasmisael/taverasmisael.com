import { createMemo, type Accessor } from "solid-js";
import { createStore } from "solid-js/store";

interface ComboboxState<Item> {
  items: Item[];
  selectedIndex: number;
}

interface ComboboxStore<Item> {
  state: ComboboxState<Item>;
  setItems: (items: Item[]) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  getSelectedItem: Accessor<Item | undefined>;
}

const createInitialState = <Item>(items: Item[]): ComboboxState<Item> => ({ items, selectedIndex: 0 });

// You need to create a new store for each combobox
export const createComboboxStore = <Item>(items: Item[]): ComboboxStore<Item> => {
  const [state, setState] = createStore(createInitialState(items));

  const selectNext = () => {
    const { items, selectedIndex } = state;
    const nextIndex = selectedIndex + 1;
    setState("selectedIndex", nextIndex < items.length ? nextIndex : 0);
  };

  const selectPrevious = () => {
    const { items, selectedIndex } = state;
    const previousIndex = selectedIndex - 1;
    setState("selectedIndex", previousIndex >= 0 ? previousIndex : items.length - 1);
  };

  const setItems = (items: Item[]) => setState(createInitialState(items));
  const getSelectedItem = createMemo(() => state.items[state.selectedIndex]);

  return { state, setItems, selectNext, selectPrevious, getSelectedItem };
};
