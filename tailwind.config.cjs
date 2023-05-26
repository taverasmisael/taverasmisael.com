const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: { wiggle: "wiggle 2500ms ease-in-out infinite" },
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Red Hat Display Variable"', ...defaultTheme.fontFamily.sans],
        mono: ['"Fira Code Variable"', ...defaultTheme.fontFamily.mono],
      },
      keyframes: { wiggle: { "0%, 100%": { transform: "rotate(-6deg)" }, "50%": { transform: "rotate(6deg)" } } },
      typography: theme => ({
        DEFAULT: {
          css: {
            blockquote: {
              fontStyle: "normal",
            },
            img: {
              borderRadius: theme("borderRadius.sm"),
              boxShadow: theme("boxShadow.md"),
              marginLeft: theme("margin.auto"),
              marginRight: theme("margin.auto"),
            },
            "pre code": {
              // FiraCode looks better light
              fontWeight: "300 !important",
            },
            "h1, h2, h3, h4, h5, h6": {
              fontFamily: theme("fontFamily.display").join(","),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
