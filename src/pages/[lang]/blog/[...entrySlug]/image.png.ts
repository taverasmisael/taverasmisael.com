import { Resvg } from "@resvg/resvg-js";
import { getBlogEntry, getCollection } from "@/utils/content";
import { generateOGImage } from "@/utils/content/open-graph/image";

const WIDTH = 1200;
const HEIGHT = 630;

// Prerenderingd these not because the SSR is slow, but because OpenGraph
// images need to be THERE for most services to detect it (like WhatsApp, TG< ).
// This will potentially be a problem if we have a lot of blog posts, but
// we can solve it by using a cache.
export const prerender = true;
export async function get({ params }: { params: Record<string, string> }) {
  try {
    console.time("og-image");
    const post = await getBlogEntry(Object.values(params).join("/"));

    if (!post) return new Response("NOT FOUND", { status: 404 });
    const svg = await generateOGImage({
      title: post.meta.title,
      description: post.meta.description,
      image: "https://raw.githubusercontent.com/taverasmisael/taverasmisael.com/main/public/og-image-bg.png",
      width: WIDTH,
      height: HEIGHT,
    });


    console.timeEnd("og-image");

    console.time("resvg");
    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render();
    const png = resvg.asPng();
    console.timeEnd("resvg");

    return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } });
  } catch (e) {
    console.log(e);
    return new Response("SOMETHING WENT WRONG", { status: 500 });
  }
}

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map(post => {
    const [lang, entrySlug] = post.slug.split("/");
    return {
      params: { lang, entrySlug },
    };
  });
}
