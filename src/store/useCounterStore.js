// src/store/useCounterStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idbStorage } from "../utils/idbStorage";

const todayKey = () => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

const buildEmptyDay = (goal) => ({ count: 0, goal });

export const useCounterStore = create(
  persist(
    (set, get) => ({
      // { "2026-03-16": { count: 7, goal: 10 }, ... }
      dailyCounts: {},
      // streak is tracked separately as a single number + last active date
      streak: 0,
      lastActiveDate: null,

      // ── INCREMENT ────────────────────────────────────────────
      increment: () => {
        const key = todayKey();
        const { dailyCounts, streak, lastActiveDate } = get();
        const today = dailyCounts[key] ?? buildEmptyDay(get().getGoal());

        // Streak logic
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split("T")[0];

        let newStreak = streak;
        if (lastActiveDate === null || lastActiveDate === yesterdayKey) {
          // Continuing streak or first ever entry
          if (lastActiveDate !== key) newStreak = streak + 1;
        } else if (lastActiveDate !== key) {
          // Streak broken
          newStreak = 1;
        }

        set({
          dailyCounts: {
            ...dailyCounts,
            [key]: { ...today, count: today.count + 1 },
          },
          streak: newStreak,
          lastActiveDate: key,
        });
      },

      // ── SET MANUALLY ─────────────────────────────────────────
      setCount: (n) => {
        const key = todayKey();
        const { dailyCounts } = get();
        const today = dailyCounts[key] ?? buildEmptyDay(get().getGoal());
        set({
          dailyCounts: {
            ...dailyCounts,
            [key]: { ...today, count: Math.max(0, Number(n)) },
          },
          lastActiveDate: key,
        });
      },

      // ── GOAL ─────────────────────────────────────────────────
      setGoal: (goal) => {
        const key = todayKey();
        const { dailyCounts } = get();
        const today = dailyCounts[key] ?? buildEmptyDay(goal);
        set({
          dailyCounts: {
            ...dailyCounts,
            [key]: { ...today, goal: Math.max(1, Number(goal)) },
          },
        });
      },

      // ── SELECTORS ────────────────────────────────────────────
      getToday: () => {
        const key = todayKey();
        return get().dailyCounts[key] ?? buildEmptyDay(10);
      },

      getGoal: () => {
        const key = todayKey();
        return get().dailyCounts[key]?.goal ?? 10;
      },

      // Returns last 7 days as [{ day: "Mon", applications: 5 }, ...]
      getWeeklyData: () => {
        const { dailyCounts } = get();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const key = d.toISOString().split("T")[0];
          return {
            day: days[d.getDay()],
            date: key,
            applications: dailyCounts[key]?.count ?? 0,
          };
        });
      },
    }),
    {
      name: "hiretrack-counter",
      storage: idbStorage,
    },
  ),
);
