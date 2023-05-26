// import { Resvg } from "@resvg/resvg-js";
// import { getBlogEntry, getCollection } from "@/utils/content";
// import { generateOGImage } from "@/utils/content/open-graph/image";

// const WIDTH = 1200;
// const HEIGHT = 630;

// // NOTE: If generating this on the fly is consuming too much resources, we can
// // generate it on build time and store it in the `public` folder.
// // Maybe if that's the case, we can create a script to generate all the images
// // and place them on a bucket so we don't have to generate them on build time.
// // export const prerender = true;
// export async function get({ params }: { params: Record<string, string> }) {
//   try {
//     console.time("og-image");
//     const post = await getBlogEntry(Object.values(params).join("/"));

//     if (!post) return new Response("NOT FOUND", { status: 404 });
//     const svg = await generateOGImage({
//       title: post.meta.title,
//       description: post.meta.description,
//       // TODO: Replace with link inside repo when it's public.
//       // Our version of the image is optimized for the web annd we won't depend on
//       // external services availability to get it.
//       image: "https://cdn.midjourney.com/178abd2b-a069-4921-9450-fea2b1b1d52b/0_2.png",
//       width: WIDTH,
//       height: HEIGHT,
//     });


//     console.timeEnd("og-image");

//     console.time("resvg");
//     const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render();
//     const png = resvg.asPng();
//     console.timeEnd("resvg");

//     return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } });
//   } catch (e) {
//     console.log(e);
//     return new Response("SOMETHING WENT WRONG", { status: 500 });
//   }
// }

// export async function getStaticPaths() {
//   const posts = await getCollection("blog");
//   return posts.map(post => {
//     const [lang, entrySlug] = post.slug.split("/");
//     return {
//       params: { lang, entrySlug },
//     };
//   });
// }
