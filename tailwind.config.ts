import type { Config } from "tailwindcss";

const semanticScale = (name: string, hsl = false) => ({
  50: `${hsl ? "hsl(" : ""}var(--${name}-1)${hsl ? ")" : ""}`,
  100: `${hsl ? "hsl(" : ""}var(--${name}-2)${hsl ? ")" : ""}`,
  200: `${hsl ? "hsl(" : ""}var(--${name}-3)${hsl ? ")" : ""}`,
  300: `${hsl ? "hsl(" : ""}var(--${name}-4)${hsl ? ")" : ""}`,
  400: `${hsl ? "hsl(" : ""}var(--${name}-5)${hsl ? ")" : ""}`,
  500: `${hsl ? "hsl(" : ""}var(--${name}-6)${hsl ? ")" : ""}`,
  600: `${hsl ? "hsl(" : ""}var(--${name}-7)${hsl ? ")" : ""}`,
  700: `${hsl ? "hsl(" : ""}var(--${name}-8)${hsl ? ")" : ""}`,
  800: `${hsl ? "hsl(" : ""}var(--${name}-9)${hsl ? ")" : ""}`,
  900: `${hsl ? "hsl(" : ""}var(--${name}-10)${hsl ? ")" : ""}`,
  950: `${hsl ? "hsl(" : ""}var(--${name}-11)${hsl ? ")" : ""}`,
});

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: semanticScale("primary"),
        neutral: semanticScale("neutral", true),
        success: semanticScale("success"),
        warning: semanticScale("warning"),
        danger: semanticScale("danger"),
        info: semanticScale("info"),
      }
    },
  },
  plugins: [],
};

export default config;