import type { Theme } from "../theme";
import { getStyles } from "./sizes";

const getCSS = ({ selectorName, theme }: { theme: Theme; selectorName: string }): string => {
  const styles = getStyles(theme)
  let css = `
    ${selectorName} {
      ${Object.entries(styles.base)
        .map(([k, v]) => `${k}:${v}`)
        .join(";")}
    }
  `;

  css += extractCSSFromObject({ selectorName, object: styles.components });

  return css;
};

function extractCSSFromObject({
  selectorName,
  object,
}: {
  selectorName: string;
  object: Record<string, Record<string, string | number>>;
}): string {
  let css = "";
  const selectorAsClass = `.${selectorName}`;
  for (const [selector, value] of Object.entries(object)) {
    const notProseSelector = `:not(:where(.not-${selectorName},.not-${selectorName} *))`;

    const pseudoCSSMatchArray = selector
      .split(",")
      .map(s => {
        // pseudo class & pseudo elements matcher
        // matches :, ::, -, (), numbers and words
        const match = s.match(/::?(?:[():\-\d\w]+)$/g);

        if (match) {
          const matchStr = match[0];
          s = s.replace(matchStr, "");
          return `${selectorAsClass} :where(${s})${notProseSelector}${matchStr}`;
        }
        return null;
      })
      .filter(v => v);

    // rejoin pseudo class & elements
    // multi selectors, single utility
    if (pseudoCSSMatchArray.length) {
      css += pseudoCSSMatchArray.join(",");
    } else {
      // directly from css declaration
      css += `${selectorAsClass} :where(${selector})${notProseSelector}`;
    }

    css += `{${Object.entries(value)
      .map(([k, v]) => `${k}:${v}`)
      .join(";")}}`;
  }

  return css;
}

export const getSizePreflight = ({ size, selector, theme }: { size?: string; theme: Theme; selector: string }) =>
  getCSS({ selectorName: selector, theme });
