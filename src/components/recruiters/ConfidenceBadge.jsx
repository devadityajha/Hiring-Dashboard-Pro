import { Flame, Thermometer, Snowflake } from "lucide-react";

const CONFIG = {
  "Hot Lead": {
    icon: Flame,
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  "Warm Lead": {
    icon: Thermometer,
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  "Cold Lead": {
    icon: Snowflake,
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
};

export default function ConfidenceBadge({ value, size = "sm" }) {
  const cfg = CONFIG[value] ?? CONFIG["Warm Lead"];
  const Icon = cfg.icon;
  const small = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium
                  ${cfg.bg} ${cfg.text} ${cfg.border}
                  ${small ? "text-2xs px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
    >
      <Icon size={small ? 9 : 11} />
      {value}
    </span>
  );
}
