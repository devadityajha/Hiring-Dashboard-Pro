import { useCounterStore } from "../store/useCounterStore";

export function useStreakTracker() {
  const { streak, dailyCounts, lastActiveDate } = useCounterStore();

  // Build last 14 days as dot indicators
  const dots = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().split("T")[0];
    const count = dailyCounts[key]?.count ?? 0;
    const isToday = i === 13;
    return { key, count, active: count > 0, isToday };
  });

  const todayKey = new Date().toISOString().split("T")[0];
  const sentTodayAlready = (dailyCounts[todayKey]?.count ?? 0) > 0;
  const streakAtRisk =
    !sentTodayAlready && lastActiveDate !== todayKey && streak > 0;

  return { streak, dots, streakAtRisk, sentTodayAlready };
}
