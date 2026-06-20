import { useDashboardData } from "./hooks/useDashboardData";
import Dashboard from "./components/Dashboard";
import EmptyState from "./components/EmptyState";
import StatusBadge from "./components/StatusBadge";
import "./App.css";

function App() {
  const { data, isConnected } = useDashboardData();

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1>📊 Live Dashboard</h1>
        <StatusBadge isConnected={isConnected} />
      </div>

      {data ? <Dashboard data={data} /> : <EmptyState />}
    </div>
  );
}

export default App;
