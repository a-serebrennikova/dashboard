import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/dashboard";
import { Card } from "./components/Card";

interface IncidentsTableProps {
  incidents: DashboardPayload["incidents"];
}

export const RecentIncidentsList: FC<IncidentsTableProps> = ({ incidents }) => {
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

      <div className="h-[520px] overflow-y-auto overscroll-y-contain pr-1">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <Card
              createdAt={incident.createdAt}
              resolvedAt={incident.resolvedAt}
              serviceId={incident.serviceId}
              key={incident.id}
              title={incident.title}
              description={incident.description}
              serviceName={incident.serviceName}
              severity={incident.severity}
              status={incident.status}
              updatedAt={incident.updatedAt}
            />
          ))}
        </div>
      </div>

      {incidents.length === 0 && (
        <div className="mt-3 flex h-36 items-center justify-center rounded-lg border border-slate-700 bg-slate-950/40 text-sm text-slate-500">
          No incidents yet.
        </div>
      )}
    </section>
  );
};
