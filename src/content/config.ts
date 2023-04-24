// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: ({image}) =>
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
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
};
