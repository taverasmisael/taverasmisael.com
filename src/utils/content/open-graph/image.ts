import satori from "satori";
import fs from "node:fs/promises";
import { renderToStringAsync } from "solid-js/web";
import { html as toStringReactElement } from "satori-html";
import ImageTemplate from "./ImageTemplate";

declare const __OG_FONT_DISPLAY_PATH__: string;
declare const __OG_FONT_BODY_PATH__: string;
declare const __OG_FONT_LIGHT_PATH__: string;

interface ImageGeneratorConfig {
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  writtenTag: string;
}

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const loadFonts = async (): Promise<{ display: ArrayBuffer; body: ArrayBuffer; light: ArrayBuffer }> => {
  const [display, body, light] = await Promise.all([
    fs.readFile(__OG_FONT_DISPLAY_PATH__),
    fs.readFile(__OG_FONT_BODY_PATH__),
    fs.readFile(__OG_FONT_LIGHT_PATH__),
  ]);

  return {
    display: toArrayBuffer(display),
    body: toArrayBuffer(body),
    light: toArrayBuffer(light),
  };
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
