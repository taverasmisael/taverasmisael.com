import { anyPass, complement, groupBy, map } from "rambda";
import { createReadStream, createWriteStream, unlink, copyFile, existsSync } from "fs";
import { resolve } from "path";
import { EnumChangefreq, SitemapStream, XMLToSitemapItemStream, streamToPromise, type SitemapItemLoose } from "sitemap";
import { tmpdir } from "os";
import { Readable } from "stream";

type SitemapItem = Pick<SitemapItemLoose, "url" | "lastmod" | "changefreq" | "priority" | "links">;
import type { AstroConfig, AstroIntegration } from "astro";

import { Logger } from "./utils/logger";
import { fileURLToPath } from "url";

interface SitemapConfig {
  name: string;
  customPaths?: string[];
}

const ignoreRSS = (page: string) => /rss(-\w{2})?(-\w{2})?.xml/.test(page);
const ignoreSitemapIndex = (page: string) => /(sitemap-index.xml|sitemap.xml)/.test(page);
const ignoreImageFolder = (page: string) => /(_image)/.test(page);
const ignoreStatusPages = (page: string) => /\/[0-9]{3}\/?$/.test(page);

const sitemapFilters = complement(anyPass([ignoreRSS, ignoreSitemapIndex, ignoreImageFolder, ignoreStatusPages]));

export function sitemap({ name, customPaths = [] }: SitemapConfig): AstroIntegration {
  let astroConfig: AstroConfig;
  const NAME = "@taverasmisael/sitemaps";
  const logger = new Logger(NAME);

  return {
    name: NAME,
    hooks: {
      "astro:config:done": config => {
        astroConfig = config.config;
      },
      // TODO: Split this monstrous function and add tests
      "astro:build:done": async config => {
        if (!name) {
          logger.error("No sitemap name found. Skipping...");
          return;
        }
        logger.info("Generating sitemap...");
        const site = new URL(astroConfig.base, astroConfig.site);
        const routes = config.routes.filter(r => r.pathname && sitemapFilters(r.pathname)).map(r => r.pathname ?? "");
        if (routes.length) {
          logger.success(`Found ${routes.length} route(s) to generate sitemap`);
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

          const existingSiteMap = createReadStream(smPath).pipe(new XMLToSitemapItemStream());
          existingSiteMap.pipe(smStream).pipe(createWriteStream(tempPath));

          existingSiteMap.on("error", error => logger.error(error.message));
          existingSiteMap.on("finish", () => {
            copyFile(tempPath, smPath, error => {
              if (error) {
                logger.error(error.message);
              }
              unlink(tempPath, error => {
                if (error) {
                  logger.error(error.message);
                }
              });
            });
            logger.success("Sitemap updated successfully");
          });
          await streamToPromise(smStream);
        } else {
          logger.warn("No routes found to generate sitemap. Skipping...");
        }
      },
    },
  };
}
