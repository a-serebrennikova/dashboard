import { Suspense, lazy, type FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { IncidentsTrendPoint } from "../../../types/dashboard";
import { IncidentsTable } from "./IncidentsTable";
import { EventList } from "./EventList";
import { SeverityBreakdownCard } from "./cards/SeverityBreakdownCard";
import { RecentActivityCard } from "./cards/RecentActivityCard";

const IncidentsAreaChart = lazy(() =>
  import("./charts/IncidentsChart").then((module) => ({
    default: module.IncidentsChart,
  })),
);

interface DashboardProps {
  incidentsTrend: IncidentsTrendPoint[];
  incidents: DashboardPayload["incidents"];
  recentEvents: DashboardPayload["recentEvents"];
  criticalCount: number;
  warningCount: number;
  otherCount: number;
}

export const Dashboard: FC<DashboardProps> = ({
  incidentsTrend,
  incidents,
  recentEvents,
  criticalCount,
  warningCount,
  otherCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Charts and Insights - 2 Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend Chart - 2 columns */}
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <div className="h-[320px] flex items-center justify-center text-sm text-slate-500">
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

      {/* System Health & Quick Actions & Recent Activity - 3 Column */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* TODO implement */}
        {/* <SystemHealthCard
          activeServicesCount={activeServicesCount}
          openCount={openCount}
          resolvedTodayCount={resolvedTodayCount}
        /> */}
        {/* <QuickActionsCard /> */}

        <div className="w-full lg:col-span-3">
          <RecentActivityCard events={recentEvents} />
        </div>
      </div>

      {/* Tables - Full Width */}
      <div className="space-y-6">
        <IncidentsTable incidents={incidents} />
        <EventList events={recentEvents} />
      </div>
    </div>
  );
};
