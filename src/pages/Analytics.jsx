import { useMemo } from "react";
import { BarChart2 } from "lucide-react";
import { useCounterStore } from "../store/useCounterStore";
import { useRecruiterStore } from "../store/useRecruiterStore";
import { useInterviewStore } from "../store/useInterviewStore";
import WeeklyApplicationsChart from "../components/analytics/WeeklyApplicationsChart";
import RecruiterContactsChart from "../components/analytics/RecruiterContactsChart";
import InterviewFunnelChart from "../components/analytics/InterviewFunnelChart";
import PendingFollowUpsPanel from "../components/analytics/PendingFollowUpsPanel";
import AnalyticsSummaryRow from "../components/analytics/AnalyticsSummaryRow";

export default function Analytics() {
  const { getWeeklyData, dailyCounts, streak } = useCounterStore();
  const { recruiters, getFollowUpsDue } = useRecruiterStore();
  const { interviews, getStats } = useInterviewStore();

  const weeklyData = getWeeklyData();
  const iStats = getStats();
  const followUpsDue = getFollowUpsDue();

  // Total applications all-time
  const totalApps = useMemo(
    () => Object.values(dailyCounts).reduce((s, d) => s + (d.count ?? 0), 0),
    [dailyCounts],
  );

  // Total this week
  const weekTotal = weeklyData.reduce((s, d) => s + d.applications, 0);

  // Recruiters contacted this week
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recruitersThisWeek = recruiters.filter(
    (r) => new Date(r.dateContacted).getTime() >= sevenDaysAgo,
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart2 size={17} className="text-accent" />
          <h2 className="page-title">Analytics</h2>
        </div>
        <p className="page-subtitle">
          Weekly performance and job-search momentum overview
        </p>
      </div>

      {/* ── Summary Row ─────────────────────────────────── */}
      <AnalyticsSummaryRow
        totalApps={totalApps}
        weekTotal={weekTotal}
        recruitersThisWeek={recruitersThisWeek}
        followUpsDue={followUpsDue.length}
        streak={streak}
        iStats={iStats}
      />

      {/* ── Row 1: Weekly chart + Recruiter contacts ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <WeeklyApplicationsChart
            data={weeklyData}
            weekTotal={weekTotal}
            dailyCounts={dailyCounts}
          />
        </div>
        <div>
          <RecruiterContactsChart recruiters={recruiters} />
        </div>
      </div>

      {/* ── Row 2: Interview funnel + Follow-ups panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <InterviewFunnelChart interviews={interviews} iStats={iStats} />
        <PendingFollowUpsPanel followUps={followUpsDue} />
      </div>
    </div>
  );
}
