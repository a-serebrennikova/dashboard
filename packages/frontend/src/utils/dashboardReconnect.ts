import type { ConnectionStatus } from "../types/dashboard";
import type { DashboardSocketState } from "./dashboardSocket";

type SetNextRetryInSeconds = (value: number | null) => void;
type SetConnectionStatus = (status: ConnectionStatus) => void;

export const clearReconnectTimeout = (state: DashboardSocketState) => {
  if (!state.reconnectTimeoutId) {
    return;
  }

  clearTimeout(state.reconnectTimeoutId);
  state.reconnectTimeoutId = null;
};

export const clearReconnectInterval = (state: DashboardSocketState) => {
  if (!state.reconnectIntervalId) {
    return;
  }

  clearInterval(state.reconnectIntervalId);
  state.reconnectIntervalId = null;
};

export const clearFirstPayloadTimeout = (state: DashboardSocketState) => {
  if (!state.firstPayloadTimeoutId) {
    return;
  }

  clearTimeout(state.firstPayloadTimeoutId);
  state.firstPayloadTimeoutId = null;
};

export const resetRetryState = (
  state: DashboardSocketState,
  setNextRetryInSeconds: SetNextRetryInSeconds,
) => {
  state.retryAt = null;
  clearReconnectInterval(state);
  setNextRetryInSeconds(null);
};

export const startRetryCountdown = (
  state: DashboardSocketState,
  setNextRetryInSeconds: SetNextRetryInSeconds,
) => {
  clearReconnectInterval(state);

  state.reconnectIntervalId = setInterval(() => {
    if (!state.retryAt) {
      resetRetryState(state, setNextRetryInSeconds);
      return;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((state.retryAt - Date.now()) / 1000),
    );
    setNextRetryInSeconds(remainingSeconds);

    if (remainingSeconds === 0) {
      clearReconnectInterval(state);
    }
  }, 250);
};


const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 15000;
const MAX_RECONNECT_ATTEMPTS = 8;

export const scheduleReconnect = ({
  state,
  connect,
  setConnectionStatus,
  setNextRetryInSeconds,
  maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS,
  initialRetryDelayMs = INITIAL_RETRY_DELAY_MS,
  maxRetryDelayMs = MAX_RETRY_DELAY_MS,
}: {
  state: DashboardSocketState;
  connect: () => void;
  setConnectionStatus: SetConnectionStatus;
  setNextRetryInSeconds: SetNextRetryInSeconds;
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
    resetRetryState(state, setNextRetryInSeconds);
    return;
  }

  state.reconnectAttempt += 1;
  const delay = Math.min(
    initialRetryDelayMs * 2 ** (state.reconnectAttempt - 1),
    maxRetryDelayMs,
  );

  setConnectionStatus("reconnecting");
  state.retryAt = Date.now() + delay;
  setNextRetryInSeconds(Math.ceil(delay / 1000));
  startRetryCountdown(state, setNextRetryInSeconds);
  state.reconnectTimeoutId = setTimeout(connect, delay);
};
