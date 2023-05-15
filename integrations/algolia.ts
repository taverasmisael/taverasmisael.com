import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { ZodError, z } from "zod";
import algoliasearch from "algoliasearch";
import { Logger } from "./utils/logger";

const integrationSettingsSchema = z.object({
  apiKey: z.string().min(32),
  appId: z.string().nonempty(),
  name: z.string().nonempty(),
  indexName: z.string().nonempty(),
});

const algoliaItemSchema = z.array(
  z.object({
    objectID: z.string().nonempty(),
    title: z.string().nonempty(),
  })
);

type AlgoliaIntegrationSettings = z.infer<typeof integrationSettingsSchema>;
type AlgoliaItem = z.infer<typeof algoliaItemSchema>[number];

export const INTEGRATION_NAME = "@taverasmisael/algolia";
export function algolia(settings: AlgoliaIntegrationSettings): AstroIntegration {
  const logger = new Logger(INTEGRATION_NAME);

  let config: AlgoliaIntegrationSettings | undefined;

  return {
    name: INTEGRATION_NAME,
    hooks: {
      "astro:config:setup": () => {
        try {
          const parsedSettings = integrationSettingsSchema.parse(settings);
          config = parsedSettings;
        } catch (e) {
          if (e instanceof ZodError) {
            logger.error(
              `Invalid settings. One or more config keys is missing or invalid. Check: ${Object.keys(e.format())
                .filter(k => k !== "_errors")
                .toLocaleString()}`
            );
          }
        }
      },
      "astro:build:done": async ({ dir }) => {
        if (config) {
          await new Promise(res => setTimeout(res, 1000));
          const algoliaJSONPath = fileURLToPath(new URL(config.name, dir));
          if (!existsSync(algoliaJSONPath)) {
            logger.error(`JSON file with algolia items not found at ${algoliaJSONPath}. Aborting...`);
            return;
          }
          logger.info(`Reading items from: "${config.name}"`);

          const algoliaJSON = readFileSync(algoliaJSONPath, "utf-8");
          const parsedAlgoliaJSON = JSON.parse(algoliaJSON);
          if (!algoliaItemSchema.safeParse(parsedAlgoliaJSON).success) {
            logger.error(`Invalid JSON file. Check ${algoliaJSONPath}`);
            return;
          }

          // Why not use the `safeParsed` value? Because it removes the extra keys
          const algoliaItems = parsedAlgoliaJSON as AlgoliaItem[];

          try {
            const client = algoliasearch(config.appId, config.apiKey);
            const index = client.initIndex(config.indexName);
            logger.info(`Uploading ${algoliaItems.length} items to Algolia index ${config.indexName}...`);
            await index.saveObjects(algoliaItems);
            logger.success(`Items uploaded to Algolia index "${config.indexName}" successfully!`);
          } catch (e) {
            logger.error(`Error while uploading items to Algolia. Check console.`);
            console.error(e);
          }
        } else {
          logger.error(`Wrong settings loaded. Check console.`);
          return;
        }
      },
    },
  };
}
