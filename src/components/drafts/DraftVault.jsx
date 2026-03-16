import { useState, useMemo } from "react";
import { Search, X, PlusCircle } from "lucide-react";
import Fuse from "fuse.js";
import { useDraftStore, DRAFT_CATEGORIES } from "../../store/useDraftStore";
import DraftCard from "./DraftCard";
import DraftForm from "./DraftForm";

const ALL_CATEGORIES = ["All", ...DRAFT_CATEGORIES];

const CATEGORY_COLORS = {
  All: "bg-white/5 text-muted border-border",
  "Cold Email": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  LinkedIn: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Follow-Up": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Introduction: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function DraftVault() {
  const { drafts } = useDraftStore();
  const [query, setQuery] = useState("");
  const [category, setCat] = useState("All");
  const [formOpen, setForm] = useState(false);
  const [editTarget, setEdit] = useState(null);

  // Fuse search across title + content
  const fuse = useMemo(
    () =>
      new Fuse(drafts, {
        keys: [
          { name: "title", weight: 2 },
          { name: "content", weight: 1 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [drafts],
  );

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...drafts].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );

    if (category !== "All") list = list.filter((d) => d.category === category);

    return list;
  }, [drafts, query, category, fuse]);

  // Counts per category for badge
  const counts = useMemo(() => {
    const map = { All: drafts.length };
    DRAFT_CATEGORIES.forEach((c) => {
      map[c] = drafts.filter((d) => d.category === c).length;
    });
    return map;
  }, [drafts]);

  const openAdd = () => {
    setEdit(null);
    setForm(true);
  };
  const openEdit = (d) => {
    setEdit(d);
    setForm(true);
  };
  const closeForm = () => {
    setForm(false);
    setEdit(null);
  };

  return (
    <>
      <div className="space-y-5">
        {/* ── Search + Add ──────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 bg-card border border-border
                          rounded-xl px-3 py-2.5 focus-within:border-accent/60 transition-colors"
          >
            <Search size={13} className="text-muted flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drafts by title or content..."
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
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent/20 hover:bg-accent/30
                       text-accent text-xs font-semibold rounded-xl transition-colors
                       active:scale-95 flex-shrink-0"
          >
            <PlusCircle size={13} />
            New Draft
          </button>
        </div>

        {/* ── Category Filter Tabs ──────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_CATEGORIES.map((cat) => {
            const active = category === cat;
            const base =
              CATEGORY_COLORS[cat] ?? "bg-white/5 text-muted border-border";
            return (
              <button
                key={cat}
                onClick={() => setCat(cat)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
                            border font-medium transition-all duration-150
                            ${active ? base : "bg-bg text-muted border-border hover:border-border/80"}`}
              >
                {cat}
                <span
                  className={`text-2xs px-1.5 rounded-full
                              ${active ? "bg-white/20" : "bg-white/5"}`}
                >
                  {counts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Results meta ─────────────────────────────── */}
        {(query || category !== "All") && (
          <p className="text-2xs text-muted">
            {results.length} draft{results.length !== 1 ? "s" : ""}
            {query && ` matching "${query}"`}
            {category !== "All" && ` in ${category}`}
          </p>
        )}

        {/* ── Draft Grid ───────────────────────────────── */}
        {results.length === 0 ? (
          <EmptyState
            isEmpty={drafts.length === 0}
            query={query}
            category={category}
            onAdd={openAdd}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((draft) => (
              <DraftCard key={draft.id} draft={draft} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────── */}
      {formOpen && <DraftForm onClose={closeForm} editTarget={editTarget} />}
    </>
  );
}

// ── Empty State ────────────────────────────────────────────
function EmptyState({ isEmpty, query, category, onAdd }) {
  return (
    <div className="flex flex-col items-center py-16 gap-3 text-center">
      <div
        className="w-12 h-12 rounded-xl bg-card border border-border
                      flex items-center justify-center text-muted text-xl"
      >
        📄
      </div>
      <p className="text-sm font-medium text-text">
        {isEmpty
          ? "No drafts yet"
          : query
            ? `No drafts matching "${query}"`
            : `No drafts in ${category}`}
      </p>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        {isEmpty
          ? "Save your cold emails, LinkedIn messages, and follow-up templates here for one-click reuse."
          : "Try a different search term or category."}
      </p>
      {isEmpty && (
        <button
          onClick={onAdd}
          className="mt-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent
                     text-xs font-medium rounded-xl transition-colors"
        >
          Create First Draft
        </button>
      )}
    </div>
  );
}
