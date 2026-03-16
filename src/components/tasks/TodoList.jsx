import { useState, useRef } from "react";
import { Plus, CheckSquare, Inbox, Trash2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTaskStore } from "../../store/useTaskStore";
import TaskItem from "./TaskItem";

const FILTERS = ["All", "Active", "Completed"];

export default function TodoList() {
  const { tasks, addTask, clearCompleted, getActiveTasks, getCompletedTasks } =
    useTaskStore();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("Active");
  const [confirmClear, setConfirmClear] = useState(false);
  const inputRef = useRef(null);

  // ── Derived lists ─────────────────────────────────────
  const activeList = getActiveTasks();
  const completedList = getCompletedTasks();
  const visibleList =
    filter === "Active"
      ? activeList
      : filter === "Completed"
        ? completedList
        : tasks;

  // ── Add task ──────────────────────────────────────────
  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTask(text);
    setInput("");
    toast.success("Task added ✓", {
      duration: 1200,
      style: { padding: "8px 14px", fontSize: "12px" },
    });
    inputRef.current?.focus();
  };

  const handleInputKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // ── Clear completed ───────────────────────────────────
  const handleClearCompleted = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearCompleted();
    setConfirmClear(false);
    toast.success(
      `${completedList.length} completed task${completedList.length > 1 ? "s" : ""} cleared`,
    );
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* ── Add Input ───────────────────────────────────── */}
      <div
        className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3
                      focus-within:border-accent/60 transition-colors"
      >
        <Plus size={15} className="text-muted flex-shrink-0" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKey}
          placeholder="Add a task — press Enter to save..."
          className="flex-1 bg-transparent text-sm text-text placeholder-muted outline-none"
          autoFocus
        />
        {input.trim() && (
          <button
            onClick={handleAdd}
            className="flex-shrink-0 px-3 py-1 bg-accent/20 hover:bg-accent/30
                       text-accent text-xs font-medium rounded-lg transition-colors"
          >
            Add
          </button>
        )}
      </div>

      {/* ── Filter Tabs + Stats ─────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Tabs */}
        <div className="flex items-center bg-card border border-border rounded-xl p-1 gap-0.5">
          {FILTERS.map((f) => {
            const count =
              f === "Active"
                ? activeList.length
                : f === "Completed"
                  ? completedList.length
                  : tasks.length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                            font-medium transition-all duration-150
                            ${
                              filter === f
                                ? "bg-accent/15 text-accent"
                                : "text-muted hover:text-text"
                            }`}
              >
                {f}
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded-full font-bold
                              ${
                                filter === f
                                  ? "bg-accent/20 text-accent"
                                  : "bg-white/5 text-muted"
                              }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clear completed */}
        {completedList.length > 0 && (
          <button
            onClick={handleClearCompleted}
            onBlur={() => setConfirmClear(false)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl
                        border transition-colors
                        ${
                          confirmClear
                            ? "bg-danger/10 border-danger/30 text-danger"
                            : "bg-card border-border text-muted hover:text-danger hover:border-danger/30"
                        }`}
          >
            <Trash2 size={11} />
            {confirmClear
              ? "Confirm clear?"
              : `Clear ${completedList.length} done`}
          </button>
        )}
      </div>

      {/* ── Task List ───────────────────────────────────── */}
      {visibleList.length === 0 ? (
        <EmptyState filter={filter} onFocus={() => inputRef.current?.focus()} />
      ) : (
        <div className="space-y-2">
          {/* Active section header (only in "All" view) */}
          {filter === "All" && activeList.length > 0 && (
            <SectionLabel
              icon={CheckSquare}
              label="Active"
              count={activeList.length}
              color="text-accent"
            />
          )}

          {/* Active tasks */}
          {(filter === "All" || filter === "Active") &&
            activeList.map((t, i) => (
              <TaskItem key={t.id} task={t} index={i} />
            ))}

          {/* Completed section header (only in "All" view) */}
          {filter === "All" && completedList.length > 0 && (
            <SectionLabel
              icon={CheckCheck}
              label="Completed"
              count={completedList.length}
              color="text-success"
              className="mt-4"
            />
          )}

          {/* Completed tasks */}
          {(filter === "All" || filter === "Completed") &&
            completedList.map((t, i) => (
              <TaskItem key={t.id} task={t} index={i} />
            ))}
        </div>
      )}

      {/* ── Footer Summary ──────────────────────────────── */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-2xs text-muted">
            {activeList.length} task{activeList.length !== 1 ? "s" : ""}{" "}
            remaining
          </p>
          {tasks.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{
                    width: tasks.length
                      ? `${(completedList.length / tasks.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <span className="text-2xs text-muted">
                {tasks.length
                  ? Math.round((completedList.length / tasks.length) * 100)
                  : 0}
                %
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function SectionLabel({ icon: Icon, label, count, color, className = "" }) {
  return (
    <div className={`flex items-center gap-2 py-1 ${className}`}>
      <Icon size={12} className={color} />
      <span
        className={`text-2xs font-semibold uppercase tracking-widest ${color}`}
      >
        {label}
      </span>
      <span className="text-2xs text-muted">({count})</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function EmptyState({ filter, onFocus }) {
  const CONFIG = {
    Active: {
      icon: CheckSquare,
      title: "No active tasks",
      sub: "Press Enter in the input above to add your first task.",
      cta: "Add a task",
    },
    Completed: {
      icon: CheckCheck,
      title: "Nothing completed yet",
      sub: "Complete a task to see it here.",
      cta: null,
    },
    All: {
      icon: Inbox,
      title: "Task list is empty",
      sub: "Add your daily job-search actions here.",
      cta: "Add a task",
    },
  };

  const cfg = CONFIG[filter] ?? CONFIG.All;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center py-14 gap-3 text-center">
      <div
        className="w-12 h-12 rounded-xl bg-card border border-border
                      flex items-center justify-center text-muted"
      >
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-text">{cfg.title}</p>
      <p className="text-xs text-muted max-w-xs leading-relaxed">{cfg.sub}</p>
      {cfg.cta && (
        <button
          onClick={onFocus}
          className="mt-1 text-xs text-accent hover:underline"
        >
          {cfg.cta} →
        </button>
      )}
    </div>
  );
}
