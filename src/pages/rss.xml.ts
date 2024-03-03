import type { APIContext } from "astro";
import { generateRSSFeed } from "@/utils/rss";
import { useTranslation } from "@/utils/i18n";

export async function GET(context: APIContext) {
  const t = await useTranslation("es");
  return generateRSSFeed({
    site: (context.site ?? "").toString(),
    description: t("page_descriptions", "blog"),
    lang: "es",
  });
}
