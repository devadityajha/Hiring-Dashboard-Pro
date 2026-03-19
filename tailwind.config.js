/** @type {import('tailwindcss').Config} */

// ── PICK ONE THEME — set ACTIVE_THEME to "indigo" | "obsidian" | "cosmic"
const ACTIVE_THEME = "cosmic";

const themes = {
  // ── Option A: Midnight Indigo ─────────────────────────
  indigo: {
    bg: "#0a0b1a", // very deep navy — page background
    surface: "#0f1128", // sidebar / topbar
    card: "#141630", // glass cards
    border: "#1e2145", // dividers and borders
    text: "#e2e4f0", // primary text
    muted: "#5a5f80", // secondary text / icons
    accent: "#7c6af7", // primary CTA — electric violet
    accentDim: "#3d3580", // darker accent for bars
    success: "#22c55e",
    danger: "#f43f5e",
    warning: "#f59e0b",
  },

  // ── Option B: Obsidian ────────────────────────────────
  obsidian: {
    bg: "#080808", // near pure black
    surface: "#0d0d0d", // sidebar / topbar
    card: "#111111", // glass cards
    border: "#1f1f1f", // dividers
    text: "#ededed", // primary text
    muted: "#525252", // secondary text
    accent: "#00d97e", // crisp emerald green
    accentDim: "#005c35", // darker accent
    success: "#00d97e",
    danger: "#ff4d4f",
    warning: "#f59e0b",
  },

  // ── Option C: Cosmic Slate ────────────────────────────
  cosmic: {
    bg: "#0c0c14", // very dark warm slate
    surface: "#11111e", // sidebar / topbar
    card: "#16162a", // glass cards
    border: "#22223a", // dividers
    text: "#e8e8f0", // primary text
    muted: "#585870", // secondary text
    accent: "#a78bfa", // soft violet
    accentDim: "#4c3d8f", // darker violet for bars
    success: "#34d399",
    danger: "#fb7185",
    warning: "#fbbf24",
  },
};

const t = themes[ACTIVE_THEME];

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: t.bg,
        surface: t.surface,
        card: t.card,
        border: t.border,
        text: t.text,
        muted: t.muted,
        accent: t.accent,
        accentDim: t.accentDim,
        success: t.success,
        danger: t.danger,
        warning: t.warning,
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      backgroundImage: {
        // Premium gradient used on sidebar logo area and hero sections
        "gradient-accent": `linear-gradient(135deg, ${t.accent}, ${t.accentDim})`,

        // Subtle noise texture on cards for depth
        "gradient-card": `linear-gradient(145deg, ${t.card}, ${t.bg})`,
      },
    },
  },
  plugins: [],
};
