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
import { DynamicChartSkeleton } from "./dynamic/DynamicChartSkeleton";

const IncidentsAreaChart = lazy(() =>
  import("./dynamic/IncidentsChart").then((module) => ({
    default: module.IncidentsChart,
  })),
);

interface DashboardProps {
  incidentsTrend: IncidentsTrendPoint[];
  hasTrendHistoryLoaded: boolean;
  incidents: DashboardPayload["incidents"];
  events: DashboardPayload["events"];
  criticalCount: number;
  warningCount: number;
  otherCount: number;
  services: Service[];
}

export const Dashboard: FC<DashboardProps> = ({
  incidentsTrend,
  hasTrendHistoryLoaded,
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
          {!hasTrendHistoryLoaded ? (
            <DynamicChartSkeleton />
          ) : (
            <Suspense fallback={<DynamicChartSkeleton />}>
              <IncidentsAreaChart trend={incidentsTrend} />
            </Suspense>
          )}
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
