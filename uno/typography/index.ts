/**
 * This is a Frankenstein/hybrid of the following:
 * - @tailwindcss/typography
 * - @unocss/typography
 */

import { type Preset } from "unocss";

import { theme, type Theme } from "./theme";
import { colors, invertColors } from "./preflights/colors";
import { getSizePreflight } from "./preflights";
import { getBaseStyle, isSize } from "./preflights/sizes";

const layerName = "typography";
const layerLevel = -20;

export default function myTypography(options: { selector?: string; theme: Theme }): Preset {
  const selector = options.selector ?? "prose";
  const theme = options.theme;
  const invertSelector = `${selector}-invert`;
  const selectorSizesRg = new RegExp(`^${selector}-(.+)$`);
  return {
    name: "@taverasmisael/typography",
    layers: { [layerName]: layerLevel },
    rules: [
      [selector, { color: "var(--un-prose-body)", "max-width": "65ch", ...colors }, { layer: layerName }],
      [invertSelector, { color: "var(--un-prose-invert-body)", ...invertColors }, { layer: layerName }],
      [selectorSizesRg, ([, size]) => (isSize(size) ? getBaseStyle(size) : undefined), { layer: layerName }],
    ],
    preflights: [
      {
        getCSS: () =>
          getSizePreflight({
            selector,
            size: "lg",
            theme,
            notSelector: `:not(:where([class~="not-${selector}"] *))`,
          }),
        layer: layerName,
      },
    ],
  };
}

// Re-exports
export { theme };
