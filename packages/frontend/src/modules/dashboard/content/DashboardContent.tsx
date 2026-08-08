import { useDashboardActions } from "../../../contexts/hooks/useDashboardActions";
import { useDashboardDataState } from "../../../contexts/hooks/useDashboardDataState";
import { countActiveIncidents } from "../../../shared/utils/countActiveIncidents";
import { Dashboard } from "../Dashboard";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import { LoadingState } from "./states/LoadingState";

export const DashboardContent = () => {
  const { retryNow, isRetryCooldown } = useDashboardActions();
  const {
    data,
    incidentsTrend,
    hasTrendHistoryLoaded,
    isLoadingData,
    connectionStatus,
    isInitialDataTimedOut,
    lastErrorReason,
    services,
  } = useDashboardDataState();

  const isServiceUnavailable = !data && connectionStatus === "offline";
  const isFirstPayloadTimeout = !data && isInitialDataTimedOut;

  const incidentCounts = data ? countActiveIncidents(data.incidents) : null;

  if (isLoadingData) {
    return <LoadingState title="Loading dashboard" />;
  }

  if (isServiceUnavailable) {
    return (
      <ErrorState
        title={
          lastErrorReason === "ws_open_failed"
            ? "Server unavailable"
            : "Connection lost"
        }
        message={
          lastErrorReason === "ws_open_failed"
            ? "Failed to open a WebSocket connection. Check that the backend is running and the URL is correct."
            : "The backend stopped responding after several recovery attempts. Please reconnect."
        }
        icon={lastErrorReason === "ws_open_failed" ? "🚫" : "🔌"}
        actionLabel="Try again"
        onAction={retryNow}
        isActionLoading={isRetryCooldown}
      />
    );
  }

  if (isFirstPayloadTimeout) {
    return (
      <EmptyState
        title="Data has not arrived yet"
        message="Connection is established, but the first data packet is delayed. Check the backend and try reconnecting."
        icon="⏱️"
        actionLabel="Reconnect"
        onAction={retryNow}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="No data yet"
        message="Connection to the backend is active, but the snapshot has not arrived yet. This state should be brief."
        icon="🫥"
        actionLabel="Try again"
        onAction={retryNow}
      />
    );
  }

  return (
    <Dashboard
      incidentsTrend={incidentsTrend}
      hasTrendHistoryLoaded={hasTrendHistoryLoaded}
      incidents={data.incidents}
      events={data.events}
      criticalCount={incidentCounts?.criticalCount ?? 0}
      warningCount={incidentCounts?.warningCount ?? 0}
      otherCount={incidentCounts?.otherCount ?? 0}
      services={services}
    />
  );
};
