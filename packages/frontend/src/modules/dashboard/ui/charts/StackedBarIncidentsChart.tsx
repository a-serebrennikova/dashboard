import type { FC } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { sortTooltipItems, type IncidentsChartPoint } from "./consts";
import { SEVERITY_COLORS } from "../../model/severityColors";

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
        dataKey="x"
        type="number"
        domain={[0, 29]}
        padding={{ left: 16, right: 16 }}
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
      <Bar
        dataKey="critical"
        stackId="severity"
        name="Critical"
        fill={SEVERITY_COLORS.critical}
      />
      <Bar
        dataKey="warning"
        stackId="severity"
        name="Warning"
        fill={SEVERITY_COLORS.warning}
      />
      <Bar
        dataKey="other"
        stackId="severity"
        name="Other"
        fill={SEVERITY_COLORS.other}
      />
    </BarChart>
  );
};
