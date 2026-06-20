import type { FC } from "react";
import type { DashboardData } from "../types/graphTypes";
import IndicatorCard from "./IndicatorCard";
import HistoryChart from "./HistoryChart";

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: FC<DashboardProps> = ({ data }) => (
  <>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <IndicatorCard
        title="📈 Indicator 1"
        value={data.indicator1}
        color="#3b82f6"
      />
      <IndicatorCard
        title="📉 Indicator 2"
        value={data.indicator2}
        color="#22c55e"
      />
    </div>
    <HistoryChart data={data} />
  </>
);

export default Dashboard;
