import { Suspense, lazy, type FC } from "react";
import type { IncidentsTrendPoint } from "../../../types/dashboard";
import type { KpiSnapshot } from "../utils/useDashboardKpiModel";
import { IndicatorCard } from "./IndicatorCard";

const IncidentsAreaChart = lazy(() =>
  import("./IncidentsAreaChart").then((module) => ({
    default: module.IncidentsAreaChart,
  })),
);

interface DashboardProps {
  incidentsTrend: IncidentsTrendPoint[];
  activeServicesCount: number;
  openCount: number;
  criticalCount: number;
  avgResponseTime: number;
  generatedAt: string;
  lastUpdatedAt: string;
  previousKpi: KpiSnapshot | null;
}

export const Dashboard: FC<DashboardProps> = ({
  incidentsTrend,
  activeServicesCount,
  openCount,
  criticalCount,
  avgResponseTime,
  generatedAt,
  lastUpdatedAt,
  previousKpi,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <IndicatorCard
          title={`🧩 Active services (⚡ ${avgResponseTime} ms)`}
          value={activeServicesCount}
          prevValue={previousKpi?.activeServices}
          colorClass="text-green-400"
          time={generatedAt}
        />
        <IndicatorCard
          title="🚨 Open incidents"
          value={openCount}
          valueHint={`🔥 Critical incidents: ${criticalCount}`}
          prevValue={previousKpi?.openIncidents}
          colorClass="text-amber-400"
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
        <IncidentsAreaChart
          currentTotal={openCount}
          currentCritical={criticalCount}
          trend={incidentsTrend}
        />
      </Suspense>
    </div>
  );
};
