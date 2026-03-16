import { CheckSquare } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import TodoList from "../components/tasks/TodoList";

export default function Tasks() {
  const { getActiveTasks, getCompletedTasks } = useTaskStore();
  const active = getActiveTasks().length;
  const completed = getCompletedTasks().length;

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <CheckSquare size={17} className="text-accent" />
          <h2 className="page-title">Tasks</h2>
        </div>
        <p className="page-subtitle">
          {active} active · {completed} completed — press Enter to add quickly
        </p>
      </div>

      {/* ── Todo List ──────────────────────────────────── */}
      <TodoList />
    </div>
  );
}
