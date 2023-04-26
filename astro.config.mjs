import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import solidjs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: "server",
  trailingSlash: 'never',
  adapter: netlify(),
  markdown: {
    remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to content" },
  },
  experimental: {
    assets: true,
  },
  integrations: [tailwind(), mdx(), prefetch(), sitemap(), solidjs()],
});
