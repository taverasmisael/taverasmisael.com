import { z } from "zod";

const publicEnvSchema = z.object({
  SITE: z.string(),
  PUBLIC_SITE_URL: z.string().optional(),
  PUBLIC_ALGOLIA_SEARCH_KEY: z.string().min(1),
});

const envSchema = publicEnvSchema.merge(
  z.object({
    MAILGUN_DOMAIN: z.string().min(1),
    MAILGUN_API_KEY: z.string().min(1),
    CONTACT_EMAIL: z.string().email(),
    ALGOLIA_APP_ID: z.string().min(1),
    ALGOLIA_API_KEY: z.string().min(1),
    ALGOLIA_INDEX_NAME: z.string().min(1),
    VERCEL_GIT_COMMIT_SHA: z.string().optional().default("DEVMODE"),
  }),
);

export type Env = z.infer<typeof envSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function getEnv(): Env {
  return envSchema.parse(import.meta.env);
}

export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse(import.meta.env);
}
