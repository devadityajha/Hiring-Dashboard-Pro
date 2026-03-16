import { useState } from "react";
import {
  Pin,
  PinOff,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNoteStore } from "../../store/useNoteStore";

// Soft accent colors cycled by note index
const ACCENT_PALETTE = [
  { border: "border-cyan-500/20", dot: "bg-cyan-400", header: "bg-cyan-500/5" },
  {
    border: "border-purple-500/20",
    dot: "bg-purple-400",
    header: "bg-purple-500/5",
  },
  {
    border: "border-yellow-500/20",
    dot: "bg-yellow-400",
    header: "bg-yellow-500/5",
  },
  {
    border: "border-green-500/20",
    dot: "bg-green-400",
    header: "bg-green-500/5",
  },
  { border: "border-pink-500/20", dot: "bg-pink-400", header: "bg-pink-500/5" },
  {
    border: "border-orange-500/20",
    dot: "bg-orange-400",
    header: "bg-orange-500/5",
  },
];

const PREVIEW_LEN = 200;

export default function NoteCard({ note, index = 0, onEdit }) {
  const { togglePin, deleteNote } = useNoteStore();

  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirm] = useState(false);

  const palette = ACCENT_PALETTE[index % ACCENT_PALETTE.length];
  const isPinned = note.pinned;

  const createdAt = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isLong = note.content.length > PREVIEW_LEN;
  const preview =
    isLong && !expanded
      ? note.content.slice(0, PREVIEW_LEN).trimEnd() + "…"
      : note.content;

  const handlePin = () => {
    togglePin(note.id);
    toast.success(isPinned ? "Note unpinned" : "Note pinned to dashboard ✓", {
      duration: 1500,
    });
  };

  const handleDelete = () => {
    if (!confirmDel) {
      setConfirm(true);
      return;
    }
    deleteNote(note.id);
    toast.success("Note deleted");
  };

  return (
    <div
      className={`glass-card flex flex-col overflow-hidden group transition-all duration-150
                  hover:border-border/80
                  ${isPinned ? `border-l-2 ${palette.border}` : ""}`}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div className={`px-4 pt-4 pb-3 ${isPinned ? palette.header : ""}`}>
        <div className="flex items-start justify-between gap-3">
          {/* Left: dot + title */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5
                             ${isPinned ? palette.dot : "bg-border"}`}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-text leading-tight">
                  {note.title}
                </p>
                {isPinned && (
                  <span
                    className="flex items-center gap-1 text-2xs text-accent
                                   bg-accent/10 px-1.5 py-0.5 rounded-full"
                  >
                    <Pin size={8} /> Pinned
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={9} className="text-muted" />
                <span className="text-2xs text-muted">{createdAt}</span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div
            className="flex items-center gap-1 flex-shrink-0
                          opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {/* Pin */}
            <button
              onClick={handlePin}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors
                          ${
                            isPinned
                              ? "text-accent bg-accent/10 hover:bg-accent/20"
                              : "text-muted hover:text-accent hover:bg-accent/10"
                          }`}
              title={isPinned ? "Unpin note" : "Pin to dashboard"}
            >
              {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(note)}
              className="w-7 h-7 flex items-center justify-center rounded-md
                         text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              title="Edit note"
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
              title={confirmDel ? "Click again to confirm" : "Delete note"}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="px-4 pb-3 flex-1">
        <div className="bg-bg/40 rounded-xl p-3 border border-border/40">
          <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap break-words">
            {preview}
          </p>
        </div>

        {/* Expand toggle */}
        {isLong && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 text-2xs text-muted hover:text-accent
                       transition-colors mt-2 px-1"
          >
            {expanded ? (
              <>
                <ChevronUp size={11} /> Show less
              </>
            ) : (
              <>
                <ChevronDown size={11} /> Read more
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Footer: quick pin CTA ─────────────────────────── */}
      <div className="border-t border-border px-4 py-2.5">
        <button
          onClick={handlePin}
          className={`w-full flex items-center justify-center gap-2 py-1.5
                      rounded-lg text-xs font-medium transition-all duration-150
                      ${
                        isPinned
                          ? "bg-accent/5 hover:bg-danger/10 text-muted hover:text-danger"
                          : "bg-white/5 hover:bg-accent/10 text-muted hover:text-accent"
                      }`}
        >
          {isPinned ? (
            <>
              <PinOff size={11} /> Remove from dashboard
            </>
          ) : (
            <>
              <Pin size={11} /> Pin to dashboard
            </>
          )}
        </button>
      </div>
    </div>
  );
}
