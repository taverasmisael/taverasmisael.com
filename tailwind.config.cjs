const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
        display: ['"Red Hat Display Variable"', ...defaultTheme.fontFamily.serif],
        mono: ['"Fira Code Variable"', ...defaultTheme.fontFamily.mono],
      },
      height: {
        100: "30rem",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 2500ms ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
