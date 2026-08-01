import { memo } from "react";
import { transformToTimeFormat } from "../../../../shared/utils/transformToTimeFormat";

const severityClasses = {
  critical: "border-red-400/30 text-red-400 bg-red-400/10",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  info: "border-slate-600 text-slate-400 bg-slate-800",
} as const;

interface CardProps {
  incidentId: string;
  incidentTitle: string;
  serviceName: string;
  type: "resolved" | "created" | "updated" | "comment";
  message: string;
  severity: "info" | "critical" | "warning" | null;
  createdAt: string;
}

export const Card = memo(function Card({
  message,
  type,
  incidentTitle,
  serviceName,
  createdAt,
  severity,
}: CardProps) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-950/40 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="text-slate-100 font-medium">{message}</div>
        <span
          className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${severityClasses[severity ?? "info"]}`}
        >
          {type}
        </span>
      </div>
      <div className="mt-1 text-slate-500 text-xs">
        {incidentTitle} · {serviceName}
      </div>
      <div className="mt-1 text-slate-500 text-xs">
        {transformToTimeFormat(createdAt)}
      </div>
    </div>
  );
});
