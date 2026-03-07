import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#e5e7eb",
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#e5e7eb"
        },
        secondary: {
          DEFAULT: "#0f172a",
          foreground: "#9ca3af"
        },
        accent: {
          DEFAULT: "#38bdf8",
          foreground: "#0f172a"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(15, 23, 42, 0.8)"
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(circle at top, rgba(37, 99, 235, 0.35), transparent 60%)",
        "gradient-saas":
          "linear-gradient(135deg, #0f172a, #020617 50%, #000000 100%)"
      }
    }
  },
  plugins: []
};

export default config;
