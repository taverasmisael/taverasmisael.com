import removeMD from "remove-markdown";
import sliceStr from "string-byte-slice";
import { getEntriesByLang } from "@/utils/content";
import { LANGUAGES } from "@/utils/i18n";
import { getEnv } from "@/utils/env";

export const prerender = true;
export async function get() {
  const entries = (await Promise.all(LANGUAGES.map(l => getEntriesByLang("blog", l)))).flat();

  const items = entries.map(entry => ({
    objectID: entry.entry.slug,
    title: entry.meta.title,
    excerpt: entry.entry.data.description,
    date: entry.entry.data.date,
    lang: entry.meta.lang,
    tags: entry.entry.data.tags,
    imageUrl: new URL(entry.entry.data.banner.src, getEnv().SITE).toString(),
    body: sliceStr(removeMD(entry.entry.body, { useImgAltText: false }).replaceAll(/\n\n/g, " "), 0, 8000),
  }));

  const res = new Response(JSON.stringify(items), {
    headers: {
      "content-type": "application/json",
      "X-Robots-Tag": "noindex",
    },
    status: 200,
  });
  return res;
}
