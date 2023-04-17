/**
 * @type {import("eslint").Linter.Config}
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:astro/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:astro/jsx-a11y-strict",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    extraFileExtensions: [".astro"],
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "tailwindcss/no-custom-classname": "off",
  },
  overrides: [
    {
      files: ["*.astro"],
      env: {
        browser: true,
        es2020: true,
        "astro/astro": true,
      },
      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      rules: {
        "astro/no-set-html-directive": "warn",
        "astro/no-set-text-directive": "warn",
        // Stylistic rules
        "astro/prefer-class-list-directive": "error",
        "astro/prefer-object-class-list": "error",
        "astro/prefer-split-class-list": "error",
      },
    },
  ],
};
