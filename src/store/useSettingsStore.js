// src/store/useSettingsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idbStorage } from "../utils/idbStorage";

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      dailyGoal: 10,
      followUpDays: 3,
      secondFollowUpDays: 5,
      theme: "dark",
      userName: "Me",
      notificationsEnabled: true,

      // ── UPDATE ───────────────────────────────────────────────
      updateSettings: (updates) => set((s) => ({ ...s, ...updates })),

      setDailyGoal: (goal) => set({ dailyGoal: Math.max(1, Number(goal)) }),

      toggleNotifications: () =>
        set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),

      // ── SELECTORS ────────────────────────────────────────────
      getSettings: () => ({
        dailyGoal: get().dailyGoal,
        followUpDays: get().followUpDays,
        secondFollowUpDays: get().secondFollowUpDays,
        theme: get().theme,
        userName: get().userName,
        notificationsEnabled: get().notificationsEnabled,
      }),
    }),
    {
      name: "hiretrack-settings",
      storage: idbStorage,
    },
  ),
);
