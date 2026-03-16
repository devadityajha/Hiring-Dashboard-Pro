import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

const STATUS_COLORS = {
  Mailed: "#22d3ee",
  "Follow-Up": "#f59e0b",
  Interviewing: "#a78bfa",
  "No Response": "#64748b",
  Applied: "#10b981",
  Closed: "#ef4444",
};

const CONFIDENCE_COLORS = {
  "Hot Lead": "#ef4444",
  "Warm Lead": "#f97316",
  "Cold Lead": "#3b82f6",
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-xs font-semibold text-text">{name}</p>
      <p className="text-xs text-muted mt-0.5">
        {value} recruiter{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
    {payload.map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-2xs text-muted">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function RecruiterContactsChart({ recruiters }) {
  // Build status distribution
  const statusData = useMemo(() => {
    const map = {};
    recruiters.forEach((r) => {
      map[r.status] = (map[r.status] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [recruiters]);

  // Build confidence distribution
  const confidenceData = useMemo(() => {
    const map = {};
    recruiters.forEach((r) => {
      map[r.confidence] = (map[r.confidence] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [recruiters]);

  if (recruiters.length === 0) {
    return (
      <div
        className="glass-card p-5 h-full flex flex-col items-center
                      justify-center gap-3 text-center"
      >
        <Users size={28} className="text-muted/30" />
        <p className="text-sm font-medium text-text">No recruiters yet</p>
        <p className="text-xs text-muted">
          Add recruiters to see contact distribution
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users size={14} className="text-accent" />
        <p className="text-sm font-semibold text-text">Recruiter Contacts</p>
        <span className="ml-auto text-2xs text-muted">
          {recruiters.length} total
        </span>
      </div>

      {/* Status Pie */}
      <div>
        <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-2">
          By Status
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="45%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
            >
              {statusData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name] ?? "#64748b"}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence bar rows */}
      <div>
        <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-3">
          By Confidence
        </p>
        <div className="space-y-2.5">
          {confidenceData.map(({ name, value }) => {
            const pct = Math.round((value / recruiters.length) * 100);
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
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: CONFIDENCE_COLORS[name] ?? "#64748b",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
