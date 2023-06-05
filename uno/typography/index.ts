/**
 * This is a Frankenstein/hybrid of the following:
 * - @tailwindcss/typography
 * - @unocss/typography
 */

import { escapeSelector, type Preset } from "unocss";

import { theme, type Theme } from "./theme";
import { colors, invertColors } from "./preflights/colors";
import { getSizePreflight } from "./preflights";
import { getBaseStyle, isSize } from "./preflights/sizes";

const layerName = "typography";
const layerLevel = -20;

export default function myTypography(options: { selector?: string; theme: Theme }): Preset {
  const selector = options.selector ?? "prose";
  const theme = options.theme;
  const notSelector = `:not(:where([class~="not-${selector}"] *))`;
  const invertSelector = `${selector}-invert`;
  const selectorSizesRg = new RegExp(`^${selector}-(base|lg|xl)$`);
  const selectorVariantsRg = new RegExp(`^${selector}-(.+):(.+)$`);
  return {
    name: "@taverasmisael/typography",
    layers: { [layerName]: layerLevel },
    theme,
    rules: [
      [selector, { color: "var(--un-prose-body)", "max-width": "65ch", ...colors }, { layer: layerName }],
      [invertSelector, { color: "var(--un-prose-invert-body)", ...invertColors }, { layer: layerName }],
      [selectorSizesRg, ([, size]) => (isSize(size) ? getBaseStyle(size) : undefined), { layer: layerName }],
      [
        selectorVariantsRg,
        async ([, target, modifier], { rawSelector, generator }) => {
          const escapedSelector = escapeSelector(rawSelector)
          const scope = `.${selector} :where(.${escapedSelector})${notSelector} ${target}`;
          try {
            const css = (await generator.generate(modifier, { preflights: false, scope, minify: true })).css;

            return css ? css.replace(`.${modifier}`, "") : undefined;
          } catch (e) { // I really don't know if generator.generate can throw
            console.error("This shouldn't have happened", e);
            return undefined;
          }
        },
        { layer: "typography" },
      ],
    ],
    preflights: [
      {
        getCSS: () => getSizePreflight({ selector, theme, notSelector }),
        layer: layerName,
      },
    ],
  };
}

// Re-exports
export { theme };
