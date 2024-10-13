import { createEntriesSitemap } from "@/utils/entriesSitemap";
import { SITE } from "astro:env/client";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(await createEntriesSitemap(SITE), {
    headers: {
      "Content-Type": "application/xml;charset=UTF-8",
    },
  });
};
