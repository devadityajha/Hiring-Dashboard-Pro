import { Flame } from "lucide-react";
import { useStreakTracker } from "../../hooks/useStreakTracker";

export default function StreakTracker() {
  const { streak, dots, streakAtRisk } = useStreakTracker();

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame
            size={14}
            className={streak > 0 ? "text-orange-400" : "text-muted"}
          />
          <p className="text-xs font-semibold text-text">Streak</p>
        </div>
        {streakAtRisk && (
          <span className="text-2xs text-warning bg-warning/10 px-2 py-0.5 rounded-full">
            At risk!
          </span>
        )}
      </div>

      {/* Streak number */}
      <div className="flex items-end gap-1.5">
        <span
          className={`text-4xl font-bold tracking-tight
                          ${streak > 0 ? "text-orange-400" : "text-muted"}`}
        >
          {streak}
        </span>
        <span className="text-sm text-muted mb-1">days</span>
      </div>

      {/* 14-day dot grid */}
      <div className="flex flex-col gap-1.5">
        <p className="text-2xs text-muted">Last 14 days</p>
        <div className="flex gap-1.5 flex-wrap">
          {dots.map((dot) => (
            <div
              key={dot.key}
              title={`${dot.key}: ${dot.count} applications`}
              className={`w-5 h-5 rounded-md transition-all
                ${
                  dot.isToday
                    ? dot.active
                      ? "bg-orange-400 ring-2 ring-orange-400/40"
                      : "bg-border ring-2 ring-accent/30"
                    : dot.active
                      ? "bg-orange-400/70"
                      : "bg-border"
                }`}
            />
          ))}
        </div>
      </div>

      <p className="text-2xs text-muted">
        {streak === 0
          ? "Send an application to start your streak"
          : streakAtRisk
            ? "Send an application today to keep your streak!"
            : "Keep it up — send at least one application daily"}
      </p>
    </div>
  );
}
