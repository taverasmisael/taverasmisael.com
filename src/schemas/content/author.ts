import { defineCollection, z } from "astro:content";
import { LANGUAGES, DEFAULT_LOCALE } from "@/utils/i18n";
import { glob } from "astro/loaders";

export const authorCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/author" }),
  schema: z.object({
    name: z.string(),
    type: z.enum(["OWNER", "PRIMARY", "GUEST"]),
    title: z.string(),
    location: z.string(),
    avatar: z.string(),
    bio: z.object(
      LANGUAGES.reduce(
        (acc, lang) => ({ ...acc, [lang]: lang !== DEFAULT_LOCALE ? z.string().optional() : z.string() }),
        {},
      ),
    ),
    link: z.string().url(),
  }),
});
