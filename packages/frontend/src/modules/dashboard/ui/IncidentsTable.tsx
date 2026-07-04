import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import {
  SEVERITY_CLASSES,
  STATUS_CLASSES,
} from "../utils/incidentsTableConsts";
import { transformToTimeFormat } from "../../../utils/transformToTimeFormat";
import { toDashboardTimestamp } from "../../../utils/formatDashboardTime";

interface IncidentsTableProps {
  incidents: DashboardPayload["incidents"];
}

export const IncidentsTable: FC<IncidentsTableProps> = ({ incidents }) => {
  const sortedIncidents = [...incidents].sort(
    (a, b) =>
      (toDashboardTimestamp(b.updatedAt) ?? Number.NEGATIVE_INFINITY) -
      (toDashboardTimestamp(a.updatedAt) ?? Number.NEGATIVE_INFINITY),
  );

  return (
    <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="mb-4">
        <div>
          <h2 className="text-slate-200 text-lg font-semibold">
            Latest incidents
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Current state by incident, sorted by last update
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedIncidents.map((incident) => (
          <article
            key={incident.id}
            className="rounded-lg border border-slate-700 bg-slate-950/40 p-3 transition-colors hover:border-slate-600"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-slate-100">
                  {incident.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {incident.description ?? "No description"}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-400">
                {transformToTimeFormat(incident.updatedAt)}
              </span>
            </div>

            <div className="mb-2 text-xs text-slate-300">
              <span className="text-slate-500">Service: </span>
              {incident.serviceName}
            </div>

            <div className="mb-2 flex flex-wrap gap-2 text-xs">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${SEVERITY_CLASSES[incident.severity]}`}
              >
                {incident.severity}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASSES[incident.status]}`}
              >
                {incident.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="rounded-md border border-slate-700 bg-slate-900/70 px-2 py-1.5">
                <div className="text-[11px] text-slate-500">Detected</div>
                <div className="mt-0.5">
                  {transformToTimeFormat(incident.createdAt)}
                </div>
              </div>
              <div className="rounded-md border border-slate-700 bg-slate-900/70 px-2 py-1.5">
                <div className="text-[11px] text-slate-500">Updated</div>
                <div className="mt-0.5">
                  {transformToTimeFormat(incident.updatedAt)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {sortedIncidents.length === 0 && (
        <div className="mt-3 flex h-36 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/40 text-sm text-slate-500">
          No incidents yet.
        </div>
      )}
    </section>
  );
};
