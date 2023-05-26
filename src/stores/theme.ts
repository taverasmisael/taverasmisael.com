import { createStore } from "solid-js/store";

type ThemeMode = "light" | "dark" | "auto";
interface Theme {
  mode: ThemeMode;
}
const [theme, setTheme] = createStore<Theme>({ mode: "auto" });

export const toggleTheme = () => {
  const newTheme = theme.mode === "light" ? "dark" : "light";
  setTheme({ mode: newTheme });
  localStorage.theme = newTheme;
  document.documentElement.classList.toggle("dark");
};

export const initTheme = () => {
  const theme = localStorage.getItem("theme") ?? "auto";

  setTheme({ mode: theme as ThemeMode });

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const getTheme = () => theme.mode;
