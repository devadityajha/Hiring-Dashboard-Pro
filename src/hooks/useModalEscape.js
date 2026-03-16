import { useEffect } from "react";

/**
 * Calls onClose when Escape is pressed.
 * Safe to use in multiple stacked modals — only the top one should register.
 */
export function useModalEscape(onClose, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    // Use capture phase so innermost modal fires first
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onClose, enabled]);
}
