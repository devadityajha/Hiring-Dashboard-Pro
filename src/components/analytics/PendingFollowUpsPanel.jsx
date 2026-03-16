import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  ChevronRight,
  Mail,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import toast from "react-hot-toast";
import ConfidenceBadge from "../recruiters/ConfidenceBadge";

function daysSince(isoDate) {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
}

function urgencyConfig(days) {
  if (days >= 7)
    return {
      color: "text-danger",
      bg: "bg-danger/10",
      label: `${days}d overdue`,
    };
  if (days >= 5)
    return {
      color: "text-warning",
      bg: "bg-warning/10",
      label: `${days}d ago`,
    };
  return { color: "text-muted", bg: "bg-white/5", label: `${days}d ago` };
}

export default function PendingFollowUpsPanel({ followUps }) {
  const navigate = useNavigate();
  const { updateStatus, logInteraction } = useRecruiterStore();

  const sorted = useMemo(
    () =>
      [...followUps].sort(
        (a, b) => new Date(a.followUpDate) - new Date(b.followUpDate),
      ),
    [followUps],
  );

  const handleMarkFollowUp = (r) => {
    updateStatus(r.id, "Follow-Up");
    logInteraction(r.id, "Follow-up Sent");
    toast.success(`Follow-up logged for ${r.name} ✓`);
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-accent" />
          <p className="text-sm font-semibold text-text">Pending Follow-Ups</p>
          {followUps.length > 0 && (
            <span
              className="text-2xs font-bold bg-warning/20 text-warning
                             px-2 py-0.5 rounded-full"
            >
              {followUps.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate("/recruiters")}
          className="flex items-center gap-0.5 text-2xs text-muted
                     hover:text-accent transition-colors"
        >
          View all <ChevronRight size={11} />
        </button>
      </div>

      {/* Empty */}
      {followUps.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-2 text-center">
          <CheckCircle2 size={28} className="text-success/40" />
          <p className="text-sm font-medium text-text">All caught up!</p>
          <p className="text-xs text-muted">No pending follow-ups right now.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {sorted.map((r) => {
            const days = daysSince(r.dateContacted);
            const urg = urgencyConfig(days);

            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl border
                            transition-colors hover:border-border/80
                            ${
                              days >= 7
                                ? "border-danger/20 bg-danger/5"
                                : days >= 5
                                  ? "border-warning/20 bg-warning/5"
                                  : "border-border bg-card"
                            }`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-lg bg-accent/15 flex items-center
                                justify-center text-accent text-xs font-bold flex-shrink-0"
                >
                  {r.name?.[0]?.toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-text truncate">
                      {r.name}
                    </p>
                    <ConfidenceBadge value={r.confidence} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-2xs text-muted truncate">{r.company}</p>
                    <span className={`text-2xs font-medium ${urg.color}`}>
                      · {urg.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Mail shortcut */}
                  {r.email && (
                    <a
                      href={`mailto:${r.email}`}
                      className="w-7 h-7 flex items-center justify-center rounded-md
                                 text-muted hover:text-accent hover:bg-accent/10
                                 transition-colors"
                      title={`Email ${r.name}`}
                    >
                      <Mail size={12} />
                    </a>
                  )}
                  {/* Mark followed-up */}
                  <button
                    onClick={() => handleMarkFollowUp(r)}
                    className="w-7 h-7 flex items-center justify-center rounded-md
                               text-muted hover:text-success hover:bg-success/10
                               transition-colors"
                    title="Mark as followed up"
                  >
                    <MessageSquare size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {followUps.length > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <AlertCircle size={11} className="text-warning flex-shrink-0" />
          <p className="text-2xs text-muted">
            {followUps.filter((r) => daysSince(r.dateContacted) >= 7).length >
              0 && (
              <span className="text-danger font-medium">
                {
                  followUps.filter((r) => daysSince(r.dateContacted) >= 7)
                    .length
                }{" "}
                overdue ·{" "}
              </span>
            )}
            Follow up within 3–5 days for best response rates
          </p>
        </div>
      )}
    </div>
  );
}
