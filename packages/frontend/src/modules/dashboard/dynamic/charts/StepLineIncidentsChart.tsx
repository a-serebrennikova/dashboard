import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export const StepLineIncidentsChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 8, right: 12, left: 10, bottom: 8 }}>
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
      <IncidentsChartTooltip
        cursor={{
          stroke: DASHBOARD_DYNAMIC_COLORS.lineCursorStroke,
          strokeWidth: 1,
          fill: DASHBOARD_DYNAMIC_COLORS.lineCursorFill,
        }}
      />
      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ paddingTop: 12, fontSize: 13 }}
      />
      <Line
        type="stepBefore"
        dataKey="critical"
        name="Critical"
        stroke={SEVERITY_COLORS.critical}
        strokeWidth={2}
        dot={false}
        activeDot={false}
      />
      <Line
        type="stepBefore"
        dataKey="warning"
        name="Warning"
        stroke={SEVERITY_COLORS.warning}
        strokeWidth={2}
        dot={false}
        activeDot={false}
      />
      <Line
        type="stepBefore"
        dataKey="other"
        name="Other"
        stroke={SEVERITY_COLORS.other}
        strokeWidth={2}
        dot={false}
        activeDot={false}
      />
    </LineChart>
  </ResponsiveContainer>
);
