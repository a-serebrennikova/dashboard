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
import type { DashboardData } from "../types/graphTypes";

interface HistoryChartProps {
  data: DashboardData;
}

const HistoryChart = ({ data }: HistoryChartProps) => (
  <div
    style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #334155",
    }}
  >
    <h3
      style={{
        color: "#94a3b8",
        fontSize: "16px",
        marginBottom: "16px",
      }}
    >
      📊 Metrics history (last 15 points)
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.history}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#f1f5f9",
          }}
        />
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
