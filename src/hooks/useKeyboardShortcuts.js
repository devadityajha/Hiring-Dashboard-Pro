import { useEffect } from "react";

/**
 * Register multiple keyboard shortcuts in one call.
 *
 * @param {Array<{ key, ctrl, meta, shift, alt, handler, when }>} shortcuts
 * @param {Array}  deps  – extra dependencies beyond shortcuts
 *
 * Usage:
 *   useKeyboardShortcuts([
 *     { key: "k", ctrl: true,  handler: openSearch   },
 *     { key: "Escape",         handler: closeModal    },
 *     { key: "n", ctrl: true,  handler: openNewForm   },
 *   ]);
 */
export function useKeyboardShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    const handler = (e) => {
      for (const sc of shortcuts) {
        const keyMatch = e.key?.toLowerCase() === sc.key?.toLowerCase();
        const ctrlMatch = sc.ctrl ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = sc.shift ? e.shiftKey : true;
        const altMatch = sc.alt ? e.altKey : true;
        // If ctrl is specified, ensure the key isn't a free key
        const noExtra = sc.ctrl ? e.ctrlKey || e.metaKey : true;

        // Skip if modifier required and not pressed
        if (sc.ctrl && !(e.ctrlKey || e.metaKey)) continue;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Skip when typing in an input/textarea/select
          // unless the shortcut explicitly sets ignoreInputs: false
          if (sc.ignoreInputs !== false) {
            const tag = document.activeElement?.tagName;
            if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) continue;
          }

          e.preventDefault();
          sc.handler(e);
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcuts, ...deps]);
}
