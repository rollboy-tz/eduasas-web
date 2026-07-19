import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {

    container: {
      center: true,

      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },

      screens: {
        "2xl": "1440px",
      },
    },

    extend: {

      /* ======================================================
         COLORS
      ====================================================== */

      colors: {

        /* CORE */

        background: "var(--color-background)",
        foreground: "var(--color-foreground)",

        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",

        /* PRIMARY */

        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },

        /* SECONDARY */

        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },

        /* CARD */

        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },

        /* POPOVER */

        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },

        /* MUTED */

        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },

        /* ACCENT */

        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },

        /* STATUS */

        success: "var(--color-success)",
        warning: "var(--color-warning)",
        destructive: "var(--color-destructive)",
        info: "var(--color-info)",

        /* TABLE */

        table: {
          header: "var(--color-table-header)",
          hover: "var(--color-table-row-hover)",
        },

        /* SIDEBAR */

        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          hover: "var(--color-sidebar-hover)",
          active: "var(--color-sidebar-active)",
        },

        /* CHARTS */

        chart: {
          1: "var(--color-chart-1)",
          2: "var(--color-chart-2)",
          3: "var(--color-chart-3)",
          4: "var(--color-chart-4)",
          5: "var(--color-chart-5)",
          6: "var(--color-chart-6)",
        },
      },

      /* ======================================================
         BORDER RADIUS
      ====================================================== */

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      /* ======================================================
         SHADOWS
      ====================================================== */

      boxShadow: {

        xs: "var(--shadow-xs)",

        sm: "var(--shadow-sm)",

        md: "var(--shadow-md)",

        lg: "var(--shadow-lg)",

        card: "var(--shadow-sm)",

        dropdown: "var(--shadow-md)",

        modal: "var(--shadow-lg)",

        glow: `
          0 0 0 1px rgba(255,255,255,0.04),
          0 10px 30px rgba(0,0,0,0.12)
        `,

        neon: `
          0 0 12px color-mix(
            in srgb,
            var(--color-primary) 35%,
            transparent
          )
        `,
      },

      /* ======================================================
         ANIMATIONS
      ====================================================== */

      keyframes: {

        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },

        rotate: {
          "100%": {
            transform: "rotate(360deg)",
          },
        },

        accordionDown: {
          from: {
            height: "0",
          },

          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },

        accordionUp: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },

          to: {
            height: "0",
          },
        },
      },

      animation: {

        shimmer: "shimmer 1.5s linear infinite",

        rotate: "rotate 2s linear infinite",

        "accordion-down":
          "accordionDown 0.2s ease-out",

        "accordion-up":
          "accordionUp 0.2s ease-out",
      },

      /* ======================================================
         BACKDROP BLUR
      ====================================================== */

      backdropBlur: {
        xs: "2px",
      },

      /* ======================================================
         TYPOGRAPHY
      ====================================================== */

      fontSize: {

        xs: ["12px", "16px"],

        sm: ["14px", "20px"],

        base: ["16px", "24px"],

        lg: ["18px", "28px"],

        xl: ["20px", "30px"],

        "2xl": ["24px", "34px"],

        "3xl": ["30px", "40px"],
      },

      /* ======================================================
         SPACING
      ====================================================== */

      spacing: {

        18: "4.5rem",

        22: "5.5rem",

        26: "6.5rem",

        30: "7.5rem",
      },

      /* ======================================================
         TRANSITIONS
      ====================================================== */

      transitionTimingFunction: {

        smooth:
          "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      transitionDuration: {

        250: "250ms",

        400: "400ms",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;