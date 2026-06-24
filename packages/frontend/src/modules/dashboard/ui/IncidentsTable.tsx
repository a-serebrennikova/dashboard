import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import {
  SEVERITY_CLASSES,
  STATUS_CLASSES,
} from "../utils/incidentsTableConsts";

interface IncidentsTableProps {
  incidents: DashboardPayload["incidents"];
}

export const IncidentsTable: FC<IncidentsTableProps> = ({ incidents }) => (
  <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-slate-200 text-lg font-semibold">Open incidents</h2>
      <span className="text-slate-500 text-sm">{incidents.length} visible</span>
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
          {incidents.map((incident) => (
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
                  className={`text-xs px-2 py-1 rounded-full border ${SEVERITY_CLASSES[incident.severity]}`}
                >
                  {incident.severity}
                </span>
              </td>
              <td className="px-3 py-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASSES[incident.status]}`}
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
);
