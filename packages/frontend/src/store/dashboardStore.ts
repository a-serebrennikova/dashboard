import type { DashboardPayload } from "@package/dashboard-shared/dashboard";
import type { DashboardUpdatePayload } from "@package/dashboard-shared/ws";
import type {
  ConnectionStatus,
  LastErrorReason,
} from "../shared/types/dashboard";
import {
  appendTrendHistory,
  prependEvents,
  upsertIncidents,
} from "./utils/patchMergers";

export type DashboardSocketTransportState = {
  connectionStatus: ConnectionStatus;
  data: DashboardPayload | null;
  isInitialDataTimedOut: boolean;
  reconnectNonce: number;
  isRetryCooldown: boolean;
  lastErrorReason: LastErrorReason;
};

export type DashboardSocketTransportAction =
  | { type: "SET_CONNECTION_STATUS"; payload: ConnectionStatus }
  | { type: "SET_DATA"; payload: DashboardPayload }
  | { type: "APPLY_PATCH"; payload: DashboardUpdatePayload }
  | { type: "SET_INITIAL_DATA_TIMEOUT"; payload: boolean }
  | { type: "SET_RETRY_COOLDOWN"; payload: boolean }
  | { type: "SET_LAST_ERROR_REASON"; payload: LastErrorReason }
  | { type: "REQUEST_RETRY" }
  | { type: "RESET_RETRY" };

const applyPatchToData = (
  data: DashboardPayload,
  patch: DashboardUpdatePayload,
): DashboardPayload => {
  if (!patch.incidents && !patch.events && !patch.trendHistory) {
    return {
      ...data,
      generatedAt: patch.generatedAt,
    };
  }

  return {
    ...data,
    generatedAt: patch.generatedAt,
    incidents: patch.incidents
      ? upsertIncidents(data.incidents, patch.incidents)
      : data.incidents,
    events: patch.events
      ? prependEvents(data.events, patch.events)
      : data.events,
    trendHistory: patch.trendHistory
      ? appendTrendHistory(data.trendHistory, patch.trendHistory)
      : data.trendHistory,
  };
};

export const createInitialDashboardState =
  (): DashboardSocketTransportState => ({
    connectionStatus: "connecting",
    data: null,
    isInitialDataTimedOut: false,
    reconnectNonce: 0,
    isRetryCooldown: false,
    lastErrorReason: null,
  });

export const dashboardReducer = (
  state: DashboardSocketTransportState,
  action: DashboardSocketTransportAction,
): DashboardSocketTransportState => {
  switch (action.type) {
    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "APPLY_PATCH":
      if (!state.data) {
        return state;
      }

      return { ...state, data: applyPatchToData(state.data, action.payload) };
    case "SET_INITIAL_DATA_TIMEOUT":
      return { ...state, isInitialDataTimedOut: action.payload };
    case "SET_RETRY_COOLDOWN":
      return { ...state, isRetryCooldown: action.payload };
    case "SET_LAST_ERROR_REASON":
      return { ...state, lastErrorReason: action.payload };
    case "REQUEST_RETRY":
      return {
        ...state,
        reconnectNonce: state.reconnectNonce + 1,
        isRetryCooldown: true,
      };
    case "RESET_RETRY":
      return { ...state, isRetryCooldown: false };
    default:
      return state;
  }
};
