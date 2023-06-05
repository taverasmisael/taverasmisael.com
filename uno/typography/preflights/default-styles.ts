import type { Theme } from "../theme";
import type { Styles } from "./sizes";

export const getDefaultStyles = (theme: Theme): Styles => ({
  '[class~="lead"]': {
    color: "var(--un-prose-lead)",
  },
  a: {
    color: "var(--un-prose-links)",
    "text-decoration": "underline",
    "font-weight": "500",
  },
  strong: {
    color: "var(--un-prose-bold)",
    "font-weight": "600",
  },
  "a strong": {
    color: "inherit",
  },
  "blockquote strong": {
    color: "inherit",
  },
  "thead th strong": {
    color: "inherit",
  },
  ol: {
    "list-style-type": "decimal",
  },
  'ol[type="A"]': {
    "list-style-type": "upper-alpha",
  },
  'ol[type="a"]': {
    "list-style-type": "lower-alpha",
  },
  'ol[type="A" s]': {
    "list-style-type": "upper-alpha",
  },
  'ol[type="a" s]': {
    "list-style-type": "lower-alpha",
  },
  'ol[type="I"]': {
    "list-style-type": "upper-roman",
  },
  'ol[type="i"]': {
    "list-style-type": "lower-roman",
  },
  'ol[type="I" s]': {
    "list-style-type": "upper-roman",
  },
  'ol[type="i" s]': {
    "list-style-type": "lower-roman",
  },
  'ol[type="1"]': {
    "list-style-type": "decimal",
  },
  ul: {
    "list-style-type": "disc",
  },
  "ol > li::marker": {
    "font-weight": "400",
    color: "var(--un-prose-counters)",
  },
  "ul > li::marker": {
    color: "var(--un-prose-bullets)",
  },
  hr: {
    "border-color": "var(--un-prose-hr)",
    borderTopWidth: 1,
  },
  blockquote: {
    "font-weight": "500",
    color: "var(--un-prose-quotes)",
    "border-left-width": "0.25rem",
    "border-left-color": "var(--un-prose-quote-borders)",
    quotes: '"\\201C""\\201D""\\2018""\\2019"',
  },
  "blockquote p:first-of-type::before": {
    content: "open-quote",
  },
  "blockquote p:last-of-type::after": {
    content: "close-quote",
  },

  "h1, h2, h3, h4, h5, h6": {
    "font-family": theme.fontFamily.display.join(", "),
    "text-wrap": "balance",
  },
  h1: {
    color: "var(--un-prose-headings)",
    "font-weight": "800",
  },
  "h1 strong": {
    "font-weight": "900",
    color: "inherit",
  },
  h2: {
    color: "var(--un-prose-headings)",
    "font-weight": "700",
  },
  "h2 strong": {
    "font-weight": "800",
    color: "inherit",
  },
  h3: {
    color: "var(--un-prose-headings)",
    "font-weight": "600",
  },
  "h3 strong": {
    "font-weight": "700",
    color: "inherit",
  },
  h4: {
    color: "var(--un-prose-headings)",
    "font-weight": "600",
  },
  "h4 strong": {
    "font-weight": "700",
    color: "inherit",
  },
  img: {
    "border-radius": theme.borderRadius.md,
    "margin-left": "auto",
    "margin-right": "auto",
  },
  "figure > *": {},
  figcaption: {
    color: "var(--un-prose-captions)",
  },
  code: {
    color: "var(--un-prose-code)",
    "font-weight": "600",
  },
  "code::before": {
    content: '"`"',
  },
  "code::after": {
    content: '"`"',
  },
  "a code": {
    color: "inherit",
  },
  "h1 code": {
    color: "inherit",
  },
  "h2 code": {
    color: "inherit",
  },
  "h3 code": {
    color: "inherit",
  },
  "h4 code": {
    color: "inherit",
  },
  "blockquote code": {
    color: "inherit",
  },
  "thead th code": {
    color: "inherit",
  },
  pre: {
    color: "var(--un-prose-pre-code)",
    // For some reason the shiki theme background color is not being applied
    "background-color": "var(--un-prose-pre-bg)!important",
    "font-family": theme.fontFamily.mono.join(", "),
    "overflow-x": "auto",
    "font-weight": "300",
  },
  "pre code": {
    "background-color": "transparent",
    "border-width": "0",
    "border-radius": "0",
    padding: "0",
    "font-weight": "inherit",
    color: "inherit",
    "font-size": "inherit",
    "font-family": "inherit",
    "line-height": "inherit",
  },
  "pre code::before": {
    content: "none",
  },
  "pre code::after": {
    content: "none",
  },
  table: {
    width: "100%",
    "table-layout": "auto",
    "text-align": "left",
    marginTop: "2em",
    marginBottom: "2em",
  },
  thead: {
    "border-bottom-width": "1px",
    "border-bottom-color": "var(--un-prose-th-borders)",
  },
  "thead th": {
    color: "var(--un-prose-headings)",
    "font-weight": "600",
    "vertical-align": "bottom",
  },
  "tbody tr": {
    "border-bottom-width": "1px",
    "border-bottom-color": "var(--un-prose-td-borders)",
  },
  "tbody tr:last-child": {
    "border-bottom-width": "0",
  },
  "tbody td": {
    "vertical-align": "baseline",
  },
  tfoot: {
    "border-top-width": "1px",
    "border-top-color": "var(--un-prose-th-borders)",
  },
  "tfoot td": {
    "vertical-align": "top",
  },
});
