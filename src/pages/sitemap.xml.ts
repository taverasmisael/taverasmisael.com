import { createEntriesSitemap } from "@/utils/entriesSitemap";
import { getEnv } from "@/utils/env";

export const prerender = true;

export async function GET(): Promise<Response> {
  return new Response(await createEntriesSitemap(getEnv().SITE), {
    headers: {
      "Content-Type": "application/xml;charset=UTF-8",
    },
  });
}
