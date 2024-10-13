import { loadEnv } from "vite";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import solidjs from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import node from "@astrojs/node";
import { sitemap } from "./integrations/sitemap";
import { algolia } from "./integrations/algolia";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "") || process.env;
const site = env.PUBLIC_SITE_URL || `https://${env.VERCEL_URL}/` || "https://localhost:4321/";

// Vercel adapter doesn't support SSR yet, so we use node adapter for local builds
// This is useful for testing SSR locally
const adapter = env.LOCAL_BUILD ? node({ mode: "standalone" }) : vercel();
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
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  prefetch: true,
  integrations: [
    tailwind(),
    mdx(),
    solidjs(),
    sitemap({ name: "sitemap-static.xml", ignoredPaths: [`/${algoliaOutputName}`] }),
    ...algoliaIntegration(env.LOCAL_BUILD),
  ],
  markdown: {
    shikiConfig: { theme: "css-variables" },
  },
  output: "server",
  vite: {
    ssr: { external: ["@resvg/resvg-js"] },
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
    build: { rollupOptions: { external: ["@resvg/resvg-js"] } },
  },
  env: {
    validateSecrets: true,
    schema: {
      SITE: envField.string({ context: "client", access: "public", default: site, url: true }),
      PUBLIC_SITE_URL: envField.string({ context: "client", access: "public", default: site, url: true }),
      PUBLIC_ALGOLIA_SEARCH_KEY: envField.string({ context: "client", access: "public", min: 1 }),
      MAILGUN_DOMAIN: envField.string({ context: "server", access: "public", min: 1 }),
      MAILGUN_API_KEY: envField.string({ context: "server", access: "public", min: 1 }),
      CONTACT_EMAIL: envField.string({ context: "server", access: "public", min: 1 }),
      ALGOLIA_APP_ID: envField.string({ context: "server", access: "public", min: 1 }),
      ALGOLIA_API_KEY: envField.string({ context: "server", access: "public", min: 1 }),
      ALGOLIA_INDEX_NAME: envField.string({ context: "server", access: "public", min: 1 }),
      VERCEL_GIT_COMMIT_SHA: envField.string({ context: "server", access: "public", optional: true, default: "DEVMODE" }),
    },
  },
});
