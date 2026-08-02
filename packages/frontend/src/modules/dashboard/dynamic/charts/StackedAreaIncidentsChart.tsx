import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type IncidentsChartPoint } from "./consts";
import { DASHBOARD_DYNAMIC_COLORS, SEVERITY_COLORS } from "../severityColors";
import { IncidentsChartTooltip } from "./IncidentsChartTooltip";

type Props = {
  data: IncidentsChartPoint[];
};

export const StackedAreaIncidentsChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 8, right: 12, left: 10, bottom: 8 }}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={DASHBOARD_DYNAMIC_COLORS.border}
      />
      <XAxis
        dataKey="x"
        type="number"
        domain={[0, 29]}
        minTickGap={36}
        interval="preserveStartEnd"
        stroke={DASHBOARD_DYNAMIC_COLORS.axisText}
        tickLine={{ stroke: DASHBOARD_DYNAMIC_COLORS.axisTickLine }}
        tick={false}
        axisLine={false}
      />
      <YAxis
        allowDecimals={false}
        stroke={DASHBOARD_DYNAMIC_COLORS.axisText}
        tickLine={false}
        axisLine={false}
        width={52}
        tickMargin={10}
        tick={{ fill: DASHBOARD_DYNAMIC_COLORS.axisText, fontSize: 13 }}
        label={{
          value: "Incident count",
          angle: -90,
          position: "insideLeft",
          offset: -4,
          style: { fill: DASHBOARD_DYNAMIC_COLORS.axisText, fontSize: 13 },
        }}
      />
      <IncidentsChartTooltip />
      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ paddingTop: 12, fontSize: 13 }}
      />
      <Area
        type="monotone"
        dataKey="critical"
        name="Critical"
        stackId="1"
        stroke={SEVERITY_COLORS.critical}
        fill={SEVERITY_COLORS.critical}
        activeDot={false}
      />
      <Area
        type="monotone"
        dataKey="warning"
        name="Warning"
        stackId="1"
        stroke={SEVERITY_COLORS.warning}
        fill={SEVERITY_COLORS.warning}
        activeDot={false}
      />
      <Area
        type="monotone"
        dataKey="other"
        name="Other"
        stackId="1"
        stroke={SEVERITY_COLORS.other}
        fill={SEVERITY_COLORS.other}
        activeDot={false}
      />
    </AreaChart>
  </ResponsiveContainer>
);
