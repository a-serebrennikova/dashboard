import { createContext } from "react";
import type {
  CreateIncidentInput,
  DashboardPayload,
  Service,
} from "@package/dashboard-shared/dashboard";
import type {
  ConnectionStatus,
  IncidentsTrendPoint,
  LastErrorReason,
} from "../shared/types/dashboard";

export type DashboardDataStateContextValue = {
  connectionStatus: ConnectionStatus;
  data: DashboardPayload | null;
  incidentsTrend: IncidentsTrendPoint[];
  hasTrendHistoryLoaded: boolean;
  isLoadingData: boolean;
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  services: Service[];
};

export type DashboardConnectionContextValue = {
  connectionStatus: ConnectionStatus;
};

export type DashboardActionsContextValue = {
  createIncident: (input: CreateIncidentInput) => Promise<void>;
  isCreateIncidentSubmitting: boolean;
  isRetryCooldown: boolean;
  retryNow: () => void;
};

export const DashboardDataStateContext =
  createContext<DashboardDataStateContextValue | null>(null);

export const DashboardConnectionContext =
  createContext<DashboardConnectionContextValue | null>(null);

export const DashboardActionsContext =
  createContext<DashboardActionsContextValue | null>(null);
