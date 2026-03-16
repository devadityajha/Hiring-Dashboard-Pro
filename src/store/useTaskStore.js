// src/store/useTaskStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { idbStorage } from "../utils/idbStorage";

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],

      // ── CREATE ──────────────────────────────────────────────
      addTask: (text) => {
        if (!text?.trim()) return;
        const task = {
          id: uuidv4(),
          text: text.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task;
      },

      // ── UPDATE ───────────────────────────────────────────────
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : null,
                }
              : t,
          ),
        })),

      editTask: (id, text) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, text: text.trim() } : t,
          ),
        })),

      // ── DELETE ───────────────────────────────────────────────
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      clearCompleted: () =>
        set((s) => ({ tasks: s.tasks.filter((t) => !t.completed) })),

      // ── SELECTORS ────────────────────────────────────────────
      getActiveTasks: () => get().tasks.filter((t) => !t.completed),
      getCompletedTasks: () => get().tasks.filter((t) => t.completed),
    }),
    {
      name: "hiretrack-tasks",
      storage: idbStorage,
    },
  ),
);
