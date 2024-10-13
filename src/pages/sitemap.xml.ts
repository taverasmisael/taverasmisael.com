import { SITE } from "astro:env/client";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const sitemapIndex = await generateSitemapIndex(SITE);
  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml;charset=UTF-8",
    },
  });
};

const generateSitemapIndex = async (hostname: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${hostname}sitemap-entries.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${hostname}sitemap-static.xml</loc>
    </sitemap>
  </sitemapindex>
  `;
};
