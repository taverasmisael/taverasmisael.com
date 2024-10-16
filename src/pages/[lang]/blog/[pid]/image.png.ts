import { Resvg } from "@resvg/resvg-js";
import { getBlogEntry, getCollection } from "@/utils/content";
import { generateOGImage } from "@/utils/content/open-graph/image";
import { useTranslation } from "@/utils/i18n";

const WIDTH = 1200;
const HEIGHT = 630;

// Prerenderingd these not because the SSR is slow, but because OpenGraph
// images need to be THERE for most services to detect it (like WhatsApp, TG< ).
// This will potentially be a problem if we have a lot of blog posts, but
// we can solve it by using a cache.
export const prerender = true;
export async function GET({ params }: { params: Record<string, string> }) {
  try {
    const post = await getBlogEntry(Object.values(params).join("/"));
    if (!post) return new Response("NOT FOUND", { status: 404 });
    const t = await useTranslation(post.meta.lang);
    const svg = await generateOGImage({
      title: post.meta.title,
      description: post.meta.description,
      image: "https://raw.githubusercontent.com/taverasmisael/taverasmisael.com/main/public/og-image-bg.png",
      width: WIDTH,
      height: HEIGHT,
      writtenTag: t("ui", "written_by"),
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
    const png = resvg.render().asPng();

    return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } });
  } catch (e) {
    console.log(e);
    return new Response("SOMETHING WENT WRONG", { status: 500 });
  }
}

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map(post => {
    const [lang, pid] = post.id.split("/");
    return { params: { lang, pid } };
  });
}
