import { AlertTriangle, ExternalLink } from "lucide-react";

export default function DuplicateAlert({ duplicate, onDismiss }) {
  if (!duplicate) return null;

  const contacted = new Date(duplicate.dateContacted).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div
      className="flex items-start gap-3 bg-warning/10 border border-warning/30
                    rounded-xl px-4 py-3 animate-[fadeIn_0.15s_ease]"
    >
      <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-warning">
          Recruiter already contacted
        </p>
        <p className="text-2xs text-muted mt-0.5 leading-relaxed">
          <span className="text-text font-medium">{duplicate.name}</span>
          {" @ "}
          <span className="text-text font-medium">{duplicate.company}</span>
          {" was contacted on "}
          <span className="text-text">{contacted}</span>
          {" — Status: "}
          <span className="text-accent">{duplicate.status}</span>
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-muted hover:text-text text-2xs flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      )}
    </div>
  );
}
