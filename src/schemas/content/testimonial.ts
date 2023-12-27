import { defineCollection, z } from "astro:content";

// This is to hel give credit to any amazing people who helped with the site.
// Probaby in the future will get it directly from GitHub, and we can just
// add a link to their profile, and delete this collection.
export const testimonialCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      title: z.string().min(1),
      link: z.string().url(),
      image: image(),
      quote: z.string().min(1),
    }),
});
