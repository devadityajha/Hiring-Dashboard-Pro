import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent = false,
}) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-danger"
        : "text-muted";

  return (
    <div className="glass-card p-5 flex flex-col gap-3 hover:border-border/80 transition-colors">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted">{label}</p>
        {Icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center
                        ${accent ? "bg-accent/15 text-accent" : "bg-white/5 text-muted"}`}
          >
            <Icon size={13} />
          </div>
        )}
      </div>

      {/* Value */}
      <p
        className={`text-3xl font-bold tracking-tight ${accent ? "text-accent" : "text-text"}`}
      >
        {value ?? "—"}
      </p>

      {/* Sub / trend */}
      {(sub || trend) && (
        <div className={`flex items-center gap-1.5 ${trendColor}`}>
          {trend && <TrendIcon size={11} />}
          <span className="text-2xs">{sub}</span>
        </div>
      )}
    </div>
  );
}
