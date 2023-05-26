import { createStore } from "solid-js/store";

interface CommandBarState {
  isVisible: boolean;
}

const initialState: CommandBarState = { isVisible: false };

const [state, setState] = createStore(initialState);

export const commandBarState = state;
export const hideCommandBar = () => setState("isVisible", false);

export const showCommandBar = () => setState("isVisible", true);
