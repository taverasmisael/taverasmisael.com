/// <reference types="./env.d.ts" />
import "@total-typescript/ts-reset";
import { z } from "zod";

const env = z.object({
  PUBLIC_SITE_URL: z.string(),
});

export type Env = z.infer<typeof env>;

declare global {
  type ImportMetaEnv = Env;

  interface ImportMeta {
    env: ImportMetaEnv;
  }
}