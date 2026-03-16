import {
  Zap,
  Users,
  Clock,
  Flame,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

const CARDS = (props) => [
  {
    label: "All-time Applications",
    value: props.totalApps,
    sub: `${props.weekTotal} this week`,
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
    trend: props.weekTotal > 0 ? "up" : null,
  },
  {
    label: "Recruiters Contacted",
    value: props.recruitersThisWeek,
    sub: "This week",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Follow-Ups Due",
    value: props.followUpsDue,
    sub: props.followUpsDue > 0 ? "Action needed" : "All clear ✓",
    icon: Clock,
    color: props.followUpsDue > 0 ? "text-warning" : "text-success",
    bg: props.followUpsDue > 0 ? "bg-warning/10" : "bg-success/10",
  },
  {
    label: "Current Streak",
    value: `${props.streak}🔥`,
    sub: props.streak > 0 ? "Days active" : "Start today",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    label: "Interviews Scheduled",
    value: props.iStats.scheduled,
    sub: `${props.iStats.completed} completed`,
    icon: CalendarCheck,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Total Recruiters",
    value: props.iStats.total >= 0 ? undefined : undefined,
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function AnalyticsSummaryRow({
  totalApps,
  weekTotal,
  recruitersThisWeek,
  followUpsDue,
  streak,
  iStats,
}) {
  const cards = [
    {
      label: "All-time Applications",
      value: totalApps,
      sub: `${weekTotal} this week`,
      icon: Zap,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Recruiters This Week",
      value: recruitersThisWeek,
      sub: "New contacts",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Follow-Ups Due",
      value: followUpsDue,
      sub: followUpsDue > 0 ? "Action needed" : "All clear ✓",
      icon: Clock,
      color: followUpsDue > 0 ? "text-warning" : "text-success",
      bg: followUpsDue > 0 ? "bg-warning/10" : "bg-success/10",
    },
    {
      label: "Active Streak",
      value: streak,
      sub: "Days active",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "Interviews Scheduled",
      value: iStats.scheduled,
      sub: `${iStats.completed} completed`,
      icon: CalendarCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Interviews This Week",
      value: iStats.thisWeek,
      sub: "Scheduled or done",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="glass-card px-4 py-3.5 flex flex-col gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center
                           flex-shrink-0 ${bg}`}
          >
            <Icon size={13} className={color} />
          </div>
          <div>
            <p className={`text-2xl font-bold tracking-tight ${color}`}>
              {value ?? "—"}
            </p>
            <p className="text-2xs text-muted mt-0.5 leading-snug">{label}</p>
            {sub && <p className="text-2xs text-muted/60 mt-0.5">{sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
