import removeMD from "remove-markdown";
import sliceStr from "string-byte-slice";
import { getEntriesByLang, getEntryURL, slugToCanonical } from "@/utils/content";
import { LANGUAGES } from "@/utils/i18n";

export const prerender = true;
export async function GET() {
  const entries = (await Promise.all(LANGUAGES.map(l => getEntriesByLang("blog", l)))).flat();

  const items = entries.map(({ entry, meta }) => ({
    objectID: entry.id,
    title: meta.title,
    excerpt: entry.data.description,
    date: entry.data.date,
    lang: meta.lang,
    tags: entry.data.tags,
    imageUrl: slugToCanonical(getEntryURL("blog", `${entry.id}/image.png`)),
    body: sliceStr(removeMD(entry.body, { useImgAltText: false }).replaceAll(/\n\n/g, " "), 0, 8000),
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
