import { Resvg } from "@resvg/resvg-js";
import { getBlogEntry } from "@/utils/content";
import { generateOGImage } from "@/utils/content/image";
import ogBG from "@/assets/images/og-background.png";

const BG_PATH = new URL(ogBG.src, import.meta.url).pathname.substring(1);
const WIDTH = 1200;
const HEIGHT = 630;

export async function get({ params }: { params: Record<string, string> }) {
  try {
    const post = await getBlogEntry(Object.values(params).join("/"));

    if (!post) return new Response("NOT FOUND", { status: 404 });

    const svg = await generateOGImage({
      title: post.meta.title,
      description: post.meta.description,
      image: BG_PATH,
      width: WIDTH,
      height: HEIGHT,
    });

    const image = new Resvg(svg, {
      fitTo: { mode: "width", value: WIDTH },
    }).render();

    return new Response(image.asPng(), { status: 200, headers: { "Content-Type": "image/png" } });
  } catch (e) {
    console.log(e);
    return new Response("SOMETHING WENT WRONG", { status: 500 });
  }
}
