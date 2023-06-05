import { anyPass, complement, groupBy, map } from "rambda";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { Readable } from "node:stream";
import { createReadStream, createWriteStream, copyFileSync, existsSync, unlinkSync } from "node:fs";
import { EnumChangefreq, SitemapStream, XMLToSitemapItemStream, streamToPromise, type SitemapItemLoose } from "sitemap";

type SitemapItem = Pick<SitemapItemLoose, "url" | "lastmod" | "changefreq" | "priority" | "links">;
import type { AstroConfig, AstroIntegration } from "astro";

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
  anyPass([ignoreRSS, ignoreSitemapIndex, ignoreImageFolder, ignoreStatusPages, ignoreAPI, ignoreRobots])
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
          logger.error("No sitemap name found. Skipping...");
          return;
        }
        logger.info("Generating sitemap...");
        const site = new URL(astroConfig.base, astroConfig.site);
        const routes = config.routes.reduce<string[]>(
          (acc, r) => [
            ...acc,
            ...(r.pathname && sitemapFilters(r.pathname) && !ignoredPaths.includes(r.pathname) ? [r.pathname] : []),
          ],
          []
        );
        if (routes.length) {
          logger.info(`Found ${routes.length} route(s) to generate sitemap`);
          const grouppedRoutes = groupBy(
            pathname => {
              const [, slug] = pathname.split("/").filter(Boolean);
              return slug;
            },
            [...routes, ...customPaths]
          );

          const items: Record<string, SitemapItem[]> = map(pages => {
            return map(
              page =>
                ({
                  url: new URL(page, site).toString(),
                  changefreq: EnumChangefreq.MONTHLY,
                  priority: 0.5,
                  links: pages.map(alternate => {
                    const [lang] = alternate.split("/").filter(Boolean);
                    return { lang: lang || "es", url: new URL(alternate, site).toString() };
                  }) satisfies SitemapItem[],
                } satisfies SitemapItem),
              pages
            );
          }, grouppedRoutes);

          const tempPath = resolve(tmpdir(), "sitemap.xml");
          const smStream = Readable.from(Object.values(items).flat()).pipe(new SitemapStream(), { end: false });
          const smPath = fileURLToPath(new URL(name, config.dir));

          if (!existsSync(smPath)) {
            logger.error(`Sitemap file not found at ${smPath}. Skipping...`);
            return;
          }

          const existingSiteMap = createReadStream(smPath)
            .pipe(new XMLToSitemapItemStream())
            .pipe(smStream)
            .pipe(createWriteStream(tempPath));

          existingSiteMap.on("error", error => logger.error(error.message));
          existingSiteMap.on("finish", () => {
            logger.info("Sitemap updated successfully");
            copyFileSync(tempPath, smPath);
            unlinkSync(tempPath);
          });

          smStream.on("error", error => logger.error(error.message));
          smStream.on("finish", () => logger.success("Sitemap finished successfully"));

          await streamToPromise(smStream);
        } else {
          logger.warn("No routes found to generate sitemap. Skipping...");
        }
      },
    },
  };
}
