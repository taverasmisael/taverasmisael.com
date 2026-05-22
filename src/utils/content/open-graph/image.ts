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
  writtenTag: string;
}

let displayFont: ArrayBuffer | undefined;
let bodyFont: ArrayBuffer | undefined;
let lightFont: ArrayBuffer | undefined;

const loadFonts = async (): Promise<{ display: ArrayBuffer; body: ArrayBuffer; light: ArrayBuffer }> => {
  if (displayFont && bodyFont && lightFont) {
    return { display: displayFont, body: bodyFont, light: lightFont };
  }
  // The project decided to stop publishing otf files. A kind samaritan uploaded them to a CDN
  // Thinking about hosting them myself, maybe in the future.
  // ISSUE: https://github.com/rsms/inter/issues/631
  const displayFontRequest = await fetch("https://www.fontmirror.com/app_public/files/t/1/Inter-SemiBold_5a940f143aafecbf00719f75eea1dd90.otf");
  const bodyFontRequest = await fetch("https://www.fontmirror.com/app_public/files/t/1/Inter-Regular_900a4848c22b68892f850f9b43961571.otf");
  const lightFontRequest = await fetch("https://www.fontmirror.com/app_public/files/t/1/Inter-Italic_d34411fedc6f06b7fb44d8500d4d244a.otf");

  const [display, body, light] = await Promise.all([
    displayFontRequest.arrayBuffer(),
    bodyFontRequest.arrayBuffer(),
    lightFontRequest.arrayBuffer(),
  ]);

  displayFont = display;
  bodyFont = body;
  lightFont = light;
  return { display, body, light };
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
