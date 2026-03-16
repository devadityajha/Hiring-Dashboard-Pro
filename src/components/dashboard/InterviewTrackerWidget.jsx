import { CalendarCheck, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../../store/useInterviewStore";

const TYPE_COLORS = {
  HR: "bg-blue-500/15 text-blue-400",
  Technical: "bg-purple-500/15 text-purple-400",
  "Final Round": "bg-orange-500/15 text-orange-400",
  "System Design": "bg-pink-500/15 text-pink-400",
  "Culture Fit": "bg-green-500/15 text-green-400",
};

function UpcomingRow({ iv }) {
  const date = new Date(iv.date);
  const daysUntil = Math.ceil((date - Date.now()) / 86400000);
  const urgent = daysUntil <= 1;

  return (
    <div
      className={`flex items-center justify-between py-2.5 border-b border-border/50 last:border-0
                     ${urgent ? "border-l-2 border-l-warning pl-2 -ml-2" : ""}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                        ${urgent ? "bg-warning" : "bg-accent"}`}
        />
        <div className="min-w-0">
          <p className="text-xs font-medium text-text truncate">{iv.company}</p>
          <p className="text-2xs text-muted">
            {date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
            {" · "}
            {date.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-2xs px-2 py-0.5 rounded-full font-medium
                          ${TYPE_COLORS[iv.type] ?? "bg-white/5 text-muted"}`}
        >
          {iv.type}
        </span>
        {urgent && (
          <span className="text-2xs text-warning bg-warning/10 px-1.5 py-0.5 rounded-full">
            {daysUntil === 0 ? "Today!" : "Tomorrow"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function InterviewTrackerWidget() {
  const navigate = useNavigate();
  const { getStats, getUpcoming } = useInterviewStore();
  const stats = getStats();
  const upcoming = getUpcoming().slice(0, 3);

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck size={14} className="text-accent" />
          <p className="text-xs font-semibold text-text">Interviews</p>
        </div>
        <button
          onClick={() => navigate("/interviews")}
          className="flex items-center gap-0.5 text-2xs text-muted hover:text-accent transition-colors"
        >
          View all <ChevronRight size={11} />
        </button>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg/60 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-accent">{stats.scheduled}</p>
          <p className="text-2xs text-muted mt-0.5">Scheduled</p>
        </div>
        <div className="bg-bg/60 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-success">{stats.completed}</p>
          <p className="text-2xs text-muted mt-0.5">Completed</p>
        </div>
        <div className="bg-bg/60 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-text">{stats.thisWeek}</p>
          <p className="text-2xs text-muted mt-0.5">This Week</p>
        </div>
      </div>

      {/* Upcoming list */}
      <div>
        <p className="text-2xs font-medium text-muted mb-2 flex items-center gap-1.5">
          <Clock size={10} /> Upcoming
        </p>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center py-4 gap-1">
            <CheckCircle2 size={20} className="text-muted/40" />
            <p className="text-2xs text-muted">No upcoming interviews</p>
            <button
              onClick={() => navigate("/interviews")}
              className="text-2xs text-accent hover:underline mt-1"
            >
              Schedule one →
            </button>
          </div>
        ) : (
          <div>
            {upcoming.map((iv) => (
              <UpcomingRow key={iv.id} iv={iv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
