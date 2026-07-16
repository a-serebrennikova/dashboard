import { useMemo, useState, type FC } from "react";
import { ResponsiveContainer } from "recharts";
import {
  CHART_MODES,
  CHART_MODE_LABELS,
  type ChartMode,
  type IncidentsChartPoint,
  type IncidentsTrendInputPoint,
} from "./consts";
import { StackedAreaIncidentsChart } from "./StackedAreaIncidentsChart";
import { StackedBarIncidentsChart } from "./StackedBarIncidentsChart";
import { StepLineIncidentsChart } from "./StepLineIncidentsChart";

type IncidentsChartRendererProps = {
  data: IncidentsChartPoint[];
};

const CHART_RENDERERS: Record<ChartMode, FC<IncidentsChartRendererProps>> = {
  stacked: StackedAreaIncidentsChart,
  stackedBar: StackedBarIncidentsChart,
  step: StepLineIncidentsChart,
};

type IncidentsAreaChartProps = {
  trend: IncidentsTrendInputPoint[];
};

export const IncidentsChart: FC<IncidentsAreaChartProps> = ({ trend }) => {
  const [chartMode, setChartMode] = useState<ChartMode>("step");
  const ActiveChart = CHART_RENDERERS[chartMode];

  const chartData = useMemo(
    () =>
      trend.map((point) => ({
        ...point,
        other: Math.max(point.total - point.critical - point.warning, 0),
      })),
    [trend],
  );

  return (
    <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-slate-200 text-lg font-semibold">
            Open incidents trend
          </h2>
        </div>

        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950/70 p-1">
          {CHART_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setChartMode(mode)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                chartMode === mode
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {CHART_MODE_LABELS[mode]}
            </button>
          ))}
        </div>
      </div>

      <div className="incidents-chart h-[320px] w-full">
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ActiveChart data={chartData} />
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Waiting for realtime points...
          </div>
        )}
      </div>
    </section>
  );
};
