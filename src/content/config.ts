import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      isDraft: z.boolean().default(false),
      title: z.string(),
      date: z.string().pipe(z.coerce.date()),
      description: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
      banner: image(),
    }),
});

export const collections = {
  blog: blogCollection,
};
