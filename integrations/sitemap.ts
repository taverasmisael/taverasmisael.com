import { anyPass, complement, groupBy, map } from "rambda";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { existsSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { EnumChangefreq, SitemapStream, streamToPromise, type SitemapItemLoose } from "sitemap";
import type { AstroConfig, AstroIntegration } from "astro";

type SitemapItem = Pick<SitemapItemLoose, "url" | "lastmod" | "changefreq" | "priority" | "links">;

import { Logger } from "./utils/logger";

interface SitemapConfig {
  name: string;
  customPaths?: string[];
  ignoredPaths?: string[];
}

// NOTE: This is at least 180% faster than using something like zod
const ignoreRSS = (page: string) => /rss(-\w{2})?(-\w{2})?.xml/.test(page);
const ignoreSitemapIndex = (page: string) => /(sitemap-index.xml|sitemap.xml)/.test(page);
const ignoreImageFolder = (page: string) => /(_image)/.test(page);
const ignoreStatusPages = (page: string) => /\/[0-9]{3}\/?$/.test(page);
const ignoreAPI = (page: string) => page.startsWith("/api");
const ignoreRobots = (page: string) => page === "/robots.txt";
const sitemapFilters = complement(
  anyPass([ignoreRSS, ignoreSitemapIndex, ignoreImageFolder, ignoreStatusPages, ignoreAPI, ignoreRobots]),
);

export const INTEGRATION_NAME = "@taverasmisael/sitemaps";
export function sitemap({ name, customPaths = [], ignoredPaths = [] }: SitemapConfig): AstroIntegration {
  let astroConfig: AstroConfig;
  const logger = new Logger(INTEGRATION_NAME);

  return {
    name: INTEGRATION_NAME,
    hooks: {
      "astro:config:done": config => {
        astroConfig = config.config;
      },
      // TODO: P3 - Split this monstrous function and add tests #4
      "astro:build:done": async config => {
        if (!name) {
          logger.error("No sitemap name given. Skipping...");
          return;
        }
        logger.info("Generating sitemap...");
        const site = new URL(astroConfig.base, astroConfig.site);
        const routes = config.routes.reduce<string[]>(
          (acc, r) => [
            ...acc,
            ...(r.pathname && sitemapFilters(r.pathname) && !ignoredPaths.includes(r.pathname) ? [r.pathname] : []),
          ],
          [],
        );
        if (routes.length) {
          logger.info(`Found ${routes.length} route(s) to generate sitemap`);
          const grouppedRoutes = groupBy(
            pathname => {
              const [, id] = pathname.split("/").filter(Boolean);
              return id;
            },
            [...routes, ...customPaths],
          );

          const items: Record<string, SitemapItem[]> = map(pages => {
            return map(
              page =>
                ({
                  url: new URL(page, site).toString(),
                  changefreq: EnumChangefreq.WEEKLY,
                  priority: 0.5,
                  links: pages.map(alternate => {
                    const [lang] = alternate.split("/").filter(Boolean);
                    return {
                      lang: lang || "x-default",
                      url: new URL(alternate, site).toString(),
                    };
                  }) satisfies SitemapItem[],
                }) satisfies SitemapItem,
              pages,
            );
          }, grouppedRoutes);

          const smStream = Readable.from(Object.values(items).flat()).pipe(new SitemapStream(), { end: true });
          const smPath = fileURLToPath(new URL(name, config.dir));

          if (!existsSync(smPath)) {
            logger.info(`Sitemap file not found at ${smPath}. Creating...`);
            writeFileSync(smPath, "");
          }

          smStream.on("error", error => logger.error(error.message));
          smStream.on("finish", () => logger.success("SM Sitemap finished successfully"));

          const buffer = await streamToPromise(smStream);
          await writeFile(smPath, buffer);
        } else {
          logger.warn("No routes found to generate sitemap. Skipping...");
        }
      },
    },
  };
}
