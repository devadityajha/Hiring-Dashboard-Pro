import { useState } from "react";
import { Plus, Target, Check, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useCounterStore } from "../../store/useCounterStore";
import { useSettingsStore } from "../../store/useSettingsStore";

export default function DailyGoalWidget() {
  
  const { increment, getToday, setGoal } = useCounterStore();
  const { dailyGoal } = useSettingsStore();
  const today = getToday();

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(today.goal ?? dailyGoal));

  const count = today.count ?? 0;
  const goal = today.goal ?? dailyGoal ?? 10;
  const progress = Math.min((count / goal) * 100, 100);
  const done = count >= goal;

  const handleIncrement = () => {
    increment();
    toast.success("Saved ✓", {
      duration: 1500,
      style: { padding: "8px 14px", fontSize: "12px" },
    });
  };

  const handleGoalSave = () => {
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGoal(parsed);
      toast.success(`Daily goal set to ${parsed} ✓`);
    }
    setEditingGoal(false);
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-accent" />
          <p className="text-xs font-semibold text-text">Daily Goal</p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(true);
            setGoalInput(String(goal));
          }}
          className="text-muted hover:text-text transition-colors"
        >
          <Pencil size={11} />
        </button>
      </div>

      {/* Counter display */}
      <div className="flex items-end gap-1.5">
        <span
          className={`text-4xl font-bold tracking-tight ${done ? "text-success" : "text-text"}`}
        >
          {count}
        </span>
        <span className="text-lg text-muted font-medium mb-1">/ {goal}</span>
        {done && <Check size={18} className="text-success mb-1.5 ml-1" />}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500
                      ${done ? "bg-success" : "bg-accent"}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sub-label */}
      <p className="text-2xs text-muted -mt-1">
        {done
          ? "🎉 Goal reached today!"
          : `${goal - count} more to reach today's goal`}
      </p>

      {/* +1 Button */}
      <button
        onClick={handleIncrement}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
                   bg-accent/20 hover:bg-accent/30 text-accent text-sm font-semibold
                   transition-all duration-150 active:scale-95"
      >
        <Plus size={14} />
        +1 Application
      </button>

      {/* Inline goal editor */}
      {editingGoal && (
        <div className="flex items-center gap-2 mt-1">
          <input
            autoFocus
            type="number"
            min={1}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGoalSave();
              if (e.key === "Escape") setEditingGoal(false);
            }}
            className="flex-1 bg-bg border border-border rounded-lg px-3 py-1.5
                       text-xs text-text outline-none focus:border-accent/60"
          />
          <button
            onClick={handleGoalSave}
            className="px-3 py-1.5 bg-accent/20 text-accent text-xs rounded-lg hover:bg-accent/30"
          >
            Save
          </button>
          <button
            onClick={() => setEditingGoal(false)}
            className="px-3 py-1.5 text-muted text-xs hover:text-text"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
