import { mergeDeepRight } from "rambda";
import type { Theme } from "../theme";
import { rem, em, round } from "../utils";
import { getDefaultStyles } from "./default-styles";

export type Styles = Record<string, Record<string, string | number>>;
export interface SizeStyles {
  components: Styles;
  base: Record<string, string | number>;
}
export const getStyles = (theme: Theme) => {
  // TODO: Replace `base` with size
  return mergeDeepRight<SizeStyles>(getDefaultStyles(theme), base);
};

const base: SizeStyles = {
  base: {
    "font-size": rem(14),
    "line-height": round(24 / 14),
  },
  components: {
    "> :first-child": {
      marginTop: "0",
    },
    "> :last-child": {
      marginBottom: "0",
    },
    p: {
      "margin-top": em(20, 16),
      "margin-bottom": em(20, 16),
    },
    '[class~="lead"]': {
      "font-size": em(20, 16),
      "line-height": round(32 / 20),
      "margin-top": em(24, 20),
      "margin-bottom": em(24, 20),
    },
    blockquote: {
      "margin-top": em(32, 20),
      "margin-bottom": em(32, 20),
      "padding-left": em(20, 20),
    },
    h1: {
      "font-size": em(36, 16),
      "margin-top": "0",
      "margin-bottom": em(32, 36),
      "line-height": round(40 / 36),
    },
    h2: {
      "font-size": em(24, 16),
      "margin-top": em(48, 24),
      "margin-bottom": em(24, 24),
      "line-height": round(32 / 24),
    },
    h3: {
      "font-size": em(20, 16),
      "margin-top": em(32, 20),
      "margin-bottom": em(12, 20),
      "line-height": round(32 / 20),
    },
    h4: {
      "margin-top": em(24, 16),
      "margin-bottom": em(8, 16),
      "line-height": round(24 / 16),
    },
    img: {
      "margin-top": em(32, 16),
      "margin-bottom": em(32, 16),
    },
    video: {
      "margin-top": em(32, 16),
      "margin-bottom": em(32, 16),
    },
    figure: {
      "margin-top": em(32, 16),
      "margin-bottom": em(32, 16),
    },
    "figure > *": {
      "margin-top": "0",
      "margin-bottom": "0",
    },
    figcaption: {
      "font-size": em(14, 16),
      "line-height": round(20 / 14),
      "margin-top": em(12, 14),
    },
    code: {
      "font-size": em(14, 16),
    },
    "h2 code": {
      "font-size": em(21, 24),
    },
    "h3 code": {
      "font-size": em(18, 20),
    },
    pre: {
      "font-size": em(14, 16),
      "line-height": round(24 / 14),
      "margin-top": em(24, 14),
      "margin-bottom": em(24, 14),
      "border-radius": rem(6),
      "padding-top": em(12, 14),
      "padding-right": em(16, 14),
      "padding-bottom": em(12, 14),
      "padding-left": em(16, 14),
    },
    ol: {
      "margin-top": em(20, 16),
      "margin-bottom": em(20, 16),
      "padding-left": em(26, 16),
    },
    ul: {
      "margin-top": em(20, 16),
      "margin-bottom": em(20, 16),
      "padding-left": em(26, 16),
    },
    li: {
      "margin-top": em(8, 16),
      "margin-bottom": em(8, 16),
    },
    "ol > li": {
      "padding-left": em(6, 16),
    },
    "ul > li": {
      "padding-left": em(6, 16),
    },
    "> ul > li p": {
      "margin-top": em(12, 16),
      "margin-bottom": em(12, 16),
    },
    "> ul > li > *:first-child": {
      "margin-top": em(20, 16),
    },
    "> ul > li > *:last-child": {
      "margin-bottom": em(20, 16),
    },
    "> ol > li > *:first-child": {
      "margin-top": em(20, 16),
    },
    "> ol > li > *:last-child": {
      "margin-bottom": em(20, 16),
    },
    "ul ul, ul ol, ol ul, ol ol": {
      "margin-top": em(12, 16),
      "margin-bottom": em(12, 16),
    },
    hr: {
      "margin-top": em(48, 16),
      "margin-bottom": em(48, 16),
    },
    "hr + *": {
      "margin-top": "0",
    },
    "h2 + *": {
      "margin-top": "0",
    },
    "h3 + *": {
      "margin-top": "0",
    },
    "h4 + *": {
      "margin-top": "0",
    },
    table: {
      "font-size": em(14, 16),
      "line-height": round(24 / 14),
    },
    "thead th": {
      "padding-right": em(8, 14),
      "padding-bottom": em(8, 14),
      "padding-left": em(8, 14),
    },
    "thead th:first-child": {
      "padding-left": "0",
    },
    "thead th:last-child": {
      "padding-right": "0",
    },
    "tbody td, tfoot td": {
      "padding-top": em(8, 14),
      "padding-right": em(8, 14),
      "padding-bottom": em(8, 14),
      "padding-left": em(8, 14),
    },
    "tbody td:first-child, tfoot td:first-child": {
      "padding-left": "0",
    },
    "tbody td:last-child, tfoot td:last-child": {
      "padding-right": "0",
    },
  },
};
