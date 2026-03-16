import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import QuickCaptureBar from "./QuickCaptureBar";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg">
      {/* ── Fixed Sidebar ─────────────────────────────────── */}
      <Sidebar />

      {/* ── Main Column ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Fixed TopBar */}
        <TopBar />

        {/* Quick Capture — sits below TopBar, above content */}
        <QuickCaptureBar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-bg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
