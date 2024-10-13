// This is a placeholder, since the real static sitemap is generated a build time with the custom integration
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`,
    {
      headers: {
        "Content-Type": "application/xml;charset=UTF-8",
      },
    },
  );
}
