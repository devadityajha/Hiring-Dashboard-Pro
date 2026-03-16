import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, Settings } from "lucide-react";
import GlobalSearch from "../shared/GlobalSearch";
import { useRecruiterStore } from "../../store/useRecruiterStore";

const PAGE_TITLES = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your job-search command center",
  },
  "/recruiters": {
    title: "Recruiters",
    subtitle: "CRM · Anti-duplicate contact manager",
  },
  "/tasks": { title: "Tasks", subtitle: "Daily action list" },
  "/drafts": { title: "Draft Vault", subtitle: "Reusable message templates" },
  "/notes": { title: "Notes", subtitle: "Ideas, prep notes, and research" },
  "/interviews": {
    title: "Interviews",
    subtitle: "Scheduled and completed interview tracker",
  },
  "/analytics": { title: "Analytics", subtitle: "Weekly performance overview" },
};

export default function TopBar() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { getFollowUpsDue } = useRecruiterStore();

  const current = PAGE_TITLES[location.pathname] ?? {
    title: "HireTrack Pro",
    subtitle: "",
  };
  const followUpsDue = getFollowUpsDue().length;

  // ── Ctrl+K global shortcut ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className="h-[60px] flex-shrink-0 flex items-center justify-between px-6
                         border-b border-border bg-surface/80 backdrop-blur-sm z-20"
      >
        {/* Page title */}
        <div>
          <h1 className="text-sm font-semibold text-text leading-tight">
            {current.title}
          </h1>
          <p className="text-2xs text-muted leading-tight">
            {current.subtitle}
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border
                       rounded-lg text-muted hover:text-text hover:border-border/80
                       transition-colors group"
            title="Search everywhere (Ctrl+K)"
          >
            <Search size={13} />
            <span className="text-xs hidden md:inline">Search…</span>
            <kbd
              className="hidden md:flex items-center gap-0.5 text-2xs bg-white/5
                            border border-border rounded px-1.5 py-0.5 ml-1"
            >
              <span>Ctrl</span>
              <span className="text-muted mx-0.5">+</span>
              <span>K</span>
            </kbd>
          </button>

          {/* Notifications */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-muted hover:text-text hover:bg-white/5
                       transition-colors relative"
            title={
              followUpsDue > 0
                ? `${followUpsDue} follow-up${followUpsDue > 1 ? "s" : ""} due`
                : "Notifications"
            }
          >
            <Bell size={15} />
            {followUpsDue > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[14px] h-[14px]
                               bg-warning rounded-full text-bg text-2xs font-bold
                               flex items-center justify-center px-0.5"
              >
                {followUpsDue > 9 ? "9+" : followUpsDue}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Global Search modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
