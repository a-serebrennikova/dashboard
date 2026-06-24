import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import IndicatorCard from "./IndicatorCard";

interface DashboardProps {
  data: DashboardPayload;
}

const severityClasses = {
  critical: "border-red-400/30 text-red-400 bg-red-400/10",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  info: "border-slate-600 text-slate-400 bg-slate-800",
} as const;

const statusClasses = {
  open: "border-red-400/30 text-red-400 bg-red-400/10",
  investigating: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  resolved: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
} as const;

const Dashboard: FC<DashboardProps> = ({ data }) => {
  const activeServices = data.services.filter((service) => service.isActive);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <IndicatorCard
          title="🧩 Active services"
          value={activeServices.length}
          colorClass="text-sky-400"
          time={data.generatedAt}
        />
        <IndicatorCard
          title="🚨 Open incidents"
          value={data.snapshot.openCount}
          colorClass="text-blue-500"
          time={data.snapshot.lastUpdatedAt}
        />
        <IndicatorCard
          title="🔥 Critical incidents"
          value={data.snapshot.criticalCount}
          colorClass="text-green-500"
          time={data.snapshot.lastUpdatedAt}
        />
        <IndicatorCard
          title="⚡ Avg response time"
          value={data.snapshot.avgResponseTime}
          colorClass="text-amber-400"
          time={data.snapshot.lastUpdatedAt}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-200 text-lg font-semibold">Services</h2>
            <span className="text-slate-500 text-sm">
              {data.services.length} total
            </span>
          </div>
          <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
            {data.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-md border border-slate-700 px-3 py-2 bg-slate-950/40"
              >
                <div>
                  <div className="text-slate-100 font-medium">
                    {service.name}
                  </div>
                  <div className="text-slate-500 text-xs">{service.team}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    service.isActive
                      ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                      : "border-slate-600 text-slate-400 bg-slate-800"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-200 text-lg font-semibold">
              Recent events
            </h2>
            <span className="text-slate-500 text-sm">
              {data.recentEvents.length} items
            </span>
          </div>
          <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
            {data.recentEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-md border border-slate-700 px-3 py-2 bg-slate-950/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-slate-100 font-medium">
                    {event.message}
                  </div>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${severityClasses[event.severity ?? "info"]}`}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="mt-1 text-slate-500 text-xs">
                  {event.incidentTitle} · {event.serviceName}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-200 text-lg font-semibold">
            Open incidents
          </h2>
          <span className="text-slate-500 text-sm">
            {data.incidents.length} visible
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-xs">
              <tr>
                <th className="text-left px-3 py-2">Incident</th>
                <th className="text-left px-3 py-2">Service</th>
                <th className="text-left px-3 py-2">Severity</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.incidents.map((incident) => (
                <tr key={incident.id} className="border-t border-slate-800">
                  <td className="px-3 py-2 text-slate-100">
                    <div className="font-medium">{incident.title}</div>
                    <div className="text-slate-500 text-xs">
                      {incident.description ?? "No description"}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {incident.serviceName}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${severityClasses[incident.severity]}`}
                    >
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${statusClasses[incident.status]}`}
                    >
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
