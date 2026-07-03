import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { formatDashboardTime } from "../../../../utils/formatDashboardTime";
import { sortTooltipItems, type IncidentsChartPoint } from "./consts";

type StackedBarIncidentsChartProps = {
  data: IncidentsChartPoint[];
};

export const StackedBarIncidentsChart: FC<StackedBarIncidentsChartProps> = ({
  data,
}) => {
  return (
    <BarChart
      data={data}
      margin={{ top: 8, right: 12, left: 24, bottom: 0 }}
      barCategoryGap="28%"
      barSize={18}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
      <XAxis
        dataKey="timestampMs"
        type="number"
        domain={["dataMin", "dataMax"]}
        padding={{ left: 16, right: 16 }}
        minTickGap={36}
        interval="preserveStartEnd"
        tickFormatter={(value) => formatDashboardTime(Number(value))}
        stroke="#94a3b8"
        tickLine={{ stroke: "#475569" }}
        axisLine={false}
        tick={{ fill: "#94a3b8", fontSize: 11 }}
      />
      <YAxis
        allowDecimals={false}
        stroke="#94a3b8"
        tickLine={false}
        axisLine={false}
        width={52}
        tickMargin={10}
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
        labelFormatter={(label) => {
          return `Time: ${formatDashboardTime(Number(label))}`;
        }}
        contentStyle={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 8,
          color: "#e2e8f0",
        }}
      />
      <Bar
        dataKey="critical"
        stackId="severity"
        name="Critical"
        fill="#ef4444"
      />
      <Bar dataKey="warning" stackId="severity" name="Warning" fill="#fde047" />
      <Bar dataKey="other" stackId="severity" name="Other" fill="#f59e0b" />
    </BarChart>
  );
};
