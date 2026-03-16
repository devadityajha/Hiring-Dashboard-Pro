import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  AtSign,
  Link2,
  AlignLeft,
  Globe,
  X,
  UserPlus,
  StickyNote,
} from "lucide-react";
import toast from "react-hot-toast";
import { parseQuickCapture } from "../../utils/quickCaptureParser";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import { useNoteStore } from "../../store/useNoteStore";
import RecruiterForm from "../recruiters/RecruiterForm";
import NoteForm from "../notes/NoteForm";

// Per-type UI config
const TYPE_CONFIG = {
  linkedin: {
    icon: Link2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    label: "LinkedIn URL",
    actionLabel: "Add as Recruiter →",
    actionIcon: UserPlus,
  },
  email: {
    icon: AtSign,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    label: "Email address",
    actionLabel: "Add as Recruiter →",
    actionIcon: UserPlus,
  },
  url: {
    icon: Globe,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    label: "URL detected",
    actionLabel: "Save as Note →",
    actionIcon: StickyNote,
  },
  note: {
    icon: AlignLeft,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    label: "Quick note",
    actionLabel: "Save as Note →",
    actionIcon: StickyNote,
  },
};

export default function QuickCaptureBar() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { findDuplicate } = useRecruiterStore();
  const { addNote } = useNoteStore();

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [recruiterModal, setRecruiterModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const parsed = value.trim() ? parseQuickCapture(value) : null;
  const config = parsed ? TYPE_CONFIG[parsed.type] : null;

  // ── Capture handler ───────────────────────────────────
  const handleCapture = useCallback(() => {
    if (!parsed) return;
    const { type, value: raw } = parsed;

    if (type === "linkedin" || type === "email") {
      // Check for duplicate before opening modal
      const dup = findDuplicate(
        type === "email" ? { email: raw } : { linkedinUrl: raw },
      );
      if (dup) {
        toast.error(`⚠️ Already contacted: ${dup.name} @ ${dup.company}`, {
          duration: 4000,
        });
        return;
      }
      // Pre-fill the recruiter form
      setPrefill(type === "email" ? { email: raw } : { linkedinUrl: raw });
      setRecruiterModal(true);
    } else {
      // url or note → open NoteForm pre-filled
      setPrefill({ title: "", content: raw });
      setNoteModal(true);
    }
  }, [parsed, findDuplicate]);

  const handleKey = (e) => {
    if (e.key === "Enter") handleCapture();
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  };

  const handleClose = () => {
    setRecruiterModal(false);
    setNoteModal(false);
    setPrefill(null);
    setValue("");
  };

  return (
    <>
      <div className="flex-shrink-0 px-6 py-2.5 border-b border-border bg-surface/50">
        {/* ── Input Row ──────────────────────────────────── */}
        <div
          className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-2.5
                       transition-all duration-200
                       ${
                         focused
                           ? `border-accent/50 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]
                            ${config ? config.border : ""}`
                           : "border-border"
                       }`}
        >
          {/* Left icon — changes with detected type */}
          {config ? (
            <config.icon
              size={14}
              className={`flex-shrink-0 transition-colors ${config.color}`}
            />
          ) : (
            <Zap
              size={14}
              className={`flex-shrink-0 transition-colors
                          ${focused ? "text-accent" : "text-muted"}`}
            />
          )}

          {/* Input */}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder="Quick capture — paste email, LinkedIn URL, or type a note…"
            className="flex-1 bg-transparent text-xs text-text placeholder-muted outline-none"
          />

          {/* Type label pill */}
          {config && (
            <span
              className={`hidden sm:flex items-center gap-1 text-2xs font-medium
                          px-2 py-0.5 rounded-full flex-shrink-0
                          ${config.bg} ${config.color}`}
            >
              <config.icon size={9} />
              {config.label}
            </span>
          )}

          {/* Clear */}
          {value && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setValue("");
              }}
              className="text-muted hover:text-text transition-colors flex-shrink-0"
            >
              <X size={12} />
            </button>
          )}

          {/* Submit arrow */}
          {parsed && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleCapture();
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                          text-xs font-medium transition-all duration-150 active:scale-95
                          ${config.bg} ${config.color}`}
            >
              <config.actionIcon size={11} />
              <span className="hidden md:inline">{config.actionLabel}</span>
              <ArrowRight size={11} className="md:hidden" />
            </button>
          )}
        </div>

        {/* ── Hint line ──────────────────────────────────── */}
        {focused && parsed && (
          <div className="flex items-center justify-between px-1 mt-1.5">
            <p className={`text-2xs ${config.color}`}>
              {parsed.type === "linkedin" &&
                `LinkedIn: /in/${parsed.meta.handle}`}
              {parsed.type === "email" && `Domain: ${parsed.meta.domain}`}
              {parsed.type === "url" && `Host: ${parsed.meta.host}`}
              {parsed.type === "note" &&
                `${parsed.meta.wordCount} word${parsed.meta.wordCount !== 1 ? "s" : ""}`}
            </p>
            <p className="text-2xs text-muted">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-white/10 rounded text-2xs">
                Enter
              </kbd>{" "}
              to capture
            </p>
          </div>
        )}

        {focused && !parsed && (
          <p className="text-2xs text-muted/50 px-1 mt-1.5">
            Paste an email, LinkedIn URL, or type anything to quick-capture
          </p>
        )}
      </div>

      {/* ── Recruiter Modal (pre-filled) ─────────────────── */}
      {recruiterModal && (
        <QuickRecruiterForm prefill={prefill} onClose={handleClose} />
      )}

      {/* ── Note Modal (pre-filled) ───────────────────────── */}
      {noteModal && <QuickNoteForm prefill={prefill} onClose={handleClose} />}
    </>
  );
}

