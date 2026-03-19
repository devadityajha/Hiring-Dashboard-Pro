/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Deep, rich Obsidian/Zinc tones instead of flat purple
        bg: "#050505",
        surface: "#09090b", // Sidebar/base layer
        card: "rgba(24, 24, 27, 0.65)", // Dark glass cards
        overlay: "rgba(0, 0, 0, 0.7)",

        // Borders are now subtle semi-transparent whites
        border: "rgba(255, 255, 255, 0.08)",
        borderHi: "rgba(255, 255, 255, 0.15)",

        // Typography colors
        text: "#f8fafc", // High contrast white
        subtle: "#94a3b8", // Slate for subtitles
        muted: "#64748b", // Darker slate for placeholders

        // Premium Accents (Teal & Indigo)
        accent: "#6366f1", // Indigo
        accentBright: "#818cf8", // Light Indigo
        accentNeon: "#2dd4bf", // Vibrant Teal

        // Status colors (Modern, slightly desaturated neons)
        success: "#34d399",
        danger: "#fb7185",
        warning: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-teal": "0 0 20px rgba(45, 212, 191, 0.3)",
      },
    },
  },
  plugins: [],
};
