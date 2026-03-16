import { useState } from "react";
import {
  Clock,
  Mail,
  Linkedin,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import { useFollowUpChecker } from "../../hooks/useFollowUpChecker";
import StatusBadge from "../shared/StatusBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import InteractionTimeline from "./InteractionTimeline";

const QUICK_STATUSES = [
  "Mailed",
  "Follow-Up",
  "Interviewing",
  "No Response",
  "Closed",
];

export default function RecruiterCard({ recruiter, onEdit }) {
  const { updateStatus, deleteRecruiter, logInteraction } = useRecruiterStore();
  const { needsFollowUp, needsSecondFollowUp } = useFollowUpChecker(recruiter);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const followUpDue = needsFollowUp || needsSecondFollowUp;
  const contacted = new Date(recruiter.dateContacted).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    },
  );

  const handleStatusChange = (status) => {
    updateStatus(recruiter.id, status);
    logInteraction(
      recruiter.id,
      status === "Follow-Up" ? "Follow-up Sent" : status,
    );
    toast.success(`Status → ${status} ✓`);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteRecruiter(recruiter.id);
    toast.success("Recruiter removed");
  };

  return (
    <div
      className={`glass-card transition-all duration-200 hover:border-border/80
                  ${followUpDue ? "border-l-2 border-l-warning" : ""}`}
    >
      {/* ── Card Header ─────────────────────────────────── */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Name + Company */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center
                            text-accent font-bold text-sm flex-shrink-0"
            >
              {recruiter.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-text">
                  {recruiter.name}
                </p>
                {followUpDue && (
                  <span
                    className="flex items-center gap-1 text-2xs text-warning
                                   bg-warning/10 px-1.5 py-0.5 rounded-full"
                  >
                    <AlertCircle size={9} /> Follow-up due
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-0.5">{recruiter.company}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={9} className="text-muted" />
                <span className="text-2xs text-muted">{contacted}</span>
              </div>
            </div>
          </div>

          {/* Right: Badges + Actions */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <StatusBadge value={recruiter.status} />
              <ConfidenceBadge value={recruiter.confidence} />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(recruiter)}
                className="w-6 h-6 flex items-center justify-center rounded-md
                           text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={handleDelete}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors
                            ${
                              confirmDelete
                                ? "text-danger bg-danger/10"
                                : "text-muted hover:text-danger hover:bg-danger/10"
                            }`}
                title={confirmDelete ? "Click again to confirm" : "Delete"}
                onBlur={() => setConfirmDelete(false)}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Links row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {recruiter.email && (
            <a
              href={`mailto:${recruiter.email}`}
              className="flex items-center gap-1 text-2xs text-muted hover:text-accent transition-colors"
            >
              <Mail size={10} /> {recruiter.email}
            </a>
          )}
          {recruiter.linkedinUrl && (
            <a
              href={recruiter.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-2xs text-muted hover:text-blue-400 transition-colors"
            >
              <Linkedin size={10} /> LinkedIn <ExternalLink size={8} />
            </a>
          )}
        </div>

        {/* Notes preview */}
        {recruiter.notes && (
          <p className="text-2xs text-muted mt-2 leading-relaxed line-clamp-2 italic">
            "{recruiter.notes}"
          </p>
        )}

        {/* Quick Status Buttons */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {QUICK_STATUSES.filter((s) => s !== recruiter.status).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className="text-2xs px-2 py-1 rounded-lg bg-white/5 text-muted
                         hover:bg-accent/10 hover:text-accent transition-colors"
            >
              → {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Expand Toggle ────────────────────────────────── */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-border
                   text-2xs text-muted hover:text-accent hover:bg-white/5 transition-colors rounded-b-xl"
      >
        {expanded ? (
          <>
            <ChevronUp size={11} /> Hide history
          </>
        ) : (
          <>
            <ChevronDown size={11} /> View interaction history
            <span className="ml-1 bg-white/10 px-1.5 py-0.5 rounded-full">
              {recruiter.interactions?.length ?? 0}
            </span>
          </>
        )}
      </button>

      {/* ── Interaction Timeline ─────────────────────────── */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          <InteractionTimeline
            recruiterId={recruiter.id}
            interactions={recruiter.interactions ?? []}
          />
        </div>
      )}
    </div>
  );
}
