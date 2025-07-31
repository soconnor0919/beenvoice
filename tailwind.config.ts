import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: "media",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        sans: ["var(--font-geist-mono)", "monospace"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        navbar: "var(--navbar)",
        "navbar-foreground": "var(--navbar-foreground)",
        "navbar-border": "var(--navbar-border)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
