import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Users,
  CheckSquare,
  StickyNote,
  FileText,
  ArrowRight,
  Keyboard,
  Clock,
} from "lucide-react";
import { useFuseSearch } from "../../hooks/useFuseSearch";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import { useTaskStore } from "../../store/useTaskStore";
import { useNoteStore } from "../../store/useNoteStore";
import { useDraftStore } from "../../store/useDraftStore";
import StatusBadge from "./StatusBadge";
import ConfidenceBadge from "../recruiters/ConfidenceBadge";

// ── Per-category config ────────────────────────────────────
const CATEGORIES = {
  recruiters: {
    label: "Recruiters",
    icon: Users,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    route: "/recruiters",
  },
  tasks: {
    label: "Tasks",
    icon: CheckSquare,
    color: "text-green-400",
    bg: "bg-green-500/10",
    route: "/tasks",
  },
  notes: {
    label: "Notes",
    icon: StickyNote,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    route: "/notes",
  },
  drafts: {
    label: "Drafts",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    route: "/drafts",
  },
};

// Highlight matching substring
function Highlight({ text = "", query = "" }) {
  if (!query.trim() || !text) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-accent/25 text-accent rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ── Result row renderers per type ──────────────────────────

function RecruiterResult({ item, query, onClick }) {
  return (
    <button onClick={onClick} className="result-row group">
      <div
        className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center
                      text-accent text-xs font-bold flex-shrink-0"
      >
        {item.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-xs font-medium text-text truncate">
          <Highlight text={item.name} query={query} />
        </p>
        <p className="text-2xs text-muted truncate">
          <Highlight text={item.company} query={query} />
          {item.email && (
            <>
              {" "}
              · <Highlight text={item.email} query={query} />
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <StatusBadge value={item.status} />
        <ConfidenceBadge value={item.confidence} size="sm" />
      </div>
      <ArrowRight
        size={11}
        className="text-muted group-hover:text-accent
                                        transition-colors flex-shrink-0"
      />
    </button>
  );
}

function TaskResult({ item, query, onClick }) {
  return (
    <button onClick={onClick} className="result-row group">
      <div
        className={`w-4 h-4 rounded border-2 flex-shrink-0
                       ${item.completed ? "bg-success border-success" : "border-border"}`}
      />
      <p
        className={`flex-1 text-xs text-left truncate
                     ${item.completed ? "line-through text-muted" : "text-text"}`}
      >
        <Highlight text={item.text} query={query} />
      </p>
      <ArrowRight
        size={11}
        className="text-muted group-hover:text-accent
                                        transition-colors flex-shrink-0"
      />
    </button>
  );
}

function NoteResult({ item, query, onClick }) {
  return (
    <button onClick={onClick} className="result-row group">
      <div
        className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center
                      text-yellow-400 text-xs flex-shrink-0"
      >
        {item.pinned ? "📌" : "📝"}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-xs font-medium text-text truncate">
          <Highlight text={item.title} query={query} />
        </p>
        <p className="text-2xs text-muted truncate">
          <Highlight text={item.content?.slice(0, 80)} query={query} />
        </p>
      </div>
      <ArrowRight
        size={11}
        className="text-muted group-hover:text-accent
                                        transition-colors flex-shrink-0"
      />
    </button>
  );
}

function DraftResult({ item, query, onClick }) {
  return (
    <button onClick={onClick} className="result-row group">
      <div
        className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center
                      text-purple-400 text-xs flex-shrink-0"
      >
        <FileText size={13} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-xs font-medium text-text truncate">
          <Highlight text={item.title} query={query} />
        </p>
        <p className="text-2xs text-muted truncate">
          {item.category} ·{" "}
          <Highlight text={item.content?.slice(0, 60)} query={query} />
        </p>
      </div>
      <ArrowRight
        size={11}
        className="text-muted group-hover:text-accent
                                        transition-colors flex-shrink-0"
      />
    </button>
  );
}

// ── Main GlobalSearch component ────────────────────────────

export default function GlobalSearch({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { recruiters } = useRecruiterStore();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { drafts } = useDraftStore();

  // Four parallel Fuse searches
  const recruiterResults = useFuseSearch(
    recruiters,
    ["name", "company", "email", "linkedinUrl"],
    query,
  );
  const taskResults = useFuseSearch(tasks, ["text"], query);
  const noteResults = useFuseSearch(
    notes,
    [
      { name: "title", weight: 2 },
      { name: "content", weight: 1 },
    ],
    query,
  );
  const draftResults = useFuseSearch(
    drafts,
    [
      { name: "title", weight: 2 },
      { name: "content", weight: 1 },
    ],
    query,
  );

  // Grouped results with category metadata
  const groups = useMemo(
    () =>
      [
        {
          key: "recruiters",
          items: recruiterResults.slice(0, 4),
          ...CATEGORIES.recruiters,
        },
        { key: "tasks", items: taskResults.slice(0, 3), ...CATEGORIES.tasks },
        { key: "notes", items: noteResults.slice(0, 3), ...CATEGORIES.notes },
        {
          key: "drafts",
          items: draftResults.slice(0, 3),
          ...CATEGORIES.drafts,
        },
      ].filter((g) => g.items.length > 0),
    [recruiterResults, taskResults, noteResults, draftResults],
  );

  const totalResults = groups.reduce((s, g) => s + g.items.length, 0);

  // Flat list for keyboard navigation
  const flatItems = useMemo(
    () =>
      groups.flatMap((g) =>
        g.items.map((item) => ({ item, key: g.key, route: g.route })),
      ),
    [groups],
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const { route } = flatItems[activeIndex];
      navigate(route);
      onClose();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleResultClick = (route) => {
    navigate(route);
    onClose();
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center
                 pt-[10vh] px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-2xl
                      shadow-2xl overflow-hidden"
        onKeyDown={handleKey}
      >
        {/* ── Search Input ──────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={15} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recruiters, tasks, notes, drafts..."
            className="flex-1 bg-transparent text-sm text-text placeholder-muted outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted hover:text-text transition-colors flex-shrink-0"
            >
              <X size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-2xs text-muted bg-white/5 border border-border
                       px-2 py-1 rounded-md hover:text-text transition-colors"
          >
            Esc
          </button>
        </div>

        {/* ── Results ───────────────────────────────────── */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <EmptyPrompt />
          ) : totalResults === 0 ? (
            <NoResults query={query} />
          ) : (
            <>
              {/* Results count */}
              <div className="px-4 py-2 border-b border-border/50">
                <p className="text-2xs text-muted">
                  {totalResults} result{totalResults !== 1 ? "s" : ""} for
                  <span className="text-text font-medium ml-1">"{query}"</span>
                </p>
              </div>

              {/* Grouped sections */}
              {groups.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.key}>
                    {/* Section header */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2
                                     border-b border-border/40 ${group.bg}`}
                    >
                      <Icon size={11} className={group.color} />
                      <span
                        className={`text-2xs font-semibold uppercase
                                        tracking-widest ${group.color}`}
                      >
                        {group.label}
                      </span>
                      <span className="text-2xs text-muted ml-auto">
                        {group.items.length}
                      </span>
                    </div>

                    {/* Result rows */}
                    <div className="py-1">
                      {group.items.map((item, itemIdx) => {
                        // Calculate flat index for keyboard highlight
                        const flatIdx = flatItems.findIndex(
                          (f) => f.item === item && f.key === group.key,
                        );
                        const isActive = flatIdx === activeIndex;

                        return (
                          <div
                            key={item.id}
                            className={isActive ? "bg-accent/5" : ""}
                          >
                            {group.key === "recruiters" && (
                              <RecruiterResult
                                item={item}
                                query={query}
                                onClick={() => handleResultClick(group.route)}
                              />
                            )}
                            {group.key === "tasks" && (
                              <TaskResult
                                item={item}
                                query={query}
                                onClick={() => handleResultClick(group.route)}
                              />
                            )}
                            {group.key === "notes" && (
                              <NoteResult
                                item={item}
                                query={query}
                                onClick={() => handleResultClick(group.route)}
                              />
                            )}
                            {group.key === "drafts" && (
                              <DraftResult
                                item={item}
                                query={query}
                                onClick={() => handleResultClick(group.route)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* "View all in section" link */}
                    <button
                      onClick={() => handleResultClick(group.route)}
                      className={`w-full flex items-center justify-between px-4 py-2
                                  text-2xs border-b border-border/40 transition-colors
                                  ${group.color} hover:${group.bg}`}
                    >
                      <span>View all {group.label.toLowerCase()}</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────── */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 border-t border-border
                        bg-bg/40"
        >
          <KbdHint keys={["↑", "↓"]} label="navigate" />
          <KbdHint keys={["↵"]} label="go to page" />
          <KbdHint keys={["Esc"]} label="close" />
          <div className="ml-auto flex items-center gap-1.5 text-2xs text-muted">
            <Keyboard size={10} />
            <span>Ctrl+K to open</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────

function KbdHint({ keys, label }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="px-1.5 py-0.5 bg-white/10 border border-border rounded
                     text-2xs text-muted font-mono"
        >
          {k}
        </kbd>
      ))}
      <span className="text-2xs text-muted ml-1">{label}</span>
    </div>
  );
}

function EmptyPrompt() {
  const hints = [
    {
      icon: Users,
      color: "text-cyan-400",
      text: "Search by recruiter name or email",
    },
    {
      icon: CheckSquare,
      color: "text-green-400",
      text: "Find tasks by keyword",
    },
    {
      icon: StickyNote,
      color: "text-yellow-400",
      text: "Search note titles and content",
    },
    {
      icon: FileText,
      color: "text-purple-400",
      text: "Find message templates",
    },
  ];
  return (
    <div className="px-4 py-6 space-y-4">
      <p className="text-xs font-medium text-muted text-center">
        Search across your entire workspace
      </p>
      <div className="space-y-2">
        {hints.map(({ icon: Icon, color, text }) => (
          <div
            key={text}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
          >
            <Icon size={13} className={color} />
            <span className="text-xs text-muted">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoResults({ query }) {
  return (
    <div className="flex flex-col items-center py-12 gap-2 text-center px-6">
      <Search size={24} className="text-muted/30" />
      <p className="text-sm font-medium text-text">No results for "{query}"</p>
      <p className="text-xs text-muted">
        Try a different keyword, or check the spelling.
      </p>
    </div>
  );
}
