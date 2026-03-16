import { useState } from "react";
import {
  Building2,
  User,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Pencil,
  Trash2,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  AlignLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useInterviewStore } from "../../store/useInterviewStore";

const TYPE_COLORS = {
  HR: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Technical: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Final Round": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "System Design": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Culture Fit": "bg-green-500/15 text-green-400 border-green-500/25",
};

const STATUS_CONFIG = {
  Scheduled: { color: "text-accent", bg: "bg-accent/10", dot: "bg-accent" },
  Completed: { color: "text-success", bg: "bg-success/10", dot: "bg-success" },
  Cancelled: { color: "text-danger", bg: "bg-danger/10", dot: "bg-danger" },
  Rescheduled: {
    color: "text-warning",
    bg: "bg-warning/10",
    dot: "bg-warning",
  },
};

export default function InterviewCard({ interview: iv, onEdit }) {
  const { markCompleted, updateInterview, deleteInterview, setReminder } =
    useInterviewStore();

  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const typeColors =
    TYPE_COLORS[iv.type] ?? "bg-white/5 text-muted border-border";
  const statusCfg = STATUS_CONFIG[iv.status] ?? STATUS_CONFIG["Scheduled"];

  const date = new Date(iv.date);
  const now = Date.now();
  const isPast = date.getTime() < now;
  const isScheduled = iv.status === "Scheduled";
  const daysUntil = Math.ceil((date - now) / 86400000);
  const hoursUntil = Math.ceil((date - now) / 3600000);
  const urgent = isScheduled && hoursUntil <= 24 && hoursUntil > 0;
  const overdue = isScheduled && isPast;

  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeUntilLabel = overdue
    ? "Interview date passed"
    : hoursUntil <= 1
      ? "In less than 1 hour!"
      : hoursUntil <= 24
        ? `In ${hoursUntil} hours`
        : daysUntil === 1
          ? "Tomorrow"
          : isScheduled
            ? `In ${daysUntil} days`
            : null;

  // ── Actions ─────────────────────────────────────────────
  const handleComplete = () => {
    markCompleted(iv.id);
    toast.success("Interview marked as completed ✓");
  };

  const handleCancel = () => {
    updateInterview(iv.id, { status: "Cancelled" });
    toast("Interview cancelled", { icon: "❌" });
  };

  const handleReschedule = () => {
    updateInterview(iv.id, { status: "Rescheduled" });
    toast("Marked as rescheduled", { icon: "🔄" });
  };

  const handleToggleReminder = () => {
    if (iv.reminderSet) {
      updateInterview(iv.id, { reminderSet: false });
      toast("Reminder removed");
    } else {
      const reminderTime = new Date(date.getTime() - 3600000).toISOString();
      setReminder(iv.id, reminderTime);
      toast.success("Reminder set for 1 hour before ✓");
    }
  };

  const handleDelete = () => {
    if (!confirmDel) {
      setConfirmDel(true);
      return;
    }
    deleteInterview(iv.id);
    toast.success("Interview removed");
  };

  return (
    <div
      className={`glass-card flex flex-col overflow-hidden group transition-all duration-150
                  hover:border-border/80
                  ${urgent ? "border-l-2 border-l-warning" : ""}
                  ${overdue ? "border-l-2 border-l-danger/60 opacity-80" : ""}`}
    >
      {/* ── Card Header ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                             flex-shrink-0 text-sm font-bold
                             ${statusCfg.bg} ${statusCfg.color}`}
            >
              {iv.company?.[0]?.toUpperCase() ?? "?"}
            </div>

            <div className="min-w-0">
              {/* Company + type badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-text">{iv.company}</p>
                <span
                  className={`text-2xs px-2 py-0.5 rounded-full border font-medium
                                  ${typeColors}`}
                >
                  {iv.type}
                </span>
              </div>

              {/* Recruiter name */}
              {iv.recruiterName && (
                <div className="flex items-center gap-1 mt-0.5">
                  <User size={9} className="text-muted" />
                  <span className="text-2xs text-muted">
                    {iv.recruiterName}
                  </span>
                </div>
              )}

              {/* Status badge */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusCfg.dot}`}
                />
                <span className={`text-2xs font-medium ${statusCfg.color}`}>
                  {iv.status}
                </span>
                {timeUntilLabel && (
                  <span
                    className={`text-2xs ml-1 font-medium
                                    ${urgent ? "text-warning" : overdue ? "text-danger" : "text-muted"}`}
                  >
                    · {timeUntilLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div
            className="flex items-center gap-1 flex-shrink-0
                          opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {/* Reminder toggle */}
            {isScheduled && (
              <button
                onClick={handleToggleReminder}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
                            ${
                              iv.reminderSet
                                ? "text-accent bg-accent/10 hover:bg-accent/20"
                                : "text-muted hover:text-accent hover:bg-accent/10"
                            }`}
                title={iv.reminderSet ? "Remove reminder" : "Set reminder"}
              >
                {iv.reminderSet ? <Bell size={12} /> : <BellOff size={12} />}
              </button>
            )}

            {/* Edit */}
            <button
              onClick={() => onEdit(iv)}
              className="w-7 h-7 flex items-center justify-center rounded-md
                         text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              title="Edit interview"
            >
              <Pencil size={12} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              onBlur={() => setConfirmDel(false)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
                          ${
                            confirmDel
                              ? "bg-danger/10 text-danger"
                              : "text-muted hover:text-danger hover:bg-danger/10"
                          }`}
              title={confirmDel ? "Click again to confirm" : "Delete"}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Date + Time row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-2xs text-muted">
            <CalendarDays size={10} />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-2xs text-muted">
            <Clock size={10} />
            <span>{timeLabel}</span>
          </div>
          {iv.reminderSet && isScheduled && (
            <div className="flex items-center gap-1 text-2xs text-accent">
              <Bell size={9} />
              <span>Reminder set</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Notes section (expandable) ────────────────────── */}
      {iv.notes && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 border-t border-border
                       text-2xs text-muted hover:text-accent hover:bg-white/5
                       transition-colors w-full"
          >
            <AlignLeft size={10} />
            {expanded ? (
              <>
                <ChevronUp size={10} /> Hide prep notes
              </>
            ) : (
              <>
                <ChevronDown size={10} /> View prep notes
              </>
            )}
          </button>

          {expanded && (
            <div className="px-4 pb-3 border-t border-border">
              <div className="mt-3 bg-bg/50 rounded-xl p-3 border border-border/50">
                <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">
                  {iv.notes}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Action Footer ─────────────────────────────────── */}
      {isScheduled && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <button
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5
                       bg-success/10 hover:bg-success/20 text-success text-xs
                       font-medium rounded-lg transition-colors"
          >
            <CheckCircle2 size={12} /> Mark Completed
          </button>
          <button
            onClick={handleReschedule}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5
                       bg-warning/10 hover:bg-warning/20 text-warning text-xs
                       font-medium rounded-lg transition-colors"
          >
            <RotateCcw size={11} /> Reschedule
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5
                       bg-danger/10 hover:bg-danger/20 text-danger text-xs
                       font-medium rounded-lg transition-colors"
          >
            <XCircle size={11} /> Cancel
          </button>
        </div>
      )}

      {/* Completed / Cancelled state footer */}
      {!isScheduled && (
        <div className="px-4 py-3 border-t border-border">
          <div
            className={`flex items-center justify-center gap-2 py-1 rounded-lg
                           text-xs font-medium
                           ${
                             iv.status === "Completed"
                               ? "text-success bg-success/5"
                               : iv.status === "Cancelled"
                                 ? "text-danger bg-danger/5"
                                 : "text-warning bg-warning/5"
                           }`}
          >
            {iv.status === "Completed" && (
              <>
                <CheckCircle2 size={12} /> Completed
              </>
            )}
            {iv.status === "Cancelled" && (
              <>
                <XCircle size={12} /> Cancelled
              </>
            )}
            {iv.status === "Rescheduled" && (
              <>
                <RotateCcw size={12} /> Rescheduled — update date via edit
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
