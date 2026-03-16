import { useNavigate } from "react-router-dom";

const PRESETS = {
  recruiters: {
    emoji: "👤",
    title: "No recruiters yet",
    body: "Add your first recruiter contact to start tracking outreach.",
    cta: "Add Recruiter",
    route: null,
  },
  tasks: {
    emoji: "✅",
    title: "No tasks yet",
    body: "Add tasks to keep your daily job-search actions on track.",
    cta: "Add Task",
    route: null,
  },
  notes: {
    emoji: "📝",
    title: "No notes yet",
    body: "Save interview prep notes, company research, and ideas here.",
    cta: "Create Note",
    route: null,
  },
  "notes-pinned": {
    emoji: "📌",
    title: "No pinned notes",
    body: "Pin a note from the Notes page to surface it here.",
    cta: "Go to Notes",
    route: "/notes",
  },
  drafts: {
    emoji: "📄",
    title: "No drafts yet",
    body: "Save cold emails, LinkedIn messages, and follow-up templates for one-click reuse.",
    cta: "Create Draft",
    route: null,
  },
  interviews: {
    emoji: "🗓️",
    title: "No interviews scheduled",
    body: "Schedule your first interview to start tracking your pipeline.",
    cta: "Schedule Interview",
    route: null,
  },
  search: {
    emoji: "🔍",
    title: "No results found",
    body: "Try a different keyword or clear the active filters.",
    cta: null,
    route: null,
  },
  analytics: {
    emoji: "📊",
    title: "Not enough data yet",
    body: "Start sending applications and contacting recruiters to see your analytics.",
    cta: "Go to Dashboard",
    route: "/dashboard",
  },
};

/**
 * @param {string}   preset    – key from PRESETS (optional)
 * @param {string}   emoji
 * @param {string}   title
 * @param {string}   body
 * @param {string}   cta       – button label
 * @param {function} onAction  – called when CTA clicked (overrides route)
 * @param {string}   route     – navigate target if no onAction
 * @param {string}   size      – "sm" | "md" (default "md")
 */
export default function EmptyState({
  preset,
  emoji,
  title,
  body,
  cta,
  onAction,
  route,
  size = "md",
}) {
  const navigate = useNavigate();
  const p = preset ? (PRESETS[preset] ?? {}) : {};

  const _emoji = emoji ?? p.emoji ?? "📭";
  const _title = title ?? p.title ?? "Nothing here yet";
  const _body = body ?? p.body ?? "";
  const _cta = cta ?? p.cta ?? null;
  const _route = route ?? p.route ?? null;

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    if (_route) {
      navigate(_route);
    }
  };

  const py = size === "sm" ? "py-8" : "py-16";
  const eSize = size === "sm" ? "text-2xl" : "text-3xl";
  const tSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`flex flex-col items-center ${py} gap-3 text-center px-6`}>
      {/* Icon container */}
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-2xl
                       bg-card border border-border ${eSize}`}
      >
        {_emoji}
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-xs">
        <p className={`font-semibold text-text ${tSize}`}>{_title}</p>
        {_body && <p className="text-xs text-muted leading-relaxed">{_body}</p>}
      </div>

      {/* CTA */}
      {_cta && (
        <button
          onClick={handleAction}
          className="mt-1 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent
                     text-xs font-medium rounded-xl transition-colors active:scale-95"
        >
          {_cta}
        </button>
      )}
    </div>
  );
}
