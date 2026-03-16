import { useState } from "react";
import {
  Mail,
  MessageSquare,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useRecruiterStore } from "../../store/useRecruiterStore";
import toast from "react-hot-toast";

const EVENT_CONFIG = {
  "Mail Sent": { icon: Mail, color: "text-cyan-400", dot: "bg-cyan-400" },
  "Follow-up Sent": {
    icon: MessageSquare,
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  "Interview Scheduled": {
    icon: CalendarCheck,
    color: "text-purple-400",
    dot: "bg-purple-400",
  },
  "Reply Received": {
    icon: CheckCircle2,
    color: "text-green-400",
    dot: "bg-green-400",
  },
  "No Response": {
    icon: XCircle,
    color: "text-slate-400",
    dot: "bg-slate-400",
  },
  "Offer Received": {
    icon: CheckCircle2,
    color: "text-success",
    dot: "bg-success",
  },
};

const EVENT_TYPES = Object.keys(EVENT_CONFIG);

export default function InteractionTimeline({
  recruiterId,
  interactions = [],
}) {
  const { logInteraction } = useRecruiterStore();
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedEvent, setSelected] = useState("Mail Sent");
  const [note, setNote] = useState("");

  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const visible = expanded ? sorted : sorted.slice(0, 3);

  const handleAdd = () => {
    if (!selectedEvent) return;
    logInteraction(recruiterId, selectedEvent, note);
    toast.success(`${selectedEvent} logged ✓`);
    setNote("");
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-2xs font-semibold text-muted uppercase tracking-widest">
          Interaction History
        </p>
        <button
          onClick={() => setAdding((p) => !p)}
          className="flex items-center gap-1 text-2xs text-accent hover:text-accentHover transition-colors"
        >
          <Plus size={10} /> Log event
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-bg/60 border border-border rounded-xl p-3 space-y-2.5">
          <select
            value={selectedEvent}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-1.5
                       text-xs text-text outline-none focus:border-accent/60"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Optional note... (Enter to save)"
            className="w-full bg-card border border-border rounded-lg px-3 py-1.5
                       text-xs text-text placeholder-muted outline-none focus:border-accent/60"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent
                         text-xs font-medium rounded-lg transition-colors"
            >
              Log Event
            </button>
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-muted text-xs hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {interactions.length === 0 ? (
        <p className="text-2xs text-muted py-2">No interactions logged yet.</p>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-3 pl-5">
            {visible.map((item) => {
              const cfg = EVENT_CONFIG[item.event] ?? EVENT_CONFIG["Mail Sent"];
              const Icon = cfg.icon;
              const date = new Date(item.date);

              return (
                <div
                  key={item.id}
                  className="relative flex items-start gap-2.5"
                >
                  {/* Dot */}
                  <div
                    className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2
                                border-bg flex items-center justify-center ${cfg.dot}`}
                  >
                    <Icon size={7} className="text-bg" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-2xs font-semibold ${cfg.color}`}>
                        {item.event}
                      </span>
                      <span className="text-2xs text-muted flex-shrink-0">
                        {date.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        {date.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-2xs text-muted mt-0.5 leading-relaxed">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand toggle */}
          {sorted.length > 3 && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center gap-1 text-2xs text-muted hover:text-accent
                         transition-colors mt-2 pl-5"
            >
              {expanded ? (
                <>
                  <ChevronUp size={11} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={11} /> +{sorted.length - 3} more events
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
