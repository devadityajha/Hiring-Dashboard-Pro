import {
  TrendingUp,
  Users,
  MessageSquare,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import { useInterviewStore } from "../../store/useInterviewStore";
import { useCounterStore } from "../../store/useCounterStore";

function ReviewRow({ icon: Icon, label, value, color = "text-text" }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2.5 text-muted">
        <Icon size={12} />
        <span className="text-xs">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
    </div>
  );
}

export default function WeeklyReviewCard() {
  const { recruiters, getFollowUpsDue } = useRecruiterStore();
  const { getThisWeek } = useInterviewStore();
  const { getWeeklyData } = useCounterStore();

  const weeklyData = getWeeklyData();
  const totalWeek = weeklyData.reduce((s, d) => s + d.applications, 0);
  const followUpsDue = getFollowUpsDue().length;
  const interviewsThisWeek = getThisWeek().length;

  // Recruiters contacted in the last 7 days
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentRecruiters = recruiters.filter(
    (r) => new Date(r.dateContacted).getTime() >= sevenDaysAgo,
  ).length;

  // Follow-ups sent this week = recruiters with followUpCount > 0 updated this week
  const followUpsSent = recruiters.filter(
    (r) =>
      r.followUpCount > 0 &&
      new Date(r.interactions.at(-1)?.date ?? 0).getTime() >= sevenDaysAgo,
  ).length;

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-accent" />
        <p className="text-xs font-semibold text-text">Weekly Review</p>
      </div>

      {/* Rows */}
      <div>
        <ReviewRow
          icon={TrendingUp}
          label="Applications sent"
          value={totalWeek}
          color="text-accent"
        />
        <ReviewRow
          icon={Users}
          label="Recruiters contacted"
          value={recentRecruiters}
          color="text-text"
        />
        <ReviewRow
          icon={MessageSquare}
          label="Follow-ups sent"
          value={followUpsSent}
          color="text-success"
        />
        <ReviewRow
          icon={CalendarCheck}
          label="Interviews this week"
          value={interviewsThisWeek}
          color="text-purple-400"
        />
        <ReviewRow
          icon={Clock}
          label="Pending follow-ups"
          value={followUpsDue}
          color={followUpsDue > 0 ? "text-warning" : "text-muted"}
        />
      </div>
    </div>
  );
}
