import { mergeDeep } from "unocss";
import type { Theme } from "../theme";
import { rem, em, round } from "../utils";
import { getDefaultStyles } from "./default-styles";

export const SIZES = ["base", "lg", "xl"] as const;
export type Size = (typeof SIZES)[number];
export type Styles = Record<string, Record<string, string | number>>;

const base: Styles = {
  "> :first-child": {
    "margin-top": "0",
  },
  "> :last-child": {
    "margin-bottom": "0",
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
};

const lg: Styles = {
  p: {
    "margin-top": em(24, 18),
    "margin-bottom": em(24, 18),
  },
  '[class~="lead"]': {
    "font-size": em(22, 18),
    "line-height": round(32 / 22),
    "margin-top": em(24, 22),
    "margin-bottom": em(24, 22),
  },
  blockquote: {
    "margin-top": em(40, 24),
    "margin-bottom": em(40, 24),
    "padding-left": em(24, 24),
  },
  h1: {
    "font-size": em(48, 18),
    "margin-top": "0",
    "margin-bottom": em(40, 48),
    "line-height": round(48 / 48),
  },
  h2: {
    "font-size": em(30, 18),
    "margin-top": em(56, 30),
    "margin-bottom": em(32, 30),
    "line-height": round(40 / 30),
  },
  h3: {
    "font-size": em(24, 18),
    "margin-top": em(40, 24),
    "margin-bottom": em(16, 24),
    "line-height": round(36 / 24),
  },
  h4: {
    "margin-top": em(32, 18),
    "margin-bottom": em(8, 18),
    "line-height": round(28 / 18),
  },
  img: {
    "margin-top": em(32, 18),
    "margin-bottom": em(32, 18),
  },
  video: {
    "margin-top": em(32, 18),
    "margin-bottom": em(32, 18),
  },
  figure: {
    "margin-top": em(32, 18),
    "margin-bottom": em(32, 18),
  },
  "figure > *": {
    "margin-top": "0",
    "margin-bottom": "0",
  },
  figcaption: {
    "font-size": em(16, 18),
    "line-height": round(24 / 16),
    "margin-top": em(16, 16),
  },
  code: {
    "font-size": em(16, 18),
  },
  "h2 code": {
    "font-size": em(26, 30),
  },
  "h3 code": {
    "font-size": em(21, 24),
  },
  pre: {
    "font-size": em(16, 18),
    "line-height": round(28 / 16),
    "margin-top": em(32, 16),
    "margin-bottom": em(32, 16),
    "border-radius": rem(6),
    "padding-top": em(16, 16),
    "padding-right": em(24, 16),
    "padding-bottom": em(16, 16),
    "padding-left": em(24, 16),
  },
  ol: {
    "margin-top": em(24, 18),
    "margin-bottom": em(24, 18),
    "padding-left": em(28, 18),
  },
  ul: {
    "margin-top": em(24, 18),
    "margin-bottom": em(24, 18),
    "padding-left": em(28, 18),
  },
  li: {
    "margin-top": em(12, 18),
    "margin-bottom": em(12, 18),
  },
  "ol > li": {
    "padding-left": em(8, 18),
  },
  "ul > li": {
    "padding-left": em(8, 18),
  },
  "> ul > li p": {
    "margin-top": em(16, 18),
    "margin-bottom": em(16, 18),
  },
  "> ul > li > *:first-child": {
    "margin-top": em(24, 18),
  },
  "> ul > li > *:last-child": {
    "margin-bottom": em(24, 18),
  },
  "> ol > li > *:first-child": {
    "margin-top": em(24, 18),
  },
  "> ol > li > *:last-child": {
    "margin-bottom": em(24, 18),
  },
  "ul ul, ul ol, ol ul, ol ol": {
    "margin-top": em(16, 18),
    "margin-bottom": em(16, 18),
  },
  hr: {
    "margin-top": em(56, 18),
    "margin-bottom": em(56, 18),
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
    "font-size": em(16, 18),
    "line-height": round(24 / 16),
  },
  "thead th": {
    "padding-right": em(12, 16),
    "padding-bottom": em(12, 16),
    "padding-left": em(12, 16),
  },
  "thead th:first-child": {
    "padding-left": "0",
  },
  "thead th:last-child": {
    "padding-right": "0",
  },
  "tbody td, tfoot td": {
    "padding-top": em(12, 16),
    "padding-right": em(12, 16),
    "padding-bottom": em(12, 16),
    "padding-left": em(12, 16),
  },
  "tbody td:first-child, tfoot td:first-child": {
    "padding-left": "0",
  },
  "tbody td:last-child, tfoot td:last-child": {
    "padding-right": "0",
  },
  "> :first-child": {
    "margin-top": "0",
  },
  "> :last-child": {
    "margin-bottom": "0",
  },
};

const xl: Styles = {
  p: {
    "margin-top": em(24, 20),
    "margin-bottom": em(24, 20),
  },
  '[class~="lead"]': {
    "font-size": em(24, 20),
    "line-height": round(36 / 24),
    "margin-top": em(24, 24),
    "margin-bottom": em(24, 24),
  },
  blockquote: {
    "margin-top": em(48, 30),
    "margin-bottom": em(48, 30),
    "padding-left": em(32, 30),
  },
  h1: {
    "font-size": em(56, 20),
    "margin-top": "0",
    "margin-bottom": em(48, 56),
    "line-height": round(56 / 56),
  },
  h2: {
    "font-size": em(36, 20),
    "margin-top": em(56, 36),
    "margin-bottom": em(32, 36),
    "line-height": round(40 / 36),
  },
  h3: {
    "font-size": em(30, 20),
    "margin-top": em(48, 30),
    "margin-bottom": em(20, 30),
    "line-height": round(40 / 30),
  },
  h4: {
    "margin-top": em(36, 20),
    "margin-bottom": em(12, 20),
    "line-height": round(32 / 20),
  },
  img: {
    "margin-top": em(40, 20),
    "margin-bottom": em(40, 20),
  },
  video: {
    "margin-top": em(40, 20),
    "margin-bottom": em(40, 20),
  },
  figure: {
    "margin-top": em(40, 20),
    "margin-bottom": em(40, 20),
  },
  "figure > *": {
    "margin-top": "0",
    "margin-bottom": "0",
  },
  figcaption: {
    "font-size": em(18, 20),
    "line-height": round(28 / 18),
    "margin-top": em(18, 18),
  },
  code: {
    "font-size": em(18, 20),
  },
  "h2 code": {
    "font-size": em(31, 36),
  },
  "h3 code": {
    "font-size": em(27, 30),
  },
  pre: {
    "font-size": em(18, 20),
    "line-height": round(32 / 18),
    "margin-top": em(36, 18),
    "margin-bottom": em(36, 18),
    "border-radius": rem(8),
    "padding-top": em(20, 18),
    "padding-right": em(24, 18),
    "padding-bottom": em(20, 18),
    "padding-left": em(24, 18),
  },
  ol: {
    "margin-top": em(24, 20),
    "margin-bottom": em(24, 20),
    "padding-left": em(32, 20),
  },
  ul: {
    "margin-top": em(24, 20),
    "margin-bottom": em(24, 20),
    "padding-left": em(32, 20),
  },
  li: {
    "margin-top": em(12, 20),
    "margin-bottom": em(12, 20),
  },
  "ol > li": {
    "padding-left": em(8, 20),
  },
  "ul > li": {
    "padding-left": em(8, 20),
  },
  "> ul > li p": {
    "margin-top": em(16, 20),
    "margin-bottom": em(16, 20),
  },
  "> ul > li > *:first-child": {
    "margin-top": em(24, 20),
  },
  "> ul > li > *:last-child": {
    "margin-bottom": em(24, 20),
  },
  "> ol > li > *:first-child": {
    "margin-top": em(24, 20),
  },
  "> ol > li > *:last-child": {
    "margin-bottom": em(24, 20),
  },
  "ul ul, ul ol, ol ul, ol ol": {
    "margin-top": em(16, 20),
    "margin-bottom": em(16, 20),
  },
  hr: {
    "margin-top": em(56, 20),
    "margin-bottom": em(56, 20),
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
    "font-size": em(18, 20),
    "line-height": round(28 / 18),
  },
  "thead th": {
    "padding-right": em(12, 18),
    "padding-bottom": em(16, 18),
    "padding-left": em(12, 18),
  },
  "thead th:first-child": {
    "padding-left": "0",
  },
  "thead th:last-child": {
    "padding-right": "0",
  },
  "tbody td, tfoot td": {
    "padding-top": em(16, 18),
    "padding-right": em(12, 18),
    "padding-bottom": em(16, 18),
    "padding-left": em(12, 18),
  },
  "tbody td:first-child, tfoot td:first-child": {
    "padding-left": "0",
  },
  "tbody td:last-child, tfoot td:last-child": {
    "padding-right": "0",
  },
  "> :first-child": {
    "margin-top": "0",
  },
  "> :last-child": {
    "margin-bottom": "0",
  },
};

export const getStyles = (theme: Theme, size: Size): Styles => mergeDeep(getDefaultStyles(theme), styles[size]);

export const getBaseStyle = (size: Size) => baseStyles[size];

const styles: Record<Size, Styles> = { base, lg, xl };
const baseStyles: Record<Size, Record<string, string>> = {
  base: { "font-size": rem(14), "line-height": round(24 / 14) },
  lg: { "font-size": rem(18), "line-height": round(32 / 18) },
  xl: { "font-size": rem(20), "line-height": round(36 / 20) },
};
