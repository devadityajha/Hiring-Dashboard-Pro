import { useState, useMemo } from "react";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useInterviewStore } from "../../store/useInterviewStore";
import { useReminder } from "../../hooks/useReminder";
import InterviewForm from "./InterviewForm";
import InterviewCard from "./InterviewCard";

const STATUS_FILTERS = [
  "All",
  "Scheduled",
  "Completed",
  "Cancelled",
  "Rescheduled",
];
const TYPE_FILTERS = [
  "All",
  "HR",
  "Technical",
  "Final Round",
  "System Design",
  "Culture Fit",
];

const STAT_CARDS = (stats) => [
  {
    label: "Scheduled",
    value: stats.scheduled,
    icon: Clock,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Completed",
    value: stats.completed,
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "This Week",
    value: stats.thisWeek,
    icon: CalendarCheck,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Total",
    value: stats.total,
    icon: XCircle,
    color: "text-muted",
    bg: "bg-white/5",
  },
];

export default function InterviewList({ onAdd }) {
  const { interviews, getStats, getUpcoming } = useInterviewStore();

  // Wire in-app reminders
  useReminder(interviews);

  const stats = getStats();
  const upcoming = getUpcoming();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [typeFilter, setType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Filter + search
  const filtered = useMemo(() => {
    let list = [...interviews];

    if (statusFilter !== "All")
      list = list.filter((iv) => iv.status === statusFilter);
    if (typeFilter !== "All")
      list = list.filter((iv) => iv.type === typeFilter);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (iv) =>
          iv.company?.toLowerCase().includes(q) ||
          iv.recruiterName?.toLowerCase().includes(q) ||
          iv.type?.toLowerCase().includes(q) ||
          iv.notes?.toLowerCase().includes(q),
      );
    }

    // Sort: upcoming first, then by date desc
    return list.sort((a, b) => {
      const now = Date.now();
      const aFuture = new Date(a.date) > now;
      const bFuture = new Date(b.date) > now;
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      return aFuture
        ? new Date(a.date) - new Date(b.date) // upcoming: soonest first
        : new Date(b.date) - new Date(a.date); // past: most recent first
    });
  }, [interviews, statusFilter, typeFilter, query]);

  const activeFilters =
    (statusFilter !== "All" ? 1 : 0) + (typeFilter !== "All" ? 1 : 0);

  const openEdit = (iv) => {
    setEditTarget(iv);
    setFormOpen(true);
  };

  return (
    <>
      {/* ── Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CARDS(stats).map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="glass-card px-4 py-3 flex items-center gap-3"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center
                             flex-shrink-0 ${bg}`}
            >
              <Icon size={14} className={color} />
            </div>
            <div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-2xs text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upcoming Banner ─────────────────────────────── */}
      {upcoming.length > 0 && statusFilter === "All" && (
        <UpcomingBanner interviews={upcoming} />
      )}

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 bg-card border border-border
                          rounded-xl px-3 py-2.5 focus-within:border-accent/60 transition-colors"
          >
            <Search size={13} className="text-muted flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company, type, notes..."
              className="flex-1 bg-transparent text-xs text-text placeholder-muted outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-text"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs
                        font-medium transition-colors
                        ${
                          showFilters || activeFilters > 0
                            ? "bg-accent/10 border-accent/40 text-accent"
                            : "bg-card border-border text-muted hover:text-text"
                        }`}
          >
            <SlidersHorizontal size={12} />
            Filters
            {activeFilters > 0 && (
              <span
                className="w-4 h-4 rounded-full bg-accent text-bg text-2xs
                               flex items-center justify-center font-bold"
              >
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            {/* Status */}
            <div className="space-y-2">
              <p className="text-2xs font-semibold text-muted uppercase tracking-widest">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`text-2xs px-2.5 py-1 rounded-full border font-medium
                                transition-colors
                                ${
                                  statusFilter === s
                                    ? "bg-accent/15 border-accent/40 text-accent"
                                    : "bg-bg border-border text-muted hover:border-border/80"
                                }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <p className="text-2xs font-semibold text-muted uppercase tracking-widest">
                Interview Type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_FILTERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`text-2xs px-2.5 py-1 rounded-full border font-medium
                                transition-colors
                                ${
                                  typeFilter === t
                                    ? "bg-accent/15 border-accent/40 text-accent"
                                    : "bg-bg border-border text-muted hover:border-border/80"
                                }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <p className="text-2xs text-muted">
          {filtered.length} interview{filtered.length !== 1 ? "s" : ""}
          {statusFilter !== "All" && ` · ${statusFilter}`}
          {typeFilter !== "All" && ` · ${typeFilter}`}
          {query && ` matching "${query}"`}
        </p>
      </div>

      {/* ── Interview Cards ─────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          isEmpty={interviews.length === 0}
          query={query}
          onAdd={onAdd}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((iv) => (
            <InterviewCard key={iv.id} interview={iv} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {formOpen && editTarget && (
        <InterviewForm
          onClose={() => {
            setFormOpen(false);
            setEditTarget(null);
          }}
          editTarget={editTarget}
        />
      )}
    </>
  );
}

// ── Upcoming Banner ────────────────────────────────────────
function UpcomingBanner({ interviews }) {
  const next = interviews[0];
  if (!next) return null;

  const date = new Date(next.date);
  const daysUntil = Math.ceil((date - Date.now()) / 86400000);
  const hoursUntil = Math.ceil((date - Date.now()) / 3600000);

  const timeLabel =
    hoursUntil <= 0
      ? "Starting now!"
      : hoursUntil <= 1
        ? "In less than 1 hour"
        : hoursUntil <= 24
          ? `In ${hoursUntil} hours`
          : daysUntil === 1
            ? "Tomorrow"
            : `In ${daysUntil} days`;

  const urgent = hoursUntil <= 24;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl px-4 py-3 border
                     ${
                       urgent
                         ? "bg-warning/10 border-warning/30"
                         : "bg-accent/5 border-accent/20"
                     }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center
                       flex-shrink-0 text-lg ${urgent ? "bg-warning/15" : "bg-accent/15"}`}
      >
        📅
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold ${urgent ? "text-warning" : "text-accent"}`}
        >
          Next interview — {timeLabel}
        </p>
        <p className="text-xs text-text mt-0.5 truncate">
          <span className="font-medium">{next.company}</span>
          <span className="text-muted"> · {next.type} · </span>
          {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          {" at "}
          {date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {interviews.length > 1 && (
        <span className="text-2xs text-muted flex-shrink-0">
          +{interviews.length - 1} more
        </span>
      )}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ isEmpty, query, onAdd }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-center">
      <div
        className="w-12 h-12 rounded-xl bg-card border border-border
                      flex items-center justify-center text-xl"
      >
        🗓️
      </div>
      <p className="text-sm font-medium text-text">
        {isEmpty
          ? "No interviews scheduled"
          : `No interviews matching "${query}"`}
      </p>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        {isEmpty
          ? "Schedule your first interview to start tracking your progress."
          : "Try a different search term or clear the filters."}
      </p>
      {isEmpty && (
        <button
          onClick={onAdd}
          className="mt-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent
                     text-xs font-medium rounded-xl transition-colors"
        >
          Schedule First Interview
        </button>
      )}
    </div>
  );
}
