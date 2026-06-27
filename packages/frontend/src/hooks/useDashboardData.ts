import type {
  ConnectionStatus,
  IncidentsTrendPoint,
  LastErrorReason,
} from "../types/dashboard";
import { useDashboardSocketTransport } from "./useDashboardSocketTransport";
import { useIncidentsTrend } from "./useIncidentsTrend";

const envWsUrl = import.meta.env.VITE_WS_URL?.trim();
const envWsUrlDev = import.meta.env.VITE_WS_URL_DEV?.trim();
const DEFAULT_WS_URL = import.meta.env.DEV
  ? (envWsUrlDev ?? envWsUrl)
  : envWsUrl;

type UseDashboardDataResult = {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  data: ReturnType<typeof useDashboardSocketTransport>["data"];
  incidentsTrend: IncidentsTrendPoint[];
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  nextRetryInSeconds: number | null;
  isRetryCooldown: boolean;
  retryNow: () => void;
};

export const useDashboardData = (
  url = DEFAULT_WS_URL,
): UseDashboardDataResult => {
  const {
    connectionStatus,
    data,
    isInitialDataTimedOut,
    lastErrorReason,
    nextRetryInSeconds,
    isRetryCooldown,
    retryNow,
  } = useDashboardSocketTransport(url ?? "");
  const incidentsTrend = useIncidentsTrend(data);

  return {
    isConnected: connectionStatus === "online",
    connectionStatus,
    data,
    incidentsTrend,
    isInitialDataTimedOut,
    lastErrorReason,
    nextRetryInSeconds,
    isRetryCooldown,
    retryNow,
  };
};
