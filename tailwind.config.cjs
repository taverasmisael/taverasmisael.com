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
              marginLeft: theme("margin.auto"),
              marginRight: theme("margin.auto"),
            },
            "pre code": {
              // FiraCode looks better light
              fontWeight: "300",
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
    plugin(({ addBase, theme }) => {
      addBase({
        ".text-balance": { textWrap: "balance" },
        ".gradient-gray-slate": {
          "--tw-gradient-stops": `${theme("colors.gray.950")} 60%, ${theme("colors.slate.950")}`,
        },
        ".gradient-slate-slate": {
          "--tw-gradient-stops": `${theme("colors.slate.50")} 60%, ${theme("colors.slate.200")}`,
        },
        ".gradient-blue-transparent": {
          "--tw-gradient-stops": `${theme("colors.blue.200")} 50%, transparent 0%`,
        },
      });
    }),
  ],
};