// ── Thin wrappers that pre-fill form defaults ──────────────

function QuickRecruiterForm({ prefill, onClose }) {
  // Pass prefill as editTarget shape but with isQuickCapture flag
  // RecruiterForm already accepts editTarget for pre-filling.
  // We create a minimal "edit-like" object so RHF defaultValues kick in.
  const prefillTarget = {
    name: "",
    company: "",
    email: prefill?.email ?? "",
    linkedinUrl: prefill?.linkedinUrl ?? "",
    status: "Mailed",
    confidence: "Warm Lead",
    notes: "",
    __quickCapture: true, // flag so form shows "Add Recruiter" not "Edit"
  };

  return <RecruiterFormQuick prefill={prefillTarget} onClose={onClose} />;
}

function QuickNoteForm({ prefill, onClose }) {
  const { addNote } = useNoteStore();

  // For very short captures, just save directly without modal
  const wordCount = prefill?.content?.split(/\s+/).length ?? 0;
  if (wordCount <= 6) {
    // Auto-save short captures as untitled notes
    addNote({
      title: prefill?.content?.slice(0, 40) ?? "Quick Note",
      content: prefill?.content ?? "",
    });
    toast.success("Quick note saved ✓");
    onClose();
    return null;
  }

  return (
    <NoteForm
      onClose={onClose}
      editTarget={{ ...prefill, __quickCapture: true }}
    />
  );
}

// Minimal recruiter form bridge that uses RecruiterForm with pre-filled data
function RecruiterFormQuick({ prefill, onClose }) {
  // We need RecruiterForm to use prefill as defaultValues.
  // RecruiterForm checks isEdit = Boolean(editTarget).
  // Pass as editTarget but override the submit to use addRecruiter.
  const { addRecruiter, findDuplicate } = useRecruiterStore();

  // Just open the actual RecruiterForm — it handles add mode when no id present
  return (
    <RecruiterForm
      onClose={onClose}
      editTarget={prefill.__quickCapture ? null : prefill}
      quickPrefill={prefill}
    />
  );
}
