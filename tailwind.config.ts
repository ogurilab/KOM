/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter var", "sans-serif"],
        sans: ["Inter var", "sans-serif"],
      },
      animation: {
        spinner: "spinner 2s linear infinite",
        "spinner-child": "spinner-child 1.5s linear infinite",
      },
      keyframes: {
        spinner: {
          "100%": { transform: "rotate(360deg)" },
        },
        "spinner-child": {
          "0%": {
            "stroke-dasharray": "0 150",
            "stroke-dashoffset": "0",
          },
          "47.5%": { "stroke-dasharray": "42 150", "stroke-dashoffset": "-16" },
          "95%,100%": {
            "stroke-dasharray": "42 150",
            "stroke-dashoffset": "-59",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
