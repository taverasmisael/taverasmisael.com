import { createReadStream, createWriteStream, copyFile, unlink } from "fs";
import { fileURLToPath } from "url";
import { SitemapIndexStream, XMLToSitemapIndexStream, streamToPromise } from "sitemap";
import { tmpdir } from "os";
import AstroSitemap from "@astrojs/sitemap";
import type { AstroConfig, AstroIntegration } from "astro";

import { Logger } from "./utils/logger";

interface SitemapConfig {
  entriesSitemapName: string;
}

export function sitemap({ entriesSitemapName }: SitemapConfig): AstroIntegration {
  let astroConfig: AstroConfig;
  const aSitemap = AstroSitemap({
    i18n: { defaultLocale: "es", locales: { es: "es", en: "en" } },
    customPages: ["https://localhost:3000/en"],
    // Remove all RSS feeds from the sitemap
    filter: page => !/rss(-\w{2})?(-\w{2})?.xml/.test(page),
  });
  const NAME = "@taverasmisael/sitemap";
  const logger = new Logger(NAME);
  return {
    name: NAME,
    hooks: {
      "astro:config:done": async config => {
        await aSitemap.hooks["astro:config:done"]?.(config);
        astroConfig = config.config;
      },
      "astro:build:done": async config => {
        await aSitemap.hooks["astro:build:done"]?.(config);
        logger.info(`Extending sitemap index with ${entriesSitemapName}`);
        const site = new URL(astroConfig.base, astroConfig.site);

        const tempPath = tmpdir() + "/sm.xml";
        const smStream = new SitemapIndexStream();
        const smPath = fileURLToPath(new URL("sitemap-index.xml", config.dir));
        const smEntriesPath = new URL(entriesSitemapName, site);

        const smXMLStream = createReadStream(smPath)
          .pipe(new XMLToSitemapIndexStream())
          .pipe(smStream)
          .pipe(createWriteStream(tempPath));

        smXMLStream.on("data", data => logger.info(data as string));
        smXMLStream.on("error", error =>
          logger.error(`[${error.name || "ERROR on Sitemap stream"}]: ${error.message}`)
        );
        smXMLStream.on("finish", () => {
          copyFile(tempPath, smPath, () => unlink(tempPath, _ => _));
          logger.success(`${entriesSitemapName} added to sitemap index`);
        });

        smStream.write(smEntriesPath.toString());
        await streamToPromise(smStream);
      },
    },
  };
}
