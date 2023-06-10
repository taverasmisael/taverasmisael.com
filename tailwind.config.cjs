const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: { wiggle: "wiggle 2500ms ease-in-out infinite" },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        display: ['"Red Hat Display"', ...defaultTheme.fontFamily.sans],
        mono: ['"Fira Code"', ...defaultTheme.fontFamily.mono],
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
              marginLeft: theme("margin.auto"),
              marginRight: theme("margin.auto"),
            },
            pre: {
              backgroundColor: "var(--tw-prose-pre-bg)!important",
            },
            "pre code": {
              // FiraCode looks better light
              fontWeight: "300 !important",
            },
            "h1, h2, h3, h4, h5, h6": {
              fontFamily: theme("fontFamily.display").join(","),
            },
            "h1, h2, h3, h4": {
              textWrap: "balance",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addBase }) => {
      addBase({
        ".text-balance": { textWrap: "balance" },
      });
    }),
  ],
};
