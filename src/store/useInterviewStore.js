// src/store/useInterviewStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { idbStorage } from "../utils/idbStorage";

export const INTERVIEW_TYPES = [
  "HR",
  "Technical",
  "Final Round",
  "System Design",
  "Culture Fit",
];
export const INTERVIEW_STATUSES = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "Rescheduled",
];

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      interviews: [],

      // ── CREATE ──────────────────────────────────────────────
      addInterview: (data) => {
        const interview = {
          id: uuidv4(),
          recruiterId: data.recruiterId ?? null,
          company: data.company ?? "",
          recruiterName: data.recruiterName ?? "",
          date: data.date ?? null,
          type: data.type ?? "HR",
          status: data.status ?? "Scheduled",
          notes: data.notes ?? "",
          reminderSet: data.reminderSet ?? false,
          // reminderTime defaults to 1 hour before interview
          reminderTime:
            data.reminderTime ??
            (data.date
              ? new Date(new Date(data.date).getTime() - 3600000).toISOString()
              : null),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ interviews: [interview, ...s.interviews] }));
        return interview;
      },

      // ── UPDATE ───────────────────────────────────────────────
      updateInterview: (id, updates) =>
        set((s) => ({
          interviews: s.interviews.map((iv) =>
            iv.id === id ? { ...iv, ...updates } : iv,
          ),
        })),

      markCompleted: (id) =>
        set((s) => ({
          interviews: s.interviews.map((iv) =>
            iv.id === id ? { ...iv, status: "Completed" } : iv,
          ),
        })),

      setReminder: (id, reminderTime) =>
        set((s) => ({
          interviews: s.interviews.map((iv) =>
            iv.id === id ? { ...iv, reminderSet: true, reminderTime } : iv,
          ),
        })),

      // ── DELETE ───────────────────────────────────────────────
      deleteInterview: (id) =>
        set((s) => ({ interviews: s.interviews.filter((iv) => iv.id !== id) })),

      // ── SELECTORS ────────────────────────────────────────────
      getUpcoming: () => {
        const now = Date.now();
        return get()
          .interviews.filter(
            (iv) =>
              iv.status === "Scheduled" && new Date(iv.date).getTime() > now,
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      },

      getThisWeek: () => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return get().interviews.filter((iv) => {
          const d = new Date(iv.date);
          return d >= startOfWeek && d < endOfWeek;
        });
      },

      getStats: () => {
        const interviews = get().interviews;
        return {
          total: interviews.length,
          scheduled: interviews.filter((iv) => iv.status === "Scheduled")
            .length,
          completed: interviews.filter((iv) => iv.status === "Completed")
            .length,
          thisWeek: get().getThisWeek().length,
        };
      },
    }),
    {
      name: "hiretrack-interviews",
      storage: idbStorage,
    },
  ),
);
