import { Suspense, lazy, type FC } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { IncidentsTrendPoint } from "../../../types/dashboard";
import type { KpiSnapshot } from "../utils/useDashboardKpiModel";
import { IndicatorCard } from "./IndicatorCard";
import { IncidentsTable } from "./IncidentsTable";
import { EventList } from "./EventList";

const IncidentsAreaChart = lazy(() =>
  import("./charts/IncidentsChart").then((module) => ({
    default: module.IncidentsChart,
  })),
);

interface DashboardProps {
  incidentsTrend: IncidentsTrendPoint[];
  incidents: DashboardPayload["incidents"];
  recentEvents: DashboardPayload["recentEvents"];
  activeServicesCount: number;
  openCount: number;
  criticalCount: number;
  warningCount: number;
  otherCount: number;
  generatedAt: string;
  lastUpdatedAt: string;
  previousKpi: KpiSnapshot | null;
}

export const Dashboard: FC<DashboardProps> = ({
  incidentsTrend,
  incidents,
  recentEvents,
  openCount,
  criticalCount,
  warningCount,
  otherCount,
  lastUpdatedAt,
  previousKpi,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <IndicatorCard
          title="🚨 Open incidents"
          value={openCount}
          variant="highlight"
          breakdown={[
            {
              label: "Critical",
              value: criticalCount,
              className: "border-red-500/30 bg-red-500/10 text-red-300",
            },
            {
              label: "Warning",
              value: warningCount,
              className:
                "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
            },
            {
              label: "Other",
              value: otherCount,
              className:
                "border-orange-500/30 bg-orange-500/10 text-orange-300",
            },
          ]}
          prevValue={previousKpi?.openIncidents}
          colorClass="text-slate-100"
          time={lastUpdatedAt}
        />
      </div>

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

      <IncidentsTable incidents={incidents} />
      <EventList events={recentEvents} />
    </div>
  );
};
