import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * @param {string}   title
 * @param {string}   message
 * @param {string}   confirmLabel   – default "Delete"
 * @param {string}   variant        – "danger" | "warning" (default "danger")
 * @param {function} onConfirm
 * @param {function} onCancel
 */
export default function ConfirmModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  // Auto-focus confirm button
  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  // Keyboard: Esc → cancel, Enter → confirm
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onConfirm, onCancel]);

  const colors =
    variant === "danger"
      ? {
          icon: "text-danger",
          bg: "bg-danger/10",
          btn: "bg-danger/20 hover:bg-danger/30 text-danger",
        }
      : {
          icon: "text-warning",
          bg: "bg-warning/10",
          btn: "bg-warning/20 hover:bg-warning/30 text-warning",
        };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4
                 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm bg-surface border border-border rounded-2xl
                      shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center
                             flex-shrink-0 ${colors.bg}`}
            >
              <AlertTriangle size={16} className={colors.icon} />
            </div>
            <h3 className="text-sm font-semibold text-text">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-6 h-6 flex items-center justify-center rounded-md
                       text-muted hover:text-text hover:bg-white/5 transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Body */}
        <p className="px-5 pb-5 text-xs text-muted leading-relaxed">
          {message}
        </p>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions */}
        <div className="flex items-center gap-2 px-5 py-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-xs font-medium text-muted
                       hover:text-text hover:bg-white/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl
                        transition-all active:scale-[0.98] ${colors.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
