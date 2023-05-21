import { defineCollection, z, reference } from "astro:content";

export const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      isDraft: z.boolean().default(false),
      title: z.string(),
      date: z.string().pipe(z.coerce.date()),
      description: z.string(),
      author: reference("author"),
      translatedBy: z.array(reference("collaborator").or(reference("author"))).optional(),
      tags: z.array(z.string()),
      banner: image(),
    }),
});