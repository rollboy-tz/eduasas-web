import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Hatutaki kurudia rangi hapa kwa sababu ziko kwenye globals.css
      // Tailwind v4 itazisoma kiotomatiki kutoka kwenye @theme block
    },
  },
  plugins: [],
};

export default config;