const CONFIG = {
  Mailed: { bg: "bg-cyan-500/15", text: "text-cyan-400", dot: "bg-cyan-400" },
  "Follow-Up": {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  Interviewing: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  "No Response": {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    dot: "bg-slate-400",
  },
  Closed: { bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400" },
  Applied: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    dot: "bg-green-400",
  },
};

export default function StatusBadge({ value }) {
  const cfg = CONFIG[value] ?? CONFIG["Mailed"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-2xs font-medium px-2 py-0.5
                      rounded-full border border-transparent ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {value}
    </span>
  );
}
