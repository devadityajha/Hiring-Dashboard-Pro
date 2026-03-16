import { useState, useCallback } from "react";

/**
 * Usage:
 *   const { confirmProps, requestConfirm } = useConfirm();
 *   await requestConfirm({ title, message, onConfirm: () => deleteItem(id) });
 *
 * Render: {confirmProps && <ConfirmModal {...confirmProps} />}
 */
export function useConfirm() {
  const [confirmProps, setConfirmProps] = useState(null);

  const requestConfirm = useCallback(
    ({ title, message, confirmLabel, variant, onConfirm }) => {
      setConfirmProps({
        title,
        message,
        confirmLabel,
        variant,
        onConfirm: () => {
          onConfirm();
          setConfirmProps(null);
        },
        onCancel: () => setConfirmProps(null),
      });
    },
    [],
  );

  return { confirmProps, requestConfirm };
}
