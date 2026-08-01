import { Suspense, lazy, type FC } from "react";
import type {
  DashboardPayload,
  Service,
} from "@package/dashboard-shared/dashboard";
import type { IncidentsTrendPoint } from "../../shared/types/dashboard";
import { RecentIncidentsList } from "./resentIncidents/RecentIncidentsList";
import { EventHistoryList } from "./incidentsHistory/EventHistoryList";
import { SeverityBreakdownCard } from "./dynamic/SeverityBreakdownCard";
import { RecentActivityCard } from "./activity/RecentActivityCard";

const IncidentsAreaChart = lazy(() =>
  import("./dynamic/IncidentsChart").then((module) => ({
    default: module.IncidentsChart,
  })),
);

interface DashboardProps {
  incidentsTrend: IncidentsTrendPoint[];
  incidents: DashboardPayload["incidents"];
  events: DashboardPayload["events"];
  criticalCount: number;
  warningCount: number;
  otherCount: number;
  services: Service[];
}

export const Dashboard: FC<DashboardProps> = ({
  incidentsTrend,
  incidents,
  events,
  criticalCount,
  warningCount,
  otherCount,
  services,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <section className="flex min-h-[420px] flex-col rounded-lg border border-slate-700 bg-slate-900 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="h-6 w-40 rounded bg-slate-800/70" />
                  <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950/70 p-1">
                    <div className="h-8 w-20 rounded-md bg-slate-800/70" />
                    <div className="ml-2 h-8 w-20 rounded-md bg-slate-800/70" />
                    <div className="ml-2 h-8 w-20 rounded-md bg-slate-800/70" />
                  </div>
                </div>
                <div className="flex min-h-[320px] flex-1 items-center justify-center text-sm text-slate-500">
                  Loading incidents chart...
                </div>
              </section>
            }
          >
            <IncidentsAreaChart trend={incidentsTrend} />
          </Suspense>
        </div>

        <SeverityBreakdownCard
          criticalCount={criticalCount}
          warningCount={warningCount}
          otherCount={otherCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="w-full lg:col-span-3">
          <RecentActivityCard events={events} />
        </div>
      </div>

      <RecentIncidentsList incidents={incidents} />
      <EventHistoryList events={events} services={services} />
    </div>
  );
};
