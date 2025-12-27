import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d9488",
          dark: "#0f766e",
          light: "#14b8a6",
        },
        secondary: {
          DEFAULT: "#f97316",
          dark: "#ea580c",
        },
        dark: "#0f172a",
        light: "#f1f5f9",
      },
    },
  },
  plugins: [],
};

export default config;

