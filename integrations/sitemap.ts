import AstroSitemap from "@astrojs/sitemap";
import type { AstroIntegration } from "astro";

export function sitemap(): AstroIntegration {
  const aSitemap = AstroSitemap({
    i18n: { defaultLocale: "es", locales: { es: "es", en: "en" } },
    customPages: ["https://localhost:3000/en"],
  });
  const NAME = "TAVERAS_SITEMAP";

  return {
    name: NAME,
    hooks: {
      "astro:config:done": async config => aSitemap.hooks["astro:config:done"]?.(config),
      "astro:build:done": async config => {
        return aSitemap.hooks["astro:build:done"]?.({
          ...config,
          // @ts-expect-error - TODO: fix this
          routes: [...config.routes, ...config.pages.map(p => ({ ...p, generate: () => `/${p.pathname}` }))],
        });
      },
    },
  };
}
