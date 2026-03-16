import { useState, useRef, useEffect } from "react";
import { Trash2, Pencil, Check, X, GripVertical } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import toast from "react-hot-toast";

export default function TaskItem({ task, index }) {
  const { toggleTask, editTask, deleteTask } = useTaskStore();

  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(task.text);
  const [confirm, setConfirm] = useState(false);
  const inputRef = useRef(null);

  // Focus input when edit mode opens
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleEditSave = () => {
    const trimmed = editVal.trim();
    if (!trimmed) return;
    if (trimmed !== task.text) {
      editTask(task.id, trimmed);
      toast.success("Task updated ✓", { duration: 1200 });
    }
    setEditing(false);
  };

  const handleEditKey = (e) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") {
      setEditVal(task.text);
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    deleteTask(task.id);
    toast.success("Task removed", { duration: 1200 });
  };

  const completedAt = task.completedAt
    ? new Date(task.completedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border
                  transition-all duration-150
                  ${
                    task.completed
                      ? "bg-bg/40 border-border/40 opacity-70"
                      : "bg-card border-border hover:border-border/80"
                  }`}
    >
      {/* ── Drag Handle (visual only) ─────────────────── */}
      <GripVertical
        size={13}
        className="text-border group-hover:text-muted transition-colors
                   flex-shrink-0 cursor-grab hidden sm:block"
      />

      {/* ── Checkbox ──────────────────────────────────── */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                    flex-shrink-0 transition-all duration-150
                    ${
                      task.completed
                        ? "bg-success border-success"
                        : "border-border hover:border-accent"
                    }`}
      >
        {task.completed && (
          <Check size={11} className="text-bg" strokeWidth={3} />
        )}
      </button>

      {/* ── Text / Edit Input ─────────────────────────── */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            onKeyDown={handleEditKey}
            onBlur={handleEditSave}
            className="w-full bg-bg border border-accent/50 rounded-lg px-2 py-1
                       text-sm text-text outline-none"
          />
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm leading-relaxed break-words
                          ${
                            task.completed
                              ? "line-through text-muted"
                              : "text-text"
                          }`}
            >
              {task.text}
            </span>
            {task.completed && completedAt && (
              <span className="text-2xs text-muted/60 flex-shrink-0">
                done at {completedAt}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Action Buttons ────────────────────────────── */}
      <div
        className="flex items-center gap-1 flex-shrink-0
                      opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {!task.completed && !editing && (
          <button
            onClick={() => {
              setEditing(true);
              setEditVal(task.text);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-md
                       text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            title="Edit task"
          >
            <Pencil size={11} />
          </button>
        )}
        {editing && (
          <button
            onClick={() => {
              setEditVal(task.text);
              setEditing(false);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-md
                       text-muted hover:text-text hover:bg-white/5 transition-colors"
          >
            <X size={11} />
          </button>
        )}
        <button
          onClick={handleDelete}
          onBlur={() => setConfirm(false)}
          className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors
                      ${
                        confirm
                          ? "text-danger bg-danger/10"
                          : "text-muted hover:text-danger hover:bg-danger/10"
                      }`}
          title={confirm ? "Click again to confirm delete" : "Delete task"}
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}
