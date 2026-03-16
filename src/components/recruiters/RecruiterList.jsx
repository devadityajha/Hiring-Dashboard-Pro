import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Fuse from "fuse.js";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import RecruiterCard from "./RecruiterCard";
import RecruiterForm from "./RecruiterForm";

const STATUSES = [
  "All",
  "Mailed",
  "Follow-Up",
  "Interviewing",
  "No Response",
  "Applied",
  "Closed",
];
const CONFIDENCES = ["All", "Hot Lead", "Warm Lead", "Cold Lead"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "followup", label: "Follow-up due" },
  { value: "name", label: "Name A–Z" },
  { value: "company", label: "Company A–Z" },
];

export default function RecruiterList() {
  const { recruiters } = useRecruiterStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [confidenceFilter, setConf] = useState("All");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Fuse search
  const fuse = useMemo(
    () =>
      new Fuse(recruiters, {
        keys: ["name", "company", "email", "linkedinUrl"],
        threshold: 0.35,
        includeScore: true,
      }),
    [recruiters],
  );

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...recruiters];

    if (statusFilter !== "All")
      list = list.filter((r) => r.status === statusFilter);
    if (confidenceFilter !== "All")
      list = list.filter((r) => r.confidence === confidenceFilter);

    switch (sort) {
      case "oldest":
        list.sort(
          (a, b) => new Date(a.dateContacted) - new Date(b.dateContacted),
        );
        break;
      case "newest":
        list.sort(
          (a, b) => new Date(b.dateContacted) - new Date(a.dateContacted),
        );
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "company":
        list.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "followup":
        list.sort(
          (a, b) =>
            new Date(a.followUpDate ?? 0) - new Date(b.followUpDate ?? 0),
        );
        break;
    }

    return list;
  }, [recruiters, query, statusFilter, confidenceFilter, sort, fuse]);

  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const openEdit = (r) => {
    setEditTarget(r);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const activeFilters =
    (statusFilter !== "All" ? 1 : 0) + (confidenceFilter !== "All" ? 1 : 0);

  return (
    <>
      {/* ── Toolbar ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 bg-card border border-border
                          rounded-xl px-3 py-2 focus-within:border-accent/60 transition-colors"
          >
            <Search size={13} className="text-muted flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, company, email..."
              className="flex-1 bg-transparent text-xs text-text placeholder-muted outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-text"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs
                        font-medium transition-colors
                        ${
                          showFilters || activeFilters > 0
                            ? "bg-accent/10 border-accent/40 text-accent"
                            : "bg-card border-border text-muted hover:text-text hover:border-border/80"
                        }`}
          >
            <SlidersHorizontal size={12} />
            Filters
            {activeFilters > 0 && (
              <span
                className="w-4 h-4 rounded-full bg-accent text-bg text-2xs
                               flex items-center justify-center font-bold"
              >
                {activeFilters}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs
                       text-muted outline-none focus:border-accent/60 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 bg-card border border-border rounded-xl p-3">
            <div className="space-y-1.5">
              <p className="text-2xs font-medium text-muted uppercase tracking-widest">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`text-2xs px-2.5 py-1 rounded-full border font-medium transition-colors
                                ${
                                  statusFilter === s
                                    ? "bg-accent/15 border-accent/40 text-accent"
                                    : "bg-bg border-border text-muted hover:border-border/80"
                                }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-2xs font-medium text-muted uppercase tracking-widest">
                Confidence
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CONFIDENCES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConf(c)}
                    className={`text-2xs px-2.5 py-1 rounded-full border font-medium transition-colors
                                ${
                                  confidenceFilter === c
                                    ? "bg-accent/15 border-accent/40 text-accent"
                                    : "bg-bg border-border text-muted hover:border-border/80"
                                }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <p className="text-2xs text-muted">
          {results.length} recruiter{results.length !== 1 ? "s" : ""}
          {query && ` matching "${query}"`}
          {statusFilter !== "All" && ` · ${statusFilter}`}
          {confidenceFilter !== "All" && ` · ${confidenceFilter}`}
        </p>
      </div>

      {/* ── Cards ────────────────────────────────────────── */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <div
            className="w-12 h-12 rounded-xl bg-card border border-border flex items-center
                          justify-center text-muted"
          >
            <Search size={20} />
          </div>
          <p className="text-sm font-medium text-text">
            {recruiters.length === 0 ? "No recruiters yet" : "No results found"}
          </p>
          <p className="text-xs text-muted max-w-xs">
            {recruiters.length === 0
              ? "Add your first recruiter to start tracking contacts."
              : "Try adjusting your search or filters."}
          </p>
          {recruiters.length === 0 && (
            <button
              onClick={openAdd}
              className="mt-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent
                         text-xs font-medium rounded-xl transition-colors"
            >
              Add First Recruiter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {results.map((r) => (
            <RecruiterCard key={r.id} recruiter={r} onEdit={openEdit} />
          ))}
        </div>
      )}

      {/* ── Form Modal ───────────────────────────────────── */}
      {formOpen && (
        <RecruiterForm onClose={closeForm} editTarget={editTarget} />
      )}
    </>
  );
}
