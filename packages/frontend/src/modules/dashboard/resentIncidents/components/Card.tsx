import { memo } from "react";
import { transformToTimeFormat } from "../../../../shared/utils/transformToTimeFormat";
import { SEVERITY_CLASSES, STATUS_CLASSES } from "../../incidentsTableConsts";

interface CardProps {
  serviceId: string;
  serviceName: string;
  title: string;
  description: string | null;
  severity: "critical" | "warning" | "info";
  status: "open" | "investigating" | "resolved";
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export const Card = memo(function Card({
  createdAt,
  description,
  title,
  updatedAt,
  serviceName,
  severity,
  status,
}: CardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-700 bg-slate-950/40 p-3 transition-colors hover:border-slate-600">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-slate-100">
            {title}
          </h3>
          <p className="mt-1 min-h-[2.5rem] line-clamp-2 text-xs leading-5 text-slate-500">
            {description ?? "No description"}
          </p>
        </div>
        <span className="whitespace-nowrap text-xs text-slate-400">
          {transformToTimeFormat(updatedAt)}
        </span>
      </div>

      <div className="mb-2 text-xs text-slate-300">
        <span className="text-slate-500">Service: </span>
        {serviceName}
      </div>

      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <span
          className={`text-xs px-2 py-1 rounded-full border ${SEVERITY_CLASSES[severity]}`}
        >
          {severity}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASSES[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="rounded-md border border-slate-700 bg-slate-900/70 px-2 py-1.5">
          <div className="text-[11px] text-slate-500">Detected</div>
          <div className="mt-0.5">{transformToTimeFormat(createdAt)}</div>
        </div>
        <div className="rounded-md border border-slate-700 bg-slate-900/70 px-2 py-1.5">
          <div className="text-[11px] text-slate-500">Updated</div>
          <div className="mt-0.5">{transformToTimeFormat(updatedAt)}</div>
        </div>
      </div>
    </article>
  );
});
