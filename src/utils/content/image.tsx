import fs from "node:fs";
import path from "node:path";
import satori from "satori";

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
  const imagePath = path.resolve(image);
  console.log({ imagePath });
  const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

  return await satori(
    {
      type: "div",
      props: {
        style: {
          alignItems: "center",
          backgroundImage: `url("data:image/png;base64,${imageData}")`,
          backgroundSize: "cover",
          color: "#1f2937",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: "2rem",
          paddingTop: "2rem",
          position: "relative",
          width,
          height,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                background: "rgba(0,0,0,0.3)",
                bottom: 0,
                display: "block",
                left: 0,
                position: "absolute",
                right: 0,
                top: 0,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                background: "#eff6ff",
                border: "2px solid #60a5fa",
                borderRadius: "0.5rem",
                display: "flex",
                flexFlow: "column",
                margin: "0 auto",
                maxWidth: "768px",
                padding: "3rem",
                position: "relative",
                width: "100%",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: { display: "block", marginBottom: "2rem", fontSize: "1.25rem", color: "#1e293b" },
                    children: [
                      "TaverasMisael ",
                      {
                        type: "span",
                        props: { style: { display: "block", color: "#1e40af", fontWeight: "600" }, children: "Blog" },
                      },
                    ],
                  },
                },
                {
                  type: "h1",
                  props: {
                    style: {
                      display: "block",
                      marginBottom: "1.5rem",
                      fontSize: "3.75rem",
                      lineHeight: 1,
                      fontWeight: "600",
                      color: "#0f172a",
                    },
                    children: title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: { marginBottom: "1.5rem", display: "block" },
                    children: [truncatedDescription, truncatedDescription.length < description.length ? "..." : "."],
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      display: "block",
                    },
                    children: [
                      {
                        type: "span",
                        props: { style: { color: "#475569", marginRight: "4ch" }, children: "Escrito por" },
                      },
                      { type: "strong", props: { style: { fontWeight: "600" }, children: "Misael Taveras" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
};
