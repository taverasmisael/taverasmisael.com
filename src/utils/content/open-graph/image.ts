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

let displayFont: ArrayBuffer | undefined;
let bodyFont: ArrayBuffer | undefined;
let lightFont: ArrayBuffer | undefined;

const loadFonts = async (): Promise<{ display: ArrayBuffer; body: ArrayBuffer; light: ArrayBuffer }> => {
  if (displayFont && bodyFont && lightFont) {
    console.log("Fonts already loaded");
    return { display: displayFont, body: bodyFont, light: lightFont };
  }
  console.log("Loading fonts");
  const displayFontRequest = await fetch("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.otf");
  const bodyFontRequest = await fetch("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.otf");
  const lightFontRequest = await fetch("https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Light.otf");

  const [display, body, light] = await Promise.all([
    displayFontRequest.arrayBuffer(),
    bodyFontRequest.arrayBuffer(),
    lightFontRequest.arrayBuffer(),
  ]);

  displayFont = display;
  bodyFont = body;
  return { display, body, light };
};

export const generateOGImage = async ({ title, description, image, width, height }: ImageGeneratorConfig) => {
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
    fonts: [
      { name: "Inter", data: fonts.display, style: "normal", weight: 600 },
      { name: "Inter", data: fonts.body, style: "normal", weight: 400 },
      { name: "Inter", data: fonts.light, style: "normal", weight: 300 },
    ],
  });
};
