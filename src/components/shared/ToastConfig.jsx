import { Toaster } from "react-hot-toast";

export default function ToastConfig() {
  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 2500,
        style: {
          background: "#1a1b2e",
          color: "#e2e8f0",
          border: "1px solid #2d2f4a",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          padding: "10px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          maxWidth: "320px",
        },
        success: {
          duration: 2000,
          iconTheme: { primary: "#10b981", secondary: "#1a1b2e" },
        },
        error: {
          duration: 4000,
          iconTheme: { primary: "#ef4444", secondary: "#1a1b2e" },
        },
      }}
    />
  );
}
