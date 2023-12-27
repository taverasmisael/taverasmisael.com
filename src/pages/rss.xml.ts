import type { APIContext } from "astro";
import { generateRSSFeed } from "@/utils/rss";
import { useTranslation } from "@/utils/i18n";

const t = useTranslation("es");

export async function GET(context: APIContext) {
  return generateRSSFeed({
    site: (context.site ?? "").toString(),
    description: t("page_descriptions", "blog"),
    lang: "es",
  });
}
