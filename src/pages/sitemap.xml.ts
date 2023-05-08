import { getCollection, getEntryURL, slugToCanonical } from "@/utils/content";
import type { Language } from "@/utils/i18n";

export const prerender = true;

export async function get(): Promise<Response> {
  const blogCollection = await getCollection("blog");
  const blogEntries = blogCollection.map((e, _, collection) => {
    const [lang, rawSlug] = e.slug.split("/") as [Language, string];

    const translationsEntities = collection
      .filter(p => {
        const [pLang, pSlug] = p.slug.split("/") as [Language, string];
        return pLang !== lang && pSlug === rawSlug;
      })
      .map(t => {
        const lang = t.slug.split("/")[0] as Language;
        const slug = slugToCanonical(getEntryURL("blog", t.slug));

        return { lang, slug };
      });

    return {
      loc: slugToCanonical(getEntryURL("blog", e.slug)),
      lastmod: e.data.date,
      changefreq: "monthly",
      priority: 0.8,
      translations: translationsEntities,
    };
  });
  const response = new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      >
        ${blogEntries
          .map(
            entry => `
            <url>
              <loc>${entry.loc}</loc>
              <lastmod>${entry.lastmod.toISOString()}</lastmod>
              <changefreq>${entry.changefreq}</changefreq>
              <priority>${entry.priority}</priority>
              ${entry.translations
                .map(({ lang, slug }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${slug}" />`)
                .join("")}
            </url>
          `
          )
          .join("")}
      </urlset>
      `,
    {
      headers: {
        "Content-Type": "application/xhtml+xml;charset=UTF-8",
      },
    }
  );

  await Promise.resolve(response);
  return response;
}
