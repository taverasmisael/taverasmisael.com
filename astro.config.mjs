import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import solidjs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify/functions";

import { sitemap} from './integrations/sitemap'

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  experimental: { assets: true },
  integrations: [
    tailwind(),
    mdx(),
    prefetch({
      selector: "article a:not([href^='/']), a[rel*='prefetch']",
    }),
    sitemap(),
    solidjs(),
  ],
  markdown: { remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to content" } },
  output: "server",
  site: import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || "https://localhost:3000",
});
