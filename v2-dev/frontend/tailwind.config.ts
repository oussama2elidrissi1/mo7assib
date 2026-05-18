import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#edf4ff",
          100: "#d8e8ff",
          200: "#b6d2ff",
          300: "#7fb1ff",
          400: "#3f88f4",
          500: "#1263d8",
          600: "#0d4fb0",
          700: "#0b408d",
          800: "#082d63",
          900: "#061a33",
        },
        accent: {
          400: "#ffd84e",
          500: "#ffc400",
          600: "#e0aa00",
        },
        surface: "#f5f7fb",
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 60px -36px rgba(6, 26, 51, 0.45)",
      },
      backgroundImage: {
        "site-grid": "radial-gradient(circle at 1px 1px, rgba(18,99,216,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
