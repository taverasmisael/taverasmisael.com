import { mergeDeep } from "unocss";
import type { Theme } from "../theme";
import { getDefaultStyles } from "./default-styles";

export const SIZES = ["base", "lg", "xl"] as const;
export const isSize = (x: string): x is Size => SIZES.includes(x);
export type Size = (typeof SIZES)[number];
export type Styles = Record<string, Record<string, string | number>>;

function base(t: Theme): Styles {
  return {
    p: {
      "margin-top": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 1.5em)",
      "margin-bottom": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 1.5em)",
    },
    '[class~="lead"]': {
      "font-size": `clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), ${t.fontSize["3xl"][0]})`,
      "line-height": 1.1034482759,
      "margin-top": "clamp(1.2em, calc(1.2em * var(--un-typography-factor, 1)), 1.5em)",
      "margin-bottom": "clamp(1.2em, calc(1.2em * var(--un-typography-factor, 1)), 1.5em)",
    },
    blockquote: {
      "margin-top": "clamp(1.6em, calc(1.6em * var(--un-typography-factor, 1)), 2em)",
      "margin-bottom": "clamp(1.6em, calc(1.6em * var(--un-typography-factor, 1)), 2em)",
      "padding-left": "clamp(1em, calc(1em * var(--un-typography-factor, 1)), 1.75em)",
    },
    h1: {
      "font-size": `clamp(2.25em, calc(2.25em * var(--un-typography-factor, 1)), 3.5rem)`,
      "margin-top": "0",
      "margin-bottom": "clamp(0.9em, calc(0.9em * var(--un-typography-factor, 1)), 1.5em)",
      "line-height": 1.2,
    },
    h2: {
      "font-size": `clamp(1.5em, calc(1.5em * var(--un-typography-factor, 1)),  2.25rem)`,
      "margin-top": "clamp(2em, calc(2em * var(--un-typography-factor, 1)), 2.25em)",
      "margin-bottom": "clamp(1em, calc(1em * var(--un-typography-factor, 1)), 1.25em)",
      "line-height": 1.4,
    },
    h3: {
      "font-size": `clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)),  1.875rem)`,
      "margin-top": "clamp(1.6em, calc(1.6em * var(--un-typography-factor, 1)), 1.85em)",
      "margin-bottom": "clamp(0.6em, calc(0.6em * var(--un-typography-factor, 1)), 2em)",
      "line-height": 1.6,
    },
    h4: {
      "margin-top": "clamp(1.5em, calc(1.5em * var(--un-typography-factor, 1)),  1.75em)",
      "margin-bottom": "clamp(0.5em, calc(0.5em * var(--un-typography-factor, 1)), 0.75em)",
      "line-height": 1.5,
    },
    "img,video,figure": {
      "margin-top": "clamp(2em, calc(2em * var(--un-typography-factor, 1)), 2.25em)",
      "margin-bottom": "clamp(2em, calc(2em * var(--un-typography-factor, 1)), 2.25em)",
    },
    "figure > *": {
      "margin-top": "0",
      "margin-bottom": "0",
    },
    figcaption: {
      "font-size": "clamp(0.875em, calc(0.875em * var(--un-typography-factor, 1)), 1em)",
      "line-height": 1.4285714,
      "margin-top": "clamp(0.8571429em, calc(0.8571429em * var(--un-typography-factor, 1)), 1em)",
    },
    "code, h2 code, h3 code, pre": {
      "font-size": "clamp(0.875em, calc(0.875em * var(--un-typography-factor, 1)), 18px)",
    },
    pre: {
      "line-height": 1.7142857,
      "margin-top": "clamp(1.7142857em, calc(1.7142857em * var(--un-typography-factor, 1)), 2em)",
      "margin-bottom": "clamp(1.7142857em, calc(1.7142857em * var(--un-typography-factor, 1)), 2em)",
      "border-radius": t.borderRadius.md,
      "padding-top": "clamp(0.8571429em, calc(0.8571429em * var(--un-typography-factor, 1)), 1.5em)",
      "padding-right": "clamp(1.1428571em, calc(1.1428571em * var(--un-typography-factor, 1)), 1.75em)",
      "padding-bottom": "clamp(0.8571429em, calc(0.8571429em * var(--un-typography-factor, 1)), 1.5em)",
      "padding-left": "clamp(1.1428571em, calc(1.1428571em * var(--un-typography-factor, 1)), 1.75em)",
    },
    "ol, ul": {
      "margin-top": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 1.75em)",
      "margin-bottom": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 1.75em)",
      "padding-left": "clamp(1.625em, calc(1.625em * var(--un-typography-factor, 1)), 2em)",
    },
    li: {
      "margin-top": "clamp(0.5em, calc(0.5em * var(--un-typography-factor, 1)), 1em)",
      "margin-bottom": "clamp(0.5em, calc(0.5em * var(--un-typography-factor, 1)), 1em)",
    },
    "ol > li, ul > li": {
      "padding-left": "clamp(0.375em, calc(0.375em * var(--un-typography-factor, 1)), 0.75em)",
    },
    "> ul > li p": {
      "margin-top": "clamp(0.75em, calc(0.75em * var(--un-typography-factor, 1)), 1.2em)",
      "margin-bottom": "clamp(0.75em, calc(0.75em * var(--un-typography-factor, 1)), 1.2em)",
    },
    "> ul > li > *:first-child, > ol > li > *:first-child": {
      "margin-top": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 2em)",
    },
    "> ul > li > *:last-child, > ol > li > *:last-child": {
      "margin-bottom": "clamp(1.25em, calc(1.25em * var(--un-typography-factor, 1)), 2em)",
    },
    "ul ul, ul ol, ol ul, ol ol": {
      "margin-top": "clamp(0.75em, calc(0.75em * var(--un-typography-factor, 1)), 1.25em)",
      "margin-bottom": "clamp(0.75em, calc(0.75em * var(--un-typography-factor, 1)), 1.25em)",
    },
    hr: {
      "margin-top": "clamp(3em, calc(3em * var(--un-typography-factor, 1)), 4rem)",
      "margin-bottom": "clamp(3em, calc(3em * var(--un-typography-factor, 1)), 4rem)",
    },
    "hr + *, h2 + *, h3 + *, h4 + *": {
      "margin-top": "0",
    },
    table: {
      "font-size": "clamp(0.875em, calc(0.875em * var(--un-typography-factor, 1)), 1em)",
      "line-height": 1.7142857,
    },
    "thead th": {
      "padding-right": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 1em)",
      "padding-bottom": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 1em)",
      "padding-left": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 1em)",
    },
    "thead th:first-child": {
      "padding-left": "0",
    },
    "thead th:last-child": {
      "padding-right": "0",
    },
    "tbody td, tfoot td": {
      "padding-top": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 0.875em)",
      "padding-right": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 0.875em)",
      "padding-bottom": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 0.875em)",
      "padding-left": "clamp(0.5714286em, calc(0.5714286em * var(--un-typography-factor, 1)), 0.875em)",
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
}

export const getStyles = (theme: Theme): Styles => mergeDeep(getDefaultStyles(theme), base(theme));

export const getBaseStyle = (size: Size) => baseStyles[size];

const baseStyles: Record<Size, Record<string, string | number>> = {
  base: { "font-size": "0.875rem", "line-height": 1.7142857, "--un-typography-factor": 1 },
  lg: { "font-size": "1.125rem", "line-height": 1.7777778, "--un-typography-factor": 1.1851852 },
  xl: { "font-size": "1.25rem", "line-height": 1.8, "--un-typography-factor": 1.25 },
};
