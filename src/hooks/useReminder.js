import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export function useReminder(interviews) {
  const firedRef = useRef(new Set());

  useEffect(() => {
    const timers = [];

    interviews.forEach((iv) => {
      if (
        !iv.reminderSet ||
        iv.status !== "Scheduled" ||
        firedRef.current.has(iv.id)
      )
        return;

      const now = Date.now();
      const reminderTime = new Date(iv.reminderTime).getTime();
      const interviewTime = new Date(iv.date).getTime();
      const delay = reminderTime - now;

      // Already past reminder time but interview not yet started
      if (delay <= 0 && now < interviewTime) {
        firedRef.current.add(iv.id);
        toast(
          `🎯 Interview reminder: ${iv.company} (${iv.type}) — starting soon!`,
          { duration: 10000, icon: "📅" },
        );
        return;
      }

      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        const t = setTimeout(() => {
          if (firedRef.current.has(iv.id)) return;
          firedRef.current.add(iv.id);
          toast(`🎯 Interview in 1 hour: ${iv.company} (${iv.type})`, {
            duration: 10000,
            icon: "📅",
          });
        }, delay);
        timers.push(t);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [interviews]);
}
