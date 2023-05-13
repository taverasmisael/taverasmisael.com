import { z } from "zod";

const envSchema = z.object({
  SITE: z.string(),
  PUBLIC_SITE_URL: z.string().nonempty(),
  MAILGUN_DOMAIN: z.string().nonempty(),
  MAILGUN_API_KEY: z.string().nonempty(),
  CONTACT_EMAIL: z.string().email(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(import.meta.env);
}
