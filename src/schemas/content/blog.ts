import { defineCollection, z, reference } from "astro:content";
import { glob } from "astro/loaders";

export const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    date: z.string().pipe(z.coerce.date()),
    description: z.string(),
    author: reference("author"),
    translatedBy: z.array(reference("author")).optional(),
    tags: z.array(z.string()),
  }),
});
