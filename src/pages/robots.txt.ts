import { SITE } from "astro:env/client";

export function get() {
  return {
    body: `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /algolia.json

Sitemap: ${SITE}sitemap.xml
  `.trim(),
  };
}
