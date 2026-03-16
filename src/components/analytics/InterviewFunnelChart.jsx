import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { CalendarCheck } from "lucide-react";

const STAGE_CONFIG = [
  { key: "Applied", label: "Applied", color: "#22d3ee" },
  { key: "Mailed", label: "Mailed", color: "#38bdf8" },
  { key: "Follow-Up", label: "Follow-Up", color: "#f59e0b" },
  { key: "Interviewing", label: "Interviewing", color: "#a78bfa" },
  { key: "Scheduled", label: "Scheduled", color: "#818cf8" },
  { key: "Completed", label: "Completed", color: "#10b981" },
  { key: "Closed", label: "Closed/Offer", color: "#34d399" },
];

const TYPE_COLORS = {
  HR: "#3b82f6",
  Technical: "#a78bfa",
  "Final Round": "#f97316",
  "System Design": "#ec4899",
  "Culture Fit": "#10b981",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-xs font-semibold text-text">{label}</p>
      <p className="text-xs text-muted mt-0.5">
        {payload[0].value} candidate{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function InterviewFunnelChart({ interviews, iStats }) {
  // Build funnel data by interview type
  const typeData = useMemo(() => {
    const map = {};
    interviews.forEach((iv) => {
      map[iv.type] = (map[iv.type] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [interviews]);

  // Build status breakdown
  const statusData = useMemo(() => {
    const map = {};
    interviews.forEach((iv) => {
      map[iv.status] = (map[iv.status] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [interviews]);

  if (interviews.length === 0) {
    return (
      <div
        className="glass-card p-5 flex flex-col items-center justify-center
                      gap-3 text-center h-full min-h-[280px]"
      >
        <CalendarCheck size={28} className="text-muted/30" />
        <p className="text-sm font-medium text-text">No interviews yet</p>
        <p className="text-xs text-muted max-w-xs">
          Schedule interviews to see your pipeline funnel.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarCheck size={14} className="text-accent" />
        <p className="text-sm font-semibold text-text">Interview Funnel</p>
        <span className="ml-auto text-2xs text-muted">
          {interviews.length} total
        </span>
      </div>

      {/* KPI chips */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Scheduled", value: iStats.scheduled, color: "text-accent" },
          {
            label: "Completed",
            value: iStats.completed,
            color: "text-success",
          },
          {
            label: "This Week",
            value: iStats.thisWeek,
            color: "text-purple-400",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-bg/60 rounded-xl p-2.5 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-2xs text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* By Type — horizontal bar */}
      {typeData.length > 0 && (
        <div>
          <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-3">
            By Interview Type
          </p>
          <ResponsiveContainer width="100%" height={typeData.length * 36 + 20}>
            <BarChart
              data={typeData}
              layout="vertical"
              margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
              barCategoryGap="25%"
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={22}>
                <LabelList
                  dataKey="value"
                  position="right"
                  style={{ fontSize: 11, fill: "#94a3b8" }}
                />
                {typeData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={TYPE_COLORS[entry.name] ?? "#22d3ee"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status breakdown — mini horizontal bars */}
      {statusData.length > 0 && (
        <div>
          <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-3">
            Status Breakdown
          </p>
          <div className="space-y-2">
            {statusData.map(({ name, value }) => {
              const pct = Math.round((value / interviews.length) * 100);
              const colors = {
                Scheduled: "bg-accent",
                Completed: "bg-success",
                Cancelled: "bg-danger",
                Rescheduled: "bg-warning",
              };
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xs text-muted">{name}</span>
                    <span className="text-2xs font-medium text-text">
                      {value} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700
                                  ${colors[name] ?? "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
