import defaultTheme from "tailwindcss/defaultTheme";

export const theme = {
  ...defaultTheme,
  fontFamily: {
    sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
    display: ['"Red Hat Display Variable"', ...defaultTheme.fontFamily.sans],
    mono: ['"Fira Code Variable"', ...defaultTheme.fontFamily.mono],
  },
};

export type Theme = typeof theme;
