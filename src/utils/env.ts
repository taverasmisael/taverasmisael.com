import { z } from "zod";

const publicEnvSchema = z.object({
  SITE: z.string(),
  PUBLIC_SITE_URL: z.string().optional(),
  PUBLIC_ALGOLIA_SEARCH_KEY: z.string().nonempty(),
  G_TAG_ID: z.string().nonempty(),
});

const envSchema = publicEnvSchema.merge(
  z.object({
    MAILGUN_DOMAIN: z.string().nonempty(),
    MAILGUN_API_KEY: z.string().nonempty(),
    CONTACT_EMAIL: z.string().email(),
    ALGOLIA_APP_ID: z.string().nonempty(),
    ALGOLIA_API_KEY: z.string().nonempty(),
    ALGOLIA_INDEX_NAME: z.string().nonempty(),
  })
);

export type Env = z.infer<typeof envSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function getEnv(): Env {
  return envSchema.parse(import.meta.env);
}

export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse(import.meta.env);
}
