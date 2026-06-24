import type { FC } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type IncidentsAreaChartProps = {
  currentTotal: number;
  currentCritical: number;
  trend: Array<{
    second: string;
    timestampMs: number;
    total: number;
    critical: number;
  }>;
};

export const IncidentsAreaChart: FC<IncidentsAreaChartProps> = ({
  currentTotal,
  currentCritical,
  trend,
}) => {
  return (
    <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-200 text-lg font-semibold">
          Open incidents trend
        </h2>
        <div className="flex gap-3 text-xs">
          <span className="text-amber-400">{currentTotal} open</span>
          <span className="text-red-400">{currentCritical} critical</span>
        </div>
      </div>

      <div className="h-[320px] w-full">
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trend}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="incidentsTotalFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.04} />
                </linearGradient>
                <linearGradient
                  id="incidentsCriticalFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="second"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                tick={false}
              />
              <YAxis allowDecimals={false} stroke="#94a3b8" tickLine={false} />
              <Tooltip
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#e2e8f0",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Open"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#incidentsTotalFill)"
              />
              <Area
                type="monotone"
                dataKey="critical"
                name="Critical"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#incidentsCriticalFill)"
              />
            </AreaChart>
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
