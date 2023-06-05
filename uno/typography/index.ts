/**
 * This is a Frankenstein/hybrid of the following:
 * - @tailwindcss/typography
 * - @unocss/typography
 */

import { escapeSelector, type Preset } from "unocss";

import { theme } from "./theme";
import { invertColors } from "./preflights/colors";
import { getSizePreflight } from "./preflights";
import { getBaseStyle, isSize } from "./preflights/sizes";

const layer = "typography";

export default function myTypography(): Preset {
  const selector = "prose";
  const selectorRegex = new RegExp(`^${selector}$`);
  const notSelector = `:not(:where([class~="not-${selector}"] *))`;
  const invertSelector = `${selector}-invert`;
  const selectorSizesRg = new RegExp(`^${selector}-(base|lg|xl)$`);
  const selectorVariantsRg = new RegExp(`^${selector}-(.+):(.+)$`);
  return {
    name: "@taverasmisael/typography",
    layers: { [layer]: -20 },
    theme,
    rules: [
      [selectorRegex, () => getSizePreflight({ selector, theme, notSelector }), { layer }],
      [invertSelector, { color: "var(--un-prose-invert-body)", ...invertColors }, { layer }],
      [selectorSizesRg, ([, size]) => (isSize(size) ? getBaseStyle(size) : undefined), { layer }],
      [
        selectorVariantsRg,
        async ([, target, modifier], { rawSelector, generator }) => {
          const escapedSelector = escapeSelector(rawSelector);
          const scope = `.${selector} :where(.${escapedSelector})${notSelector} ${target}`;
          try {
            const css = (await generator.generate(modifier, { preflights: false, scope, minify: true })).css;

            return css ? css.replace(`.${modifier}`, "") : undefined;
          } catch (e) {
            // I really don't know if generator.generate can throw
            console.error("This shouldn't have happened", e);
            return undefined;
          }
        },
        { layer },
      ],
    ],
  };
}

// Re-exports
export { theme };
