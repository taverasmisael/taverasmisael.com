import { type Language, isSupportedLang } from "@/utils/i18n";

import type { APIContext } from "astro";
import { generateRSSFeed } from "@/utils/rss";
import { useTranslation } from "@/utils/i18n";

export async function GET(context: APIContext) {
  const { lang } = context.params as { lang: Language };
  if (!isSupportedLang(lang)) {
    return context.redirect("/rss.xml");
  }
  const t = await useTranslation(lang);
  const site = (context.site ?? "").toString();

  return generateRSSFeed({
    site,
    lang,
    description: t("page_descriptions", "blog"),
  });
}
