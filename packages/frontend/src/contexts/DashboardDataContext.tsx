import { type FC, type ReactNode, useMemo } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  DashboardActionsContext,
  DashboardConnectionContext,
  DashboardDataStateContext,
} from "./dashboardDataTypes";

export const DashboardDataProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    connectionStatus,
    data,
    incidentsTrend,
    isInitialDataTimedOut,
    lastErrorReason,
    services,
    isRetryCooldown,
    retryNow,
  } = useDashboardData();

  const dataStateValue = useMemo(
    () => ({
      connectionStatus,
      data,
      incidentsTrend,
      isInitialDataTimedOut,
      lastErrorReason,
      services,
    }),
    [
      connectionStatus,
      data,
      incidentsTrend,
      isInitialDataTimedOut,
      lastErrorReason,
      services,
    ],
  );

  const connectionValue = useMemo(
    () => ({
      connectionStatus,
    }),
    [connectionStatus],
  );

  const actionsValue = useMemo(
    () => ({
      isRetryCooldown,
      retryNow,
    }),
    [isRetryCooldown, retryNow],
  );

  return (
    <DashboardActionsContext.Provider value={actionsValue}>
      <DashboardConnectionContext.Provider value={connectionValue}>
        <DashboardDataStateContext.Provider value={dataStateValue}>
          {children}
        </DashboardDataStateContext.Provider>
      </DashboardConnectionContext.Provider>
    </DashboardActionsContext.Provider>
  );
};
