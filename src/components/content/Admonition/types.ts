// The Astro TS compiler doesn't support const enums
export const AdmonitionTypes = {
  Info: "info",
  Disclaimer: "disclaimer",
  Alert: "alert",
  Tip: "tip"
} as const;