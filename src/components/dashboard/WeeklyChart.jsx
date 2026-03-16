import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { useCounterStore } from "../../store/useCounterStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-text">{label}</p>
      <p className="text-xs text-accent mt-0.5">
        {payload[0].value} application{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function WeeklyChart() {
  const { getWeeklyData, getToday } = useCounterStore();
  const data = getWeeklyData();
  const today = getToday();
  const todayKey = new Date().toISOString().split("T")[0];
  const totalWeek = data.reduce((s, d) => s + d.applications, 0);

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-accent" />
          <p className="text-xs font-semibold text-text">Weekly Activity</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xs text-muted">Total:</span>
          <span className="text-2xs font-bold text-accent ml-1">
            {totalWeek}
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={150}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, bottom: 0, left: -28 }}
          barCategoryGap="30%"
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
            y={today.goal}
            stroke="#22d3ee"
            strokeDasharray="3 3"
            strokeOpacity={0.3}
          />
          <Bar dataKey="applications" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={
                  entry.date === todayKey
                    ? "#22d3ee"
                    : entry.applications > 0
                      ? "#0e7490"
                      : "#252840"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend row */}
      <div className="flex items-center gap-4 text-2xs text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-accent" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-accentDim" />
          <span>Past days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 border-t border-dashed border-accent/40" />
          <span>Goal line</span>
        </div>
      </div>
    </div>
  );
}
