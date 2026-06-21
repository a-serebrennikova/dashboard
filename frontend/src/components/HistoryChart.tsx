import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardData, HistoryPoint } from "../types/graphTypes";

interface HistoryChartProps {
  data: DashboardData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: HistoryPoint }>;
  label?: string;
}

const HistoryChart = ({ data }: HistoryChartProps) => (
  <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 w-full">
    <h3 className="text-slate-400 text-base mb-4">
      📊 Metrics history (last 15 points)
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.history}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="indicator1"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6" }}
          name="Indicator 1"
        />
        <Line
          type="monotone"
          dataKey="indicator2"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: "#22c55e" }}
          name="Indicator 2"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default HistoryChart;

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white">
      <div className="text-slate-400 mb-1">{label}</div>
      <div>
        Indicator 1: <span className="text-blue-400">{point.indicator1}</span>
      </div>
      <div>
        Indicator 2: <span className="text-green-400">{point.indicator2}</span>
      </div>
    </div>
  );
}
