import { createContext } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type {
  ConnectionStatus,
  IncidentsTrendPoint,
  LastErrorReason,
} from "../types/dashboard";

export type DashboardDataStateContextValue = {
  connectionStatus: ConnectionStatus;
  data: DashboardPayload | null;
  incidentsTrend: IncidentsTrendPoint[];
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
};

export type DashboardConnectionContextValue = {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  nextRetryInSeconds: number | null;
};

export type DashboardActionsContextValue = {
  isRetryCooldown: boolean;
  retryNow: () => void;
};

export const DashboardDataStateContext =
  createContext<DashboardDataStateContextValue | null>(null);

export const DashboardConnectionContext =
  createContext<DashboardConnectionContextValue | null>(null);

export const DashboardActionsContext =
  createContext<DashboardActionsContextValue | null>(null);
