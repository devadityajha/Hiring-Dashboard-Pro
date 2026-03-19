// import { useState } from "react";
// import { Users, PlusCircle, AlertCircle } from "lucide-react";
// import { useRecruiterStore } from "../store/useRecruiterStore";
// import RecruiterList from "../components/recruiters/RecruiterList";
// import RecruiterForm from "../components/recruiters/RecruiterForm";

// export default function Recruiters() {
//   const { recruiters, getFollowUpsDue } = useRecruiterStore();
//   const [formOpen, setFormOpen] = useState(false);
//   const followUpsDue = getFollowUpsDue();

//   return (
//     <div className="space-y-5">
//       {/* ── Header ─────────────────────────────────────── */}
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <Users size={17} className="text-accent" />
//             <h2 className="page-title">Recruiters</h2>
//           </div>
//           <p className="page-subtitle">
//             {recruiters.length} contact{recruiters.length !== 1 ? "s" : ""}
//             {" · "}Anti-duplicate CRM
//           </p>
//         </div>
//         <button
//           onClick={() => setFormOpen(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30
//                      text-accent text-sm font-medium rounded-xl transition-colors active:scale-95"
//         >
//           <PlusCircle size={14} />
//           Add Recruiter
//         </button>
//       </div>

//       {/* ── Follow-up Banner ─────────────────────────── */}
//       {followUpsDue.length > 0 && (
//         <div
//           className="flex items-center gap-3 bg-warning/10 border border-warning/30
//                         rounded-xl px-4 py-3"
//         >
//           <AlertCircle size={14} className="text-warning flex-shrink-0" />
//           <p className="text-xs text-warning font-medium">
//             {followUpsDue.length} recruiter{followUpsDue.length > 1 ? "s" : ""}{" "}
//             need
//             {followUpsDue.length === 1 ? "s" : ""} a follow-up today
//           </p>
//           <div className="flex gap-1.5 flex-wrap ml-1">
//             {followUpsDue.slice(0, 3).map((r) => (
//               <span
//                 key={r.id}
//                 className="text-2xs bg-warning/15 text-warning px-2 py-0.5 rounded-full"
//               >
//                 {r.name}
//               </span>
//             ))}
//             {followUpsDue.length > 3 && (
//               <span className="text-2xs text-warning">
//                 +{followUpsDue.length - 3} more
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── Recruiter List ───────────────────────────── */}
//       <RecruiterList />

//       {/* ── Global Add Modal (from page header button) ── */}
//       {formOpen && <RecruiterForm onClose={() => setFormOpen(false)} />}
//     </div>
//   );
// }

import { useState } from "react";
import { Users, PlusCircle, AlertCircle } from "lucide-react";
import { useRecruiterStore } from "../store/useRecruiterStore";
import RecruiterList from "../components/recruiters/RecruiterList";
import RecruiterForm from "../components/recruiters/RecruiterForm";

export default function Recruiters() {
  const { recruiters, getFollowUpsDue } = useRecruiterStore();
  const [formOpen, setFormOpen] = useState(false);
  const followUpsDue = getFollowUpsDue();

  return (
    <div className="space-y-4 md:space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users size={17} className="text-accent" />
            <h2 className="page-title">Recruiters</h2>
          </div>
          <p className="page-subtitle">
            {recruiters.length} contact{recruiters.length !== 1 ? "s" : ""}
            {" · "}Anti-duplicate CRM
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-accent/20 hover:bg-accent/30
                     text-accent text-xs md:text-sm font-medium rounded-xl transition-colors
                     active:scale-95 flex-shrink-0"
        >
          <PlusCircle size={14} />
          <span className="hidden sm:inline">Add Recruiter</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Follow-up Banner ─────────────────────────── */}
      {followUpsDue.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-3 bg-warning/10 border border-warning/30
                     rounded-xl px-4 py-3"
        >
          <AlertCircle size={14} className="text-warning flex-shrink-0" />
          <p className="text-xs text-warning font-medium">
            {followUpsDue.length} recruiter{followUpsDue.length > 1 ? "s" : ""}{" "}
            need{followUpsDue.length === 1 ? "s" : ""} a follow-up today
          </p>
          <div className="flex gap-1.5 flex-wrap ml-1">
            {followUpsDue.slice(0, 3).map((r) => (
              <span
                key={r.id}
                className="text-2xs bg-warning/15 text-warning px-2 py-0.5 rounded-full"
              >
                {r.name}
              </span>
            ))}
            {followUpsDue.length > 3 && (
              <span className="text-2xs text-warning">
                +{followUpsDue.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Recruiter List ───────────────────────────── */}
      <RecruiterList />

      {/* ── Global Add Modal ─────────────────────────── */}
      {formOpen && <RecruiterForm onClose={() => setFormOpen(false)} />}
    </div>
  );
}
