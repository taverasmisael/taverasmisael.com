import { getBlogEntry, getCollection } from "@/utils/content";
import { generateOGImage } from "@/utils/content/open-graph/image";

const WIDTH = 1200;
const HEIGHT = 630;

export const prerender = true;
export async function get({ params }: { params: Record<string, string> }) {
  try {
    console.time("og-image");
    const post = await getBlogEntry(Object.values(params).join("/"));

    if (!post) return new Response("NOT FOUND", { status: 404 });
    const svg = await generateOGImage({
      title: post.meta.title,
      description: post.meta.description,
      // TODO: Replace with link inside repo when it's public.
      // Our version of the image is optimized for the web annd we won't depend on
      // external services availability to get it.
      image: "https://cdn.midjourney.com/178abd2b-a069-4921-9450-fea2b1b1d52b/0_2.png",
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

    console.timeEnd("og-image");
    return new Response(svg, { status: 200, headers: { "Content-Type": "image/svg+xml" } });
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
