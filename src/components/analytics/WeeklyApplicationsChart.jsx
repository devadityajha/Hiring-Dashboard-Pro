import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { BarChart2, TrendingUp } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-xs font-semibold text-text">{label}</p>
      <p className="text-xs text-accent mt-0.5">
        {payload[0].value} application{payload[0].value !== 1 ? "s" : ""}
      </p>
      {payload[0].payload.date && (
        <p className="text-2xs text-muted mt-0.5">{payload[0].payload.date}</p>
      )}
    </div>
  );
};

// Build last 30 days for the area chart
function buildMonthlyData(dailyCounts) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    return {
      date: key,
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      applications: dailyCounts[key]?.count ?? 0,
    };
  });
}

export default function WeeklyApplicationsChart({
  data,
  weekTotal,
  dailyCounts,
}) {
  const { dailyGoal } = useSettingsStore();
  const todayKey = new Date().toISOString().split("T")[0];
  const monthlyData = useMemo(
    () => buildMonthlyData(dailyCounts),
    [dailyCounts],
  );
  const bestDay = Math.max(...data.map((d) => d.applications), 0);
  const avgPerDay = weekTotal > 0 ? (weekTotal / 7).toFixed(1) : "0";

  return (
    <div className="glass-card p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-accent" />
          <p className="text-sm font-semibold text-text">Applications Sent</p>
        </div>
        <div className="flex items-center gap-4 text-2xs text-muted">
          <span>
            Avg: <span className="text-text font-medium">{avgPerDay}/day</span>
          </span>
          <span>
            Best:{" "}
            <span className="text-text font-medium">{bestDay} in a day</span>
          </span>
          <span>
            Week: <span className="text-accent font-bold">{weekTotal}</span>
          </span>
        </div>
      </div>

      {/* This week — Bar chart */}
      <div>
        <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-3">
          This Week
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 0, bottom: 0, left: -28 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <ReferenceLine
              y={dailyGoal}
              stroke="#22d3ee"
              strokeDasharray="4 4"
              strokeOpacity={0.35}
              label={{
                value: `Goal ${dailyGoal}`,
                position: "insideTopRight",
                fontSize: 9,
                fill: "#22d3ee",
                opacity: 0.6,
              }}
            />
            <Bar dataKey="applications" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={
                    entry.date === todayKey
                      ? "#22d3ee"
                      : entry.applications >= dailyGoal
                        ? "#10b981"
                        : entry.applications > 0
                          ? "#0e7490"
                          : "#252840"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 text-2xs text-muted">
          <LegendDot color="bg-accent" label="Today" />
          <LegendDot color="bg-success" label="Goal reached" />
          <LegendDot color="bg-accentDim" label="Active" />
          <LegendDot color="bg-border" label="No applications" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 border-t border-dashed border-accent/40" />
            <span>Daily goal</span>
          </div>
        </div>
      </div>

      {/* Last 30 days — Area chart */}
      <div>
        <p className="text-2xs font-medium text-muted uppercase tracking-widest mb-3">
          Last 30 Days
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart
            data={monthlyData}
            margin={{ top: 4, right: 0, bottom: 0, left: -28 }}
          >
            <defs>
              <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#252840"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#22d3ee", strokeWidth: 1, strokeOpacity: 0.3 }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#22d3ee"
              strokeWidth={1.5}
              fill="url(#appGrad)"
              dot={false}
              activeDot={{ r: 3, fill: "#22d3ee", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}
