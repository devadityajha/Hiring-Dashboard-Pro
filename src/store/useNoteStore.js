// src/store/useNoteStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { idbStorage } from "../utils/idbStorage";

export const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],

      // ── CREATE ──────────────────────────────────────────────
      addNote: ({ title, content }) => {
        const note = {
          id: uuidv4(),
          title: title?.trim() ?? "Untitled Note",
          content: content?.trim() ?? "",
          pinned: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ notes: [note, ...s.notes] }));
        return note;
      },

      // ── UPDATE ───────────────────────────────────────────────
      updateNote: (id, updates) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        })),

      togglePin: (id) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned } : n,
          ),
        })),

      // ── DELETE ───────────────────────────────────────────────
      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // ── SELECTORS ────────────────────────────────────────────
      getPinnedNotes: () => get().notes.filter((n) => n.pinned),
      getUnpinnedNotes: () => get().notes.filter((n) => !n.pinned),
    }),
    {
      name: "hiretrack-notes",
      storage: idbStorage,
    },
  ),
);
