// import { useCounterStore } from "../store/useCounterStore";
// import { useRecruiterStore } from "../store/useRecruiterStore";
// import { useInterviewStore } from "../store/useInterviewStore";
// import { LayoutDashboard, Users, Clock, Zap } from "lucide-react";

// import StatsCard from "../components/dashboard/StatsCard";
// import DailyGoalWidget from "../components/dashboard/DailyGoalWidget";
// import StreakTracker from "../components/dashboard/StreakTracker";
// import WeeklyChart from "../components/dashboard/WeeklyChart";
// import InterviewTrackerWidget from "../components/dashboard/InterviewTrackerWidget";
// import WeeklyReviewCard from "../components/dashboard/WeeklyReviewCard";
// import PinnedNotes from "../components/dashboard/PinnedNotes";

// export default function Dashboard() {
//   // ── Store data ──────────────────────────────────────────
//   const { getToday, streak } = useCounterStore();
//   const { recruiters, getFollowUpsDue } = useRecruiterStore();
//   const { getStats } = useInterviewStore();

//   const today = getToday();
//   const iStats = getStats();
//   const followUpsDue = getFollowUpsDue().length;

//   // Recruiters contacted today
//   const todayKey = new Date().toISOString().split("T")[0];
//   const contactedToday = recruiters.filter((r) =>
//     r.dateContacted?.startsWith(todayKey),
//   ).length;

//   return (
//     <div className="space-y-5">
//       {/* ── Page Header ──────────────────────────────────── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <LayoutDashboard size={17} className="text-accent" />
//             <h2 className="page-title">Dashboard</h2>
//           </div>
//           <p className="page-subtitle">
//             {new Date().toLocaleDateString("en-IN", {
//               weekday: "long",
//               day: "numeric",
//               month: "long",
//             })}
//           </p>
//         </div>
//       </div>

//       {/* ── Row 1: Stat Cards ────────────────────────────── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           label="Applications Today"
//           value={today.count}
//           sub={today.count > 0 ? "Keep going!" : "None yet today"}
//           trend={today.count > 0 ? "up" : null}
//           icon={Zap}
//           accent
//         />
//         <StatsCard
//           label="Recruiters Contacted"
//           value={contactedToday}
//           sub="Today"
//           icon={Users}
//         />
//         <StatsCard
//           label="Follow-Ups Due"
//           value={followUpsDue}
//           sub={followUpsDue > 0 ? "Action needed" : "All clear"}
//           trend={followUpsDue > 0 ? "up" : null}
//           icon={Clock}
//         />
//         <StatsCard
//           label="Current Streak"
//           value={`${streak}🔥`}
//           sub={streak > 0 ? "Days active" : "Start today"}
//         />
//       </div>

//       {/* ── Row 2: Goal + Streak + Chart ─────────────────── */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <DailyGoalWidget />
//         <StreakTracker />
//         <WeeklyChart />
//       </div>

//       {/* ── Row 3: Interviews + Weekly Review + Pinned Notes */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <InterviewTrackerWidget />
//         <WeeklyReviewCard />
//         <PinnedNotes />
//       </div>
//     </div>
//   );
// }

import { useCounterStore } from "../store/useCounterStore";
import { useRecruiterStore } from "../store/useRecruiterStore";
import { useInterviewStore } from "../store/useInterviewStore";
import { LayoutDashboard, Users, Clock, Zap } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import DailyGoalWidget from "../components/dashboard/DailyGoalWidget";
import StreakTracker from "../components/dashboard/StreakTracker";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import InterviewTrackerWidget from "../components/dashboard/InterviewTrackerWidget";
import WeeklyReviewCard from "../components/dashboard/WeeklyReviewCard";
import PinnedNotes from "../components/dashboard/PinnedNotes";

export default function Dashboard() {
  const { getToday, streak } = useCounterStore();
  const { recruiters, getFollowUpsDue } = useRecruiterStore();
  const { getStats } = useInterviewStore();

  const today = getToday();
  const iStats = getStats();
  const followUpsDue = getFollowUpsDue().length;

  const todayKey = new Date().toISOString().split("T")[0];
  const contactedToday = recruiters.filter((r) =>
    r.dateContacted?.startsWith(todayKey),
  ).length;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={17} className="text-accent" />
            <h2 className="page-title">Dashboard</h2>
          </div>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          label="Applications Today"
          value={today.count}
          sub={today.count > 0 ? "Keep going!" : "None yet today"}
          trend={today.count > 0 ? "up" : null}
          icon={Zap}
          accent
        />
        <StatsCard
          label="Recruiters Contacted"
          value={contactedToday}
          sub="Today"
          icon={Users}
        />
        <StatsCard
          label="Follow-Ups Due"
          value={followUpsDue}
          sub={followUpsDue > 0 ? "Action needed" : "All clear"}
          trend={followUpsDue > 0 ? "up" : null}
          icon={Clock}
        />
        <StatsCard
          label="Current Streak"
          value={`${streak}🔥`}
          sub={streak > 0 ? "Days active" : "Start today"}
        />
      </div>

      {/* ── Row 2: Goal + Streak + Chart ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <DailyGoalWidget />
        <StreakTracker />
        <WeeklyChart className="md:col-span-2 lg:col-span-1" />
      </div>

      {/* ── Row 3: Interviews + Weekly Review + Pinned Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <InterviewTrackerWidget />
        <WeeklyReviewCard />
        <PinnedNotes />
      </div>
    </div>
  );
}
