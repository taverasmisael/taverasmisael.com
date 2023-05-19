import { createStore } from "solid-js/store";

export const CommandBarMode = {
  Search: "SEARCH",
  Menu: "MENU",
  Commands: "COMMANDS",
  None: "NONE",
} as const;

type CommandBarMode = (typeof CommandBarMode)[keyof typeof CommandBarMode];

interface CommandBarState {
  isVisible: boolean;
  mode: (typeof CommandBarMode)[keyof typeof CommandBarMode];
  lastMode: CommandBarMode;
}

const initialState: CommandBarState = {
  isVisible: true,
  mode: CommandBarMode.Search,
  lastMode: CommandBarMode.None,
};

const [state, setState] = createStore(initialState);

export const commandBarState = state;
export const hideCommandBar = () => setState(s => ({ isVisible: false, mode: CommandBarMode.None, lastMode: s.mode }));

export const setCommandBarSearchMode = () => setState({ isVisible: true, mode: CommandBarMode.Search });
export const setCommandBarMenuMode = () => setState({ isVisible: true, mode: CommandBarMode.Menu });
