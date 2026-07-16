import type { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sortTooltipItems, type IncidentsChartPoint } from "./consts";
import { SEVERITY_COLORS } from "../../model/severityColors";

type StepLineIncidentsChartProps = {
  data: IncidentsChartPoint[];
};

export const StepLineIncidentsChart: FC<StepLineIncidentsChartProps> = ({
  data,
}) => {
  return (
    <LineChart data={data} margin={{ top: 8, right: 12, left: 10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis
        dataKey="x"
        type="number"
        domain={[0, 29]}
        minTickGap={36}
        interval="preserveStartEnd"
        stroke="#94a3b8"
        tickLine={{ stroke: "#475569" }}
        tick={false}
        axisLine={false}
      />
      <YAxis
        allowDecimals={false}
        stroke="#94a3b8"
        tickLine={false}
        axisLine={false}
        width={40}
        tick={{ fill: "#94a3b8", fontSize: 10 }}
        label={{
          value: "Incidents",
          angle: -90,
          position: "insideLeft",
          offset: 8,
          style: { fill: "#94a3b8", fontSize: 10 },
        }}
      />
      <Tooltip
        cursor={{
          stroke: "#64748b",
          strokeWidth: 1,
          fill: "rgba(148, 163, 184, 0.08)",
        }}
        itemSorter={sortTooltipItems}
        labelFormatter={(_, payload) =>
          `Time: ${payload?.[0]?.payload.second ?? ""}`
        }
        contentStyle={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 8,
          color: "#e2e8f0",
        }}
      />
      <Line
        type="stepBefore"
        dataKey="total"
        name="Open"
        stroke={SEVERITY_COLORS.other}
        strokeWidth={2}
        dot={false}
      />
      <Line
        type="stepBefore"
        dataKey="warning"
        name="Warning"
        stroke={SEVERITY_COLORS.warning}
        strokeWidth={2}
        dot={false}
      />
      <Line
        type="stepBefore"
        dataKey="critical"
        name="Critical"
        stroke={SEVERITY_COLORS.critical}
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
};
