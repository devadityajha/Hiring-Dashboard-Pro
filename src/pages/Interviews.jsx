// import { useState } from "react";
// import { CalendarCheck, PlusCircle } from "lucide-react";
// import { useInterviewStore } from "../store/useInterviewStore";
// import InterviewList from "../components/interviews/InterviewList";
// import InterviewForm from "../components/interviews/InterviewForm";

// export default function Interviews() {
//   const { interviews, getStats } = useInterviewStore();
//   const [formOpen, setFormOpen] = useState(false);
//   const stats = getStats();

//   return (
//     <div className="space-y-5">
//       {/* ── Header ─────────────────────────────────────── */}
//       <div className="flex items-start justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <CalendarCheck size={17} className="text-accent" />
//             <h2 className="page-title">Interviews</h2>
//           </div>
//           <p className="page-subtitle">
//             {stats.scheduled > 0
//               ? `${stats.scheduled} scheduled · ${stats.completed} completed`
//               : "Track and manage all your interviews"}
//           </p>
//         </div>
//         <button
//           onClick={() => setFormOpen(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30
//                      text-accent text-sm font-medium rounded-xl transition-colors
//                      active:scale-95"
//         >
//           <PlusCircle size={14} />
//           Schedule Interview
//         </button>
//       </div>

//       {/* ── List ───────────────────────────────────────── */}
//       <InterviewList onAdd={() => setFormOpen(true)} />

//       {/* ── Add Modal ──────────────────────────────────── */}
//       {formOpen && <InterviewForm onClose={() => setFormOpen(false)} />}
//     </div>
//   );
// }

import { useState } from "react";
import { CalendarCheck, PlusCircle } from "lucide-react";
import { useInterviewStore } from "../store/useInterviewStore";
import InterviewList from "../components/interviews/InterviewList";
import InterviewForm from "../components/interviews/InterviewForm";

export default function Interviews() {
  const { interviews, getStats } = useInterviewStore();
  const [formOpen, setFormOpen] = useState(false);
  const stats = getStats();

  return (
    <div className="space-y-4 md:space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck size={17} className="text-accent" />
            <h2 className="page-title">Interviews</h2>
          </div>
          <p className="page-subtitle">
            {stats.scheduled > 0
              ? `${stats.scheduled} scheduled · ${stats.completed} completed`
              : "Track and manage all your interviews"}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-accent/20 hover:bg-accent/30
                     text-accent text-xs md:text-sm font-medium rounded-xl transition-colors
                     active:scale-95 flex-shrink-0"
        >
          <PlusCircle size={14} />
          <span className="hidden sm:inline">Schedule Interview</span>
          <span className="sm:hidden">Schedule</span>
        </button>
      </div>

      {/* ── List ───────────────────────────────────────── */}
      <InterviewList onAdd={() => setFormOpen(true)} />

      {/* ── Add Modal ──────────────────────────────────── */}
      {formOpen && <InterviewForm onClose={() => setFormOpen(false)} />}
    </div>
  );
}
