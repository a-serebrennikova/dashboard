import { useDashboardData } from "./hooks/useDashboardData";
import Dashboard from "./components/Dashboard";
import EmptyState from "./components/EmptyState";
import StatusBadge from "./components/StatusBadge";

function App() {
  const {
    data,
    connectionStatus,
    nextRetryInSeconds,
    retryNow,
    isRetryCooldown,
  } = useDashboardData();

  return (
    <div className="px-6 pt-8 font-sans max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1>📊 Live Dashboard</h1>
        <StatusBadge
          connectionStatus={connectionStatus}
          retryInSeconds={nextRetryInSeconds}
          isRetryCooldown={isRetryCooldown}
          onRetry={retryNow}
        />
      </div>

      {data ? <Dashboard data={data} /> : <EmptyState />}
    </div>
  );
}

export default App;
