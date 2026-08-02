import type { ConnectionStatus } from "../types/dashboard";
import type { DashboardSocketState } from "./dashboardSocket";

type SetConnectionStatus = (status: ConnectionStatus) => void;

export const clearReconnectTimeout = (state: DashboardSocketState) => {
  if (!state.reconnectTimeoutId) {
    return;
  }

  clearTimeout(state.reconnectTimeoutId);
  state.reconnectTimeoutId = null;
};

export const clearFirstPayloadTimeout = (state: DashboardSocketState) => {
  if (!state.firstPayloadTimeoutId) {
    return;
  }

  clearTimeout(state.firstPayloadTimeoutId);
  state.firstPayloadTimeoutId = null;
};

export const resetRetryState = () => {};

const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 15000;
const MAX_RECONNECT_ATTEMPTS = 8;

export const scheduleReconnect = ({
  state,
  connect,
  setConnectionStatus,
  maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS,
  initialRetryDelayMs = INITIAL_RETRY_DELAY_MS,
  maxRetryDelayMs = MAX_RETRY_DELAY_MS,
}: {
  state: DashboardSocketState;
  connect: () => void;
  setConnectionStatus: SetConnectionStatus;
  maxReconnectAttempts?: number;
  initialRetryDelayMs?: number;
  maxRetryDelayMs?: number;
}) => {
  if (!state.shouldReconnect) {
    return;
  }

  if (state.reconnectAttempt >= maxReconnectAttempts) {
    state.shouldReconnect = false;
    setConnectionStatus("offline");
    resetRetryState();
    return;
  }

  state.reconnectAttempt += 1;
  const delay = Math.min(
    initialRetryDelayMs * 2 ** (state.reconnectAttempt - 1),
    maxRetryDelayMs,
  );

  setConnectionStatus("reconnecting");
  state.reconnectTimeoutId = setTimeout(connect, delay);
};
