import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

const severityClasses = {
  critical: "border-red-400/30 text-red-400 bg-red-400/10",
  warning: "border-amber-400/30 text-amber-400 bg-amber-400/10",
  info: "border-slate-600 text-slate-400 bg-slate-800",
} as const;

interface EventListProps {
  events: DashboardPayload["recentEvents"];
}

export const EventList: FC<EventListProps> = ({ events }) => (
  <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-slate-200 text-lg font-semibold">Recent events</h2>
      <span className="text-slate-500 text-sm">{events.length} items</span>
    </div>
    <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-md border border-slate-700 px-3 py-2 bg-slate-950/40"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-slate-100 font-medium">{event.message}</div>
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
);
