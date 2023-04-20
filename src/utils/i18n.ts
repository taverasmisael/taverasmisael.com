export const DEFAULT_LOCALE = "es";

export function getFullLocalizedPath(locale: string) {
  return (path: string): string => {
    return `/${locale || DEFAULT_LOCALE}${path}/`;
  };
}
