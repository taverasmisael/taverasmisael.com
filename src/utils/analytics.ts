export function gTag(...args: unknown[]) {
  if (window.gtag) window.gtag(...args);
}
