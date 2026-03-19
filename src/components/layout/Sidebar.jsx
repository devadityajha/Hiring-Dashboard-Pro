// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   CheckSquare,
//   FileText,
//   StickyNote,
//   CalendarCheck,
//   BarChart2,
//   Zap,
// } from "lucide-react";

// const NAV_ITEMS = [
//   { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
//   { to: "/recruiters", icon: Users, label: "Recruiters" },
//   { to: "/tasks", icon: CheckSquare, label: "Tasks" },
//   { to: "/drafts", icon: FileText, label: "Draft Vault" },
//   { to: "/notes", icon: StickyNote, label: "Notes" },
//   { to: "/interviews", icon: CalendarCheck, label: "Interviews" },
//   { to: "/analytics", icon: BarChart2, label: "Analytics" },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-surface overflow-y-auto">
//       {/* ── Logo ──────────────────────────────────────────── */}
//       <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-border flex-shrink-0">
//         <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
//           <Zap size={14} className="text-accent" />
//         </div>
//         <span className="text-sm font-semibold text-text tracking-wide">
//           HireTrack<span className="text-accent"> Pro</span>
//         </span>
//       </div>

//       {/* ── Navigation ────────────────────────────────────── */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">
//         <p className="text-2xs font-semibold text-muted uppercase tracking-widest px-3 mb-3">
//           Navigation
//         </p>

//         {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `nav-item ${isActive ? "nav-item-active" : ""}`
//             }
//           >
//             <Icon size={16} className="flex-shrink-0" />
//             <span>{label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* ── Footer ────────────────────────────────────────── */}
//       <div className="px-4 py-4 border-t border-border flex-shrink-0">
//         <div className="flex items-center gap-2.5">
//           <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
//             U
//           </div>
//           <div className="min-w-0">
//             <p className="text-xs font-medium text-text truncate">Job Seeker</p>
//             <p className="text-2xs text-muted truncate">Active Search</p>
//           </div>
//           <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
//         </div>
//       </div>
//     </aside>
//   );
// }

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  StickyNote,
  CalendarCheck,
  BarChart2,
  Zap,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/recruiters", icon: Users, label: "Recruiters" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/drafts", icon: FileText, label: "Draft Vault" },
  { to: "/notes", icon: StickyNote, label: "Notes" },
  { to: "/interviews", icon: CalendarCheck, label: "Interviews" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-30
        w-60 flex-shrink-0 flex flex-col
        border-r border-border bg-surface overflow-y-auto
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Zap size={14} className="text-accent" />
          </div>
          <span className="text-sm font-semibold text-text tracking-wide">
            HireTrack<span className="text-accent"> Pro</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden text-muted hover:text-text transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-2xs font-semibold text-muted uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
            U
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text truncate">Job Seeker</p>
            <p className="text-2xs text-muted truncate">Active Search</p>
          </div>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
