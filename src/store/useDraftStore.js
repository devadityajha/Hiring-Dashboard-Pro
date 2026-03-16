// src/store/useDraftStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { idbStorage } from "../utils/idbStorage";

export const DRAFT_CATEGORIES = [
  "Cold Email",
  "LinkedIn",
  "Follow-Up",
  "Introduction",
];

export const useDraftStore = create(
  persist(
    (set, get) => ({
      drafts: [],

      // ── CREATE ──────────────────────────────────────────────
      addDraft: ({ title, category, content }) => {
        const now = new Date().toISOString();
        const draft = {
          id: uuidv4(),
          title: title?.trim() ?? "Untitled Draft",
          category: category ?? "Cold Email",
          content: content?.trim() ?? "",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ drafts: [draft, ...s.drafts] }));
        return draft;
      },

      // ── UPDATE ───────────────────────────────────────────────
      updateDraft: (id, updates) =>
        set((s) => ({
          drafts: s.drafts.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d,
          ),
        })),

      // ── DELETE ───────────────────────────────────────────────
      deleteDraft: (id) =>
        set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

      // ── SELECTORS ────────────────────────────────────────────
      getDraftsByCategory: (category) =>
        get().drafts.filter((d) => d.category === category),

      getDraftById: (id) => get().drafts.find((d) => d.id === id) ?? null,
    }),
    {
      name: "hiretrack-drafts",
      storage: idbStorage,
    },
  ),
);
