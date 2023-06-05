import type { Theme } from "../theme";
import { getStyles, type Size } from "./sizes";

interface GetCSSOptions {
  size: Size;
  notSelector: string;
  theme: Theme;
  selectorName: string;
}

interface GetSizePreflightOptions {
  notSelector: string;
  size?: Size;
  theme: Theme;
  selector: string;
}

export const getSizePreflight = ({ size = "base", selector, theme, notSelector }: GetSizePreflightOptions) =>
  getCSS({ selectorName: selector, theme, size, notSelector });

function getCSS({ selectorName, theme, size, notSelector }: GetCSSOptions): string {
  const styles = getStyles(theme, size);
  let css = "";
  const selectorAsClass = `.${selectorName}`;
  for (const [selector, value] of Object.entries(styles)) {
    const pseudoCSSMatchArray = selector
      .split(",")
      .map(s => {
        if (s.startsWith(">")) {
          s = s.replace(">", `${selectorAsClass} >`);
          return `${selectorAsClass} :where(${s})${notSelector}`;
        }

        // pseudo class & pseudo elements matcher
        // matches :, ::, -, (), numbers and words
        const match = s.match(/::?(?:[():\-\d\w]+)$/g);

        if (match) {
          const matchStr = match[0];
          s = s.replace(matchStr, "");
          return `${selectorAsClass} :where(${s})${notSelector}${matchStr}`;
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
      css += `${selectorAsClass} :where(${selector})${notSelector}`;
    }

    css += `{${Object.entries(value)
      .map(([k, v]) => `${k}:${v}`)
      .join(";")}}`;
  }

  return css;
}
