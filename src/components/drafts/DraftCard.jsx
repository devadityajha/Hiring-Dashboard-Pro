import { useState } from "react";
import { Copy, Check, Pencil, Trash2, FileText, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useDraftStore } from "../../store/useDraftStore";

const CATEGORY_COLORS = {
  "Cold Email": {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  LinkedIn: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  "Follow-Up": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  Introduction: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
};

export default function DraftCard({ draft, onEdit }) {
  const { deleteDraft } = useDraftStore();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirm] = useState(false);

  const colors = CATEGORY_COLORS[draft.category] ?? {
    bg: "bg-white/5",
    text: "text-muted",
    border: "border-border",
  };

  const updatedAt = new Date(draft.updatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Truncated preview
  const PREVIEW_LEN = 160;
  const preview =
    draft.content.length > PREVIEW_LEN
      ? draft.content.slice(0, PREVIEW_LEN).trimEnd() + "…"
      : draft.content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft.content);
      setCopied(true);
      toast.success("Copied to clipboard ✓", { duration: 1500 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — please copy manually.");
    }
  };

  const handleDelete = () => {
    if (!confirmDel) {
      setConfirm(true);
      return;
    }
    deleteDraft(draft.id);
    toast.success("Draft deleted");
  };

  return (
    <div
      className="glass-card flex flex-col gap-0 hover:border-border/80
                    transition-all duration-150 overflow-hidden group"
    >
      {/* ── Card Header ─────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center
                             flex-shrink-0 ${colors.bg} border ${colors.border}`}
            >
              <FileText size={13} className={colors.text} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text leading-tight truncate">
                {draft.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`text-2xs font-medium px-2 py-0.5 rounded-full
                                  border ${colors.bg} ${colors.text} ${colors.border}`}
                >
                  {draft.category}
                </span>
                <span className="flex items-center gap-1 text-2xs text-muted">
                  <Clock size={9} /> {updatedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div
            className="flex items-center gap-1 flex-shrink-0
                          opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {/* Copy */}
            <button
              onClick={handleCopy}
              className={`w-7 h-7 flex items-center justify-center rounded-md
                          transition-all duration-150
                          ${
                            copied
                              ? "bg-success/15 text-success"
                              : "text-muted hover:text-accent hover:bg-accent/10"
                          }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(draft)}
              className="w-7 h-7 flex items-center justify-center rounded-md
                         text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              title="Edit draft"
            >
              <Pencil size={12} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              onBlur={() => setConfirm(false)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
                          ${
                            confirmDel
                              ? "bg-danger/10 text-danger"
                              : "text-muted hover:text-danger hover:bg-danger/10"
                          }`}
              title={confirmDel ? "Click again to confirm" : "Delete draft"}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Preview ─────────────────────────────── */}
      <div
        className="px-4 pb-3 cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        <div
          className={`bg-bg/50 rounded-xl p-3 border border-border/50
                         transition-all duration-200`}
        >
          <pre
            className={`text-2xs text-muted font-mono leading-relaxed whitespace-pre-wrap
                        break-words transition-all duration-300
                        ${expanded ? "" : "line-clamp-4"}`}
          >
            {expanded ? draft.content : preview}
          </pre>
        </div>

        <button className="text-2xs text-muted hover:text-accent transition-colors mt-1.5 px-1">
          {expanded ? "Show less ↑" : "Expand ↓"}
        </button>
      </div>

      {/* ── Footer: Quick Copy CTA ───────────────────────── */}
      <div className="border-t border-border px-4 py-2.5">
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg
                      text-xs font-medium transition-all duration-150
                      ${
                        copied
                          ? "bg-success/10 text-success"
                          : "bg-white/5 hover:bg-accent/10 text-muted hover:text-accent"
                      }`}
        >
          {copied ? (
            <>
              <Check size={12} /> Copied!
            </>
          ) : (
            <>
              <Copy size={12} /> Copy Message
            </>
          )}
        </button>
      </div>
    </div>
  );
}
