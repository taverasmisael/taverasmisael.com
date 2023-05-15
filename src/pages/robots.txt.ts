import { getEnv } from "@/utils/env";

export function get() {
  const { SITE } = getEnv();

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
