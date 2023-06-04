/**
 * This is a Frankenstein/hybrid of the following:
 * - @tailwindcss/typography
 * - @unocss/typography
 */

import { type Preset } from "unocss";

import { theme, type Theme } from "./theme";
import { colors, invertColors } from "./preflights/colors";
import { getSizePreflight } from "./preflights";

const layerName = "typography";
const layerLevel = -20;

export default function myTypography(options: { selector?: string; theme: Theme }): Preset {
  const selector = options.selector ?? "prose";
  const theme = options.theme;
  const invertSelector = `${selector}-invert`;

  return {
    name: "@taverasmisael/typography",
    layers: { [layerName]: layerLevel },
    rules: [
      [selector, { color: "var(--un-prose-body)", "max-width": "65ch", ...colors }, { layer: "typography" }],
      [invertSelector, { color: "var(--un-prose-invert-body)", ...invertColors }, { layer: "typography" }],
      [`${selector}-lg`, { "font-size": theme.fontSize.lg[0], "line-height": theme.fontSize.lg[1].lineHeight }],
      [`${selector}-xl`, { "font-size": theme.fontSize.xl[0], "line-height": theme.fontSize.xl[1].lineHeight }],
    ],
    preflights: [
      {
        getCSS: () => getSizePreflight({ selector, size: "base", theme }),
        layer: layerName,
      },
    ],
  };
}

// Re-exports
export { theme };
