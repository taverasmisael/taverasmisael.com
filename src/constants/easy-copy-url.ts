export const CHROME_WEB_STORE_URL = "https://chromewebstore.google.com/detail/easy-url-copy";

export const GITHUB_URL = "https://github.com/taverasmisael/easy-url-copy";

export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;

export const PAGE_SLUG = "easy-copy-url";

export function getEasyCopyUrlPagePath(lang: "en" | "es") {
  return `/${lang}/${PAGE_SLUG}`;
}
