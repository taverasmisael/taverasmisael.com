import { map, join } from "rambda";
import presetTypography, { theme } from "./uno/typography";
import { defineConfig, presetWind } from "unocss";

export default defineConfig({
  theme: {
    fontFamily: map(join(", "), theme.fontFamily),
    animation: {
      keyframes: { wiggle: "{0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)}}" },
      durations: { wiggle: "2500ms" },
      timingFns: { wiggle: "cubic-bezier(0.46, 0.03, 0.52, 0.96)" },
      counts: { wiggle: "infinite" },
    },
  },
  presets: [presetTypography(), presetWind({ dark: "class" })],
});
