import type { FC } from "react";
import type { DashboardData } from "dashboard-shared/contracts/dashboard";
import IndicatorCard from "./IndicatorCard";
import HistoryChart from "./HistoryChart";

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: FC<DashboardProps> = ({ data }) => {
  const prevPoint =
    data.history && data.history.length >= 2
      ? data.history[data.history.length - 2]
      : undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <IndicatorCard
          title="📈 Indicator 1"
          value={data.indicator1}
          colorClass="text-blue-500"
          time={data.timestamp}
          prevValue={prevPoint?.indicator1}
        />
        <IndicatorCard
          title="📉 Indicator 2"
          value={data.indicator2}
          colorClass="text-green-500"
          time={data.timestamp}
          prevValue={prevPoint?.indicator2}
        />
      </div>
      <HistoryChart data={data} />
    </>
  );
};

export default Dashboard;
