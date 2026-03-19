// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import TopBar from "./TopBar";
// import QuickCaptureBar from "./QuickCaptureBar";

// export default function AppLayout() {
//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-bg">
//       {/* ── Fixed Sidebar ─────────────────────────────────── */}
//       <Sidebar />

//       {/* ── Main Column ───────────────────────────────────── */}
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         {/* Fixed TopBar */}
//         <TopBar />

//         {/* Quick Capture — sits below TopBar, above content */}
//         <QuickCaptureBar />

//         {/* Scrollable Page Content */}
//         <main className="flex-1 overflow-y-auto bg-bg">
//           <div className="max-w-7xl mx-auto px-6 py-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import QuickCaptureBar from "./QuickCaptureBar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <QuickCaptureBar />
        <main className="flex-1 overflow-y-auto bg-bg">
          <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
