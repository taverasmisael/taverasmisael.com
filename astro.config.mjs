import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import unocss from "unocss/astro";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import solidjs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import node from "@astrojs/node";

import { sitemap } from "./integrations/sitemap";
import { algolia } from "./integrations/algolia";
import nightOwlTheme from "./integrations/night-owl.theme.json";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "") || process.env;
const site = env.PUBLIC_SITE_URL || `https://${env.VERCEL_URL}/` || "https://localhost:3000/";

// Netlify adapter doesn't support SSR yet, so we use node adapter for local builds
// This is useful for testing SSR locally
const adapter = env.LOCAL_BUILD ? node({ mode: "standalone" }) : vercel();
console.log("Using adapter:", adapter.name);

const algoliaOutputName = "algolia.json";
// For local builds, we don't want to update the index
const algoliaIntegration = localBuild =>
  !localBuild
    ? [
        algolia({
          apiKey: env.ALGOLIA_API_KEY,
          appId: env.ALGOLIA_APP_ID,
          indexName: env.ALGOLIA_INDEX_NAME,
          name: algoliaOutputName,
        }),
      ]
    : [];

export default defineConfig({
  adapter,
  site,
  compressHTML: true,
  experimental: { assets: true, inlineStylesheets: "auto" },
  integrations: [
    unocss({ injectReset: true, mode: "dist-chunk", injectEntry: import.meta.env.DEV, warn: true }),
    mdx(),
    prefetch({ selector: "article a:not([href^='/']), a[rel*='prefetch']" }),
    solidjs(),
    sitemap({ name: "sitemap.xml", ignoredPaths: [`/${algoliaOutputName}`] }),
    ...algoliaIntegration(env.LOCAL_BUILD),
  ],
  markdown: {
    // TODO: P3 - Add light/dark theme support (css variables) #10
    shikiConfig: { theme: nightOwlTheme },
    remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to content" },
  },
  output: "server",
  vite: {
    ssr: { external: ["@resvg/resvg-js"] },
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
    build: { rollupOptions: { external: ["@resvg/resvg-js"] } },
  },
});
