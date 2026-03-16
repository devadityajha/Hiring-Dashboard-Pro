import { useState, useMemo } from "react";
import { Search, X, Pin, StickyNote, ArrowUpDown } from "lucide-react";
import Fuse from "fuse.js";
import { useNoteStore } from "../../store/useNoteStore";
import NoteCard from "./NoteCard";
import NoteForm from "./NoteForm";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "pinned", label: "Pinned first" },
  { value: "alpha", label: "A → Z" },
];

const FILTERS = ["All", "Pinned", "Unpinned"];

export default function NoteList() {
  const { notes } = useNoteStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [formOpen, setForm] = useState(false);
  const [editTarget, setEdit] = useState(null);

  // Fuse search
  const fuse = useMemo(
    () =>
      new Fuse(notes, {
        keys: [
          { name: "title", weight: 2 },
          { name: "content", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [notes],
  );

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...notes];

    // Filter
    if (filter === "Pinned") list = list.filter((n) => n.pinned);
    if (filter === "Unpinned") list = list.filter((n) => !n.pinned);

    // Sort
    switch (sort) {
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "pinned":
        list.sort((a, b) => Number(b.pinned) - Number(a.pinned));
        break;
      case "alpha":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [notes, query, filter, sort, fuse]);

  // Pinned section (for split view when filter = All)
  const pinned = results.filter((n) => n.pinned);
  const unpinned = results.filter((n) => !n.pinned);

  const openAdd = () => {
    setEdit(null);
    setForm(true);
  };
  const openEdit = (n) => {
    setEdit(n);
    setForm(true);
  };
  const closeForm = () => {
    setForm(false);
    setEdit(null);
  };

  return (
    <>
      <div className="space-y-5">
        {/* ── Toolbar ────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div
            className="flex-1 min-w-48 flex items-center gap-2 bg-card border border-border
                          rounded-xl px-3 py-2.5 focus-within:border-accent/60 transition-colors"
          >
            <Search size={13} className="text-muted flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes by title or content..."
              className="flex-1 bg-transparent text-xs text-text placeholder-muted outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-text transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div
            className="flex items-center gap-1.5 bg-card border border-border
                          rounded-xl px-3 py-2.5"
          >
            <ArrowUpDown size={11} className="text-muted" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs text-muted outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Filter Tabs ────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => {
            const count =
              f === "All"
                ? notes.length
                : f === "Pinned"
                  ? notes.filter((n) => n.pinned).length
                  : notes.filter((n) => !n.pinned).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                            font-medium transition-all duration-150
                            ${
                              filter === f
                                ? f === "Pinned"
                                  ? "bg-accent/15 text-accent"
                                  : "bg-white/10 text-text"
                                : "text-muted hover:text-text"
                            }`}
              >
                {f === "Pinned" && <Pin size={10} />}
                {f}
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded-full
                                  ${filter === f ? "bg-white/20" : "bg-white/5"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Result count when searching */}
          {query && (
            <span className="text-2xs text-muted ml-2">
              {results.length} result{results.length !== 1 ? "s" : ""} for "
              {query}"
            </span>
          )}
        </div>

        {/* ── Notes Grid ─────────────────────────────────── */}
        {results.length === 0 ? (
          <EmptyState
            isEmpty={notes.length === 0}
            query={query}
            filter={filter}
            onAdd={openAdd}
          />
        ) : filter === "All" && !query && pinned.length > 0 ? (
          /* Split view: pinned section on top */
          <div className="space-y-6">
            {/* Pinned section */}
            <div className="space-y-3">
              <SectionLabel
                icon={Pin}
                label="Pinned"
                count={pinned.length}
                color="text-accent"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pinned.map((note, i) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    index={i}
                    onEdit={openEdit}
                  />
                ))}
              </div>
            </div>

            {/* Unpinned section */}
            {unpinned.length > 0 && (
              <div className="space-y-3">
                <SectionLabel
                  icon={StickyNote}
                  label="All Notes"
                  count={unpinned.length}
                  color="text-muted"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {unpinned.map((note, i) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      index={i}
                      onEdit={openEdit}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Flat grid for filtered / searched views */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {/* ── Form Modal ─────────────────────────────────────── */}
      {formOpen && <NoteForm onClose={closeForm} editTarget={editTarget} />}
    </>
  );
}

// ── Helpers ────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={12} className={color} />
      <span
        className={`text-2xs font-semibold uppercase tracking-widest ${color}`}
      >
        {label}
      </span>
      <span className="text-2xs text-muted">({count})</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function EmptyState({ isEmpty, query, filter, onAdd }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-center">
      <div
        className="w-12 h-12 rounded-xl bg-card border border-border
                      flex items-center justify-center text-xl"
      >
        {filter === "Pinned" ? "📌" : "📝"}
      </div>
      <p className="text-sm font-medium text-text">
        {isEmpty
          ? "No notes yet"
          : query
            ? `No notes matching "${query}"`
            : filter === "Pinned"
              ? "No pinned notes"
              : "No unpinned notes"}
      </p>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        {isEmpty
          ? "Keep interview prep notes, company research, and recruiter conversation logs here."
          : filter === "Pinned"
            ? "Pin a note to surface it on your dashboard."
            : "Try a different search term or filter."}
      </p>
      {isEmpty && (
        <button
          onClick={onAdd}
          className="mt-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent
                     text-xs font-medium rounded-xl transition-colors"
        >
          Create First Note
        </button>
      )}
    </div>
  );
}
