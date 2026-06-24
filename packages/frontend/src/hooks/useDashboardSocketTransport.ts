import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { ConnectionStatus, LastErrorReason } from "../types/dashboard";
import {
  createInitialSocketState,
  parseDashboardMessage,
  type DashboardSocketState,
} from "../utils/dashboardSocket";
import {
  clearFirstPayloadTimeout,
  clearReconnectTimeout,
  resetRetryState,
  scheduleReconnect,
} from "../utils/dashboardReconnect";

const FIRST_PAYLOAD_TIMEOUT_MS = import.meta.env.DEV ? 30000 : 10000;
const RETRY_COOLDOWN_MS = 500;

type UseDashboardSocketTransportResult = {
  connectionStatus: ConnectionStatus;
  data: DashboardPayload | null;
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  nextRetryInSeconds: number | null;
  isRetryCooldown: boolean;
  retryNow: () => void;
};

export const useDashboardSocketTransport = (
  url: string,
): UseDashboardSocketTransportResult => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [isInitialDataTimedOut, setIsInitialDataTimedOut] = useState(false);
  const [reconnectNonce, setReconnectNonce] = useState(0);
  const [isRetryCooldown, setIsRetryCooldown] = useState(false);
  const [nextRetryInSeconds, setNextRetryInSeconds] = useState<number | null>(
    null,
  );
  const [lastErrorReason, setLastErrorReason] = useState<LastErrorReason>(null);

  const socketStateRef = useRef<DashboardSocketState>(
    createInitialSocketState(),
  );

  const retryNow = useCallback(() => {
    const state = socketStateRef.current;

    if (state.manualRetryLocked) {
      return;
    }

    state.manualRetryLocked = true;
    setIsRetryCooldown(true);

    if (state.retryCooldownTimeoutId) {
      clearTimeout(state.retryCooldownTimeoutId);
    }

    state.retryCooldownTimeoutId = setTimeout(() => {
      state.manualRetryLocked = false;
      setIsRetryCooldown(false);
      state.retryCooldownTimeoutId = null;
    }, RETRY_COOLDOWN_MS);

    setReconnectNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    const state = socketStateRef.current;
    state.shouldReconnect = true;
    state.isUnmounting = false;

    const requestReconnect = (connect: () => void) => {
      scheduleReconnect({
        state,
        connect,
        setConnectionStatus,
        setNextRetryInSeconds,
      });
    };

    const handleOpen = (ws: WebSocket) => {
      if (state.isUnmounting) {
        ws.close();
        return;
      }

      state.reconnectAttempt = 0;
      state.shouldReconnect = true;
      setLastErrorReason(null);
      setConnectionStatus("online");

      clearFirstPayloadTimeout(state);
      state.firstPayloadTimeoutId = setTimeout(() => {
        if (!state.isUnmounting) {
          setIsInitialDataTimedOut(true);
          setLastErrorReason("initial_payload_timeout");
        }
      }, FIRST_PAYLOAD_TIMEOUT_MS);
    };

    const handleMessage = (event: MessageEvent) => {
      if (state.isUnmounting) {
        return;
      }

      try {
        const { type, data: nextData } = parseDashboardMessage(event.data);
        clearFirstPayloadTimeout(state);
        setIsInitialDataTimedOut(false);

        if (type === "init" || type === "update") {
          setLastErrorReason(null);
          setData(nextData);
          return;
        }

        console.error("⚠️ Unknown message type:", type);
      } catch (error) {
        console.error("❌ Parsing error:", error);
      }
    };

    const handleClose = () => {
      if (state.isUnmounting) {
        return;
      }

      if (!state.shouldReconnect) {
        setConnectionStatus("offline");
        return;
      }

      setLastErrorReason("connection_lost");
      requestReconnect(connect);
    };

    const handleError = (error: Event) => {
      if (state.isUnmounting) {
        return;
      }

      console.error("❌ WebSocket error:", error);
    };

    const connect = () => {
      clearReconnectTimeout(state);
      resetRetryState(state, setNextRetryInSeconds);
      setConnectionStatus(
        state.reconnectAttempt > 0 ? "reconnecting" : "connecting",
      );
      setIsInitialDataTimedOut(false);

      let ws: WebSocket;

      try {
        ws = new WebSocket(url);
      } catch (error) {
        console.error(`❌ Failed to open WebSocket with URL '${url}'`, error);
        setLastErrorReason("ws_open_failed");
        requestReconnect(connect);
        return;
      }

      state.ws = ws;
      ws.onopen = () => handleOpen(ws);
      ws.onmessage = handleMessage;
      ws.onclose = handleClose;
      ws.onerror = handleError;
    };

    connect();

    return () => {
      state.isUnmounting = true;
      state.shouldReconnect = false;
      clearReconnectTimeout(state);
      resetRetryState(state, setNextRetryInSeconds);
      clearFirstPayloadTimeout(state);

      if (state.retryCooldownTimeoutId) {
        clearTimeout(state.retryCooldownTimeoutId);
        state.retryCooldownTimeoutId = null;
      }

      state.manualRetryLocked = false;
      setIsRetryCooldown(false);

      if (state.ws) {
        if (
          state.ws.readyState === WebSocket.OPEN ||
          state.ws.readyState === WebSocket.CLOSING
        ) {
          state.ws.close();
        }

        state.ws = null;
      }
    };
  }, [url, reconnectNonce]);

  return {
    connectionStatus,
    data,
    isInitialDataTimedOut,
    lastErrorReason,
    nextRetryInSeconds,
    isRetryCooldown,
    retryNow,
  };
};
