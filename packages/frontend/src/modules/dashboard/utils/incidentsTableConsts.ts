export const SEVERITY_CLASSES = {
  critical: "border-red-400/30 text-red-400 bg-red-400/10",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  info: "border-slate-600 text-slate-400 bg-slate-800",
} as const;

export const STATUS_CLASSES = {
  open: "border-red-400/30 text-red-400 bg-red-400/10",
  investigating: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  resolved: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
} as const;
