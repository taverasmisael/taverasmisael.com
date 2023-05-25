import satori from "satori";
import { renderToStringAsync } from "solid-js/web";
import { html as toStringReactElement } from "satori-html";
import ImageTemplate from "./ImageTemplate";

interface ImageGeneratorConfig {
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
}

export const generateOGImage = async ({ title, description, image, width, height }: ImageGeneratorConfig) => {
  const fontFile = await fetch("https://og-playground.vercel.app/inter-latin-ext-700-normal.woff");
  const fontData: ArrayBuffer = await fontFile.arrayBuffer();
  const truncatedDescription = description.split(" ").slice(0, 25).join(" ");

  const component = await renderToStringAsync(() =>
    ImageTemplate({
      author: "Misael Taveras",
      description:
        truncatedDescription.length < description.length ? `${truncatedDescription}...` : truncatedDescription,
      height: `${height}px`,
      image,
      title,
      width: `${width}px`,
      writtenTag: "Written by",
    })
  );

  // This intermediate step is necessary for debugging purposes
  // If you call `toStringReactElement` directly on the satori function
  // and there's something wrong with the html (like you used "display: block" instead of flex)
  // it will throw an uncaught error and the server will crash
  const html = toStringReactElement(component);

  return await satori(html, {
    width,
    height,
    fonts: [{ name: "Inter", data: fontData, style: "normal" }],
  });
};
