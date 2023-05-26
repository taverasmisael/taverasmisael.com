import { loadEnv } from "vite";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import solidjs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify/functions";
import node from "@astrojs/node";

import { sitemap } from "./integrations/sitemap";
import { algolia } from "./integrations/algolia";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "") || process.env;

// Netlify adapter doesn't support SSR yet, so we use node adapter for local builds
// This is useful for testing SSR locally
const adapter = env.LOCAL_BUILD ? node({ mode: "standalone" }) : netlify();
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
  experimental: { assets: true },
  integrations: [
    tailwind(),
    mdx(),
    prefetch({ selector: "article a:not([href^='/']), a[rel*='prefetch']" }),
    solidjs(),
    sitemap({ name: "sitemap.xml", ignoredPaths: [`/${algoliaOutputName}`] }),
    ...algoliaIntegration(env.LOCAL_BUILD),
  ],
  markdown: { remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to content" } },
  output: "server",
  site: env.PUBLIC_SITE_URL || "https://localhost:5000",
  vite: {
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    build: {
      rollupOptions: {
        external: ["@resvg/resvg-js"],
      },
    },
  },
});
