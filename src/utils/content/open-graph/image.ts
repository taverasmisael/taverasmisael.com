import satori from "satori";
import fs from "node:fs/promises";
import path from "node:path";
import { renderToStringAsync } from "solid-js/web";
import { html as toStringReactElement } from "satori-html";
import ImageTemplate from "./ImageTemplate";

interface ImageGeneratorConfig {
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  writtenTag: string;
}


const loadFonts = async (): Promise<{ display: ArrayBuffer; body: ArrayBuffer; light: ArrayBuffer }> => {

  // The project decided to stop publishing otf files. A kind samaritan uploaded them to a CDN
  // Thinking about hosting them myself, maybe in the future.
  // ISSUE: https://github.com/rsms/inter/issues/631
const font = await fs.readFile(path.join(__dirname, "./fonts/inter.ttf"));
  return { display: font, body: font, light: font };
};

export const generateOGImage = async ({
  title,
  description,
  image,
  width,
  height,
  writtenTag,
}: ImageGeneratorConfig) => {
  const truncatedDescription = description.split(" ").slice(0, 30).join(" ");
  const fonts = await loadFonts();

  const component = await renderToStringAsync(() =>
    ImageTemplate({
      author: "Misael Taveras",
      description:
        truncatedDescription.length < description.length ? `${truncatedDescription}...` : truncatedDescription,
      height: `${height}px`,
      image,
      title,
      width: `${width}px`,
      writtenTag,
    }),
  );

  // This intermediate step is necessary for debugging purposes
  // If you call `toStringReactElement` directly on the satori function
  // and there's something wrong with the html (like you used "display: block" instead of flex)
  // it will throw an uncaught error and the server will crash
  const html = toStringReactElement(component);

  return await satori(html, {
    width,
    height,
    fonts: [
      { name: "Inter", data: fonts.display, style: "normal", weight: 600 },
      { name: "Inter", data: fonts.body, style: "normal", weight: 400 },
      { name: "Inter", data: fonts.light, style: "normal", weight: 300 },
    ],
  });
};
