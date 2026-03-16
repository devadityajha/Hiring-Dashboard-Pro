// import { Routes, Route, Navigate } from "react-router-dom";
// // import { Toaster } from "react-hot-toast";
// import AppLayout from "./components/layout/AppLayout";

// import Dashboard from "./pages/Dashboard";
// import Recruiters from "./pages/Recruiters";
// import Tasks from "./pages/Tasks";
// import Drafts from "./pages/Drafts";
// import Notes from "./pages/Notes";
// import Interviews from "./pages/Interviews";
// import Analytics from "./pages/Analytics";
// import ToastConfig from "./components/shared/ToastConfig";

// export default function App() {
//   return (
//     <>
//       <ToastConfig />

//       <Routes>
//         <Route path="/" element={<AppLayout />}>
//           <Route index element={<Navigate to="/dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="recruiters" element={<Recruiters />} />
//           <Route path="tasks" element={<Tasks />} />
//           <Route path="drafts" element={<Drafts />} />
//           <Route path="notes" element={<Notes />} />
//           <Route path="interviews" element={<Interviews />} />
//           <Route path="analytics" element={<Analytics />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </>
//   );
// }

import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Recruiters from "./pages/Recruiters";
import Tasks from "./pages/Tasks";
import Drafts from "./pages/Drafts";
import Notes from "./pages/Notes";
import Interviews from "./pages/Interviews";
import Analytics from "./pages/Analytics";

import ToastConfig from "./components/shared/ToastConfig";
import GlobalSearch from "./components/shared/GlobalSearch";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useKeyboardShortcuts([
    { key: "k", ctrl: true, handler: () => setSearchOpen(true) },
    { key: "/", handler: () => setSearchOpen(true) },
  ]);

  return (
    <>
      <ToastConfig />

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recruiters" element={<Recruiters />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="notes" element={<Notes />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
