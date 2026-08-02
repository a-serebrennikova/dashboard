import type {
  IncidentSeverity,
  IncidentStatus,
} from "@package/dashboard-shared/dashboard";

export const SEVERITY_OPTIONS: IncidentSeverity[] = [
  "critical",
  "warning",
  "info",
];

export const STATUS_OPTIONS: IncidentStatus[] = [
  "open",
  "investigating",
  "resolved",
];

export const CREATE_INCIDENT_FIELD_LIMITS = {
  title: 56,
  description: 124,
} as const;

export const selectTriggerClassName =
  "inline-flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-left text-sm text-slate-100 outline-none transition hover:border-slate-600 data-[placeholder]:text-slate-500";

export const selectContentClassName =
  "z-50 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 shadow-2xl shadow-slate-950/40";

export const selectItemClassName =
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 outline-none data-[highlighted]:bg-slate-800 data-[state=checked]:text-slate-50";
