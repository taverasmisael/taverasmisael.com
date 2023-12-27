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
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    extraFileExtensions: [".astro"],
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "tailwindcss/no-custom-classname": "off",
  },
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
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
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
      ],
    },
  ],
};
