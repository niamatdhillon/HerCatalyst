import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(15, 23, 42, 0.08)",
        input: "rgba(15, 23, 42, 0.08)",
        ring: "#EC3A7A",
        background: "#FFF7FA",
        foreground: "#0F172A",
        aura: {
          pink: "#EC3A7A",
          lightPink: "#F48FB1",
          orange: "#F15A24",
          blue: "#1E9CD7",
          cream: "#FFF7FA",
        },
        primary: {
          DEFAULT: "#EC3A7A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1E9CD7",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#F48FB1",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;