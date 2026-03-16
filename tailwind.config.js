/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0d0f1a",
        surface: "#13162a",
        card: "#1a1d2e",
        border: "#252840",
        accent: "#22d3ee",
        accentHover: "#67e8f9",
        accentDim: "#0e7490",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        text: "#e2e8f0",
        muted: "#64748b",
        subtle: "#334155",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.65rem",
      },
    },
  },
  plugins: [],
};
