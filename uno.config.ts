import { map, join } from "rambda";
import defaultTheme from "tailwindcss/defaultTheme";
import { defineConfig, presetWind, presetTypography } from "unocss";

const theme = {
  ...defaultTheme,
  fontFamily: {
    sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
    display: ['"Red Hat Display Variable"', ...defaultTheme.fontFamily.sans],
    mono: ['"Fira Code Variable"', ...defaultTheme.fontFamily.mono],
  },
};

export default defineConfig({
  theme: {
    fontFamily: map(join(", "), theme.fontFamily),
    animation: {
      keyframes: { wiggle: "{0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)}}" },
      durations: { wiggle: "2500ms" },
      timingFns: { wiggle: "cubic-bezier(0.46, 0.03, 0.52, 0.96)" },
      counts: { wiggle: "infinite" },
    },
  },
  presets: [
    presetTypography({
      cssExtend: {
        blockquote: {
          "font-style": "normal",
        },
        img: {
          "border-radius": theme.borderRadius.md,
          "margin-left": "auto",
          "margin-right": "auto",
        },
        "pre code": {
          // FiraCode looks better light
          "font-weight": "300 !important",
        },
        "h1, h2, h3, h4, h5, h6": {
          "font-family": theme.fontFamily.display.join(", "),
          "text-wrap": "balance",
        },
      },
    }),
    presetWind({ dark: "class" }),
  ],
});
