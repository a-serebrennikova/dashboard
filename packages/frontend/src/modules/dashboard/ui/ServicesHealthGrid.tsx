import type { FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import { getFlapCount, getUptimePercent } from "../utils/servicesHealthUtils";

type ServicesHealthGridProps = {
  services: DashboardPayload["services"];
  timeline: Record<string, number[]>;
};

export const ServicesHealthGrid: FC<ServicesHealthGridProps> = ({
  services,
  timeline,
}) => (
  <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-slate-200 text-lg font-semibold">Services health</h2>
      <span className="text-slate-500 text-sm">{services.length} nodes</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {services.map((service) => {
        const serviceTimeline = timeline[service.id] ?? [];
        const uptime = getUptimePercent(serviceTimeline);
        const flaps = getFlapCount(serviceTimeline);

        return (
          <article
            key={service.id}
            className="rounded-lg border border-slate-700 bg-slate-950/50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-100">
                  {service.name}
                </h3>
                <p className="truncate text-xs text-slate-500">
                  {service.team}
                </p>
              </div>

              <span
                className={`text-[11px] px-2 py-1 rounded-full border whitespace-nowrap ${
                  service.isActive
                    ? "border-emerald-400/30 text-emerald-400 bg-emerald-400/10"
                    : "border-slate-600 text-slate-400 bg-slate-800"
                }`}
              >
                {service.isActive ? "Healthy" : "Down"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-right text-[11px] leading-5">
                <div className="text-slate-400">
                  Uptime: {uptime === null ? "-" : `${uptime}%`}
                </div>
                <div className="text-slate-500">Flaps: {flaps}</div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);
