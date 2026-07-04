import { useDashboardActions } from "../../../contexts/useDashboardActions";
import { useDashboardDataState } from "../../../contexts/useDashboardDataState";
import { useDashboardKpiModel } from "../../../modules/dashboard/utils/useDashboardKpiModel";
import { Dashboard } from "../../../modules/dashboard/ui/Dashboard";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import { LoadingState } from "./states/LoadingState";

export const Content = () => {
  const { retryNow, isRetryCooldown } = useDashboardActions();
  const {
    data,
    incidentsTrend,
    connectionStatus,
    isInitialDataTimedOut,
    lastErrorReason,
  } = useDashboardDataState();
  const kpiModel = useDashboardKpiModel(data);

  const isLoading =
    !data && connectionStatus !== "offline" && !isInitialDataTimedOut;
  const isServiceUnavailable = !data && connectionStatus === "offline";
  const isFirstPayloadTimeout = !data && isInitialDataTimedOut;

  if (isLoading) {
    return (
      <LoadingState
        title="Loading dashboard"
        message="Connecting to the backend and waiting for the first data packet..."
      />
    );
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
      incidents={data.incidents}
      recentEvents={data.recentEvents}
      {...kpiModel}
    />
  );
};
