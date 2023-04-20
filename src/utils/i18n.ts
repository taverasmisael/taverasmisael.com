export const DEFAULT_LOCALE = "es";

export function fullLocalizedPath(locale: string, path: string): string {
  console.log({ locale, path });
  return `/${locale || DEFAULT_LOCALE}${path}/`;
}
