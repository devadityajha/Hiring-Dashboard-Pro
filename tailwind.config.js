/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0c0c14",
        surface: "#11111e",
        card: "#16162a",
        border: "#22223a",
        text: "#e8e8f0",
        muted: "#585870",
        accent: "#a78bfa",
        accentDim: "#4c3d8f",
        success: "#34d399",
        danger: "#fb7185",
        warning: "#fbbf24",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      fontSize: { "2xs": ["0.65rem", { lineHeight: "1rem" }] },
    },
  },
  plugins: [],
};
