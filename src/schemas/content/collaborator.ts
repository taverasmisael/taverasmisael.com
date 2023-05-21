import { defineCollection, z } from "astro:content";

// This is to hel give credit to any amazing people who helped with the site.
// Probaby in the future will get it directly from GitHub, and we can just
// add a link to their profile, and delete this collection.
export const collaboratorCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    type: z.enum(["TRANSLATOR", "CODER", "DESIGNER", "OTHER"]),
    link: z.string().url(),
  }),
});