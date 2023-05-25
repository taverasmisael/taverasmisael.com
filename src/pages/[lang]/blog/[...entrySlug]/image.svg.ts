import { getBlogEntry, slugToCanonical } from "@/utils/content";
import { generateOGImage } from "@/utils/content/image";

const WIDTH = 1200;
const HEIGHT = 630;

export async function get({ params, site }: { params: Record<string, string>; site: URL }) {
  try {
    const post = await getBlogEntry(Object.values(params).join("/"));

    if (!post) return new Response("NOT FOUND", { status: 404 });

    const svg = await generateOGImage({
      title: post.meta.title,
      description: post.meta.description,
      image: slugToCanonical("/og-image-bg.png", site.origin),
      width: WIDTH,
      height: HEIGHT,
    });

    // TODO: Transform to PNG.
    // `@resvg/resvg` is a good candidate for this. But it has some issues with 
    // importing `.node` packages, there's no good way to do this without Vercel atm.
    // See: https://github.com/yisibl/resvg-js/issues/175
    // See: https://github.com/etherCorps/sveltekit-og
    // This is super curious because installing the package and using it without stopping the server works fine.
    // But if you restart, or build, or deploy, it will crash.

    return new Response(svg, { status: 200, headers: { "Content-Type": "image/svg+xml" } });
  } catch (e) {
    console.log(e);
    return new Response("SOMETHING WENT WRONG", { status: 500 });
  }
}
