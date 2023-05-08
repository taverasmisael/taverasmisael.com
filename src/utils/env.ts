import { z } from "zod";

const envSchema = z.object({
  SITE: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  return envSchema.parse(import.meta.env);
}