import { useCallback, useEffect, useRef, useState } from "react";
import { webSocketMessageSchema } from "@package/dashboard-shared/contracts/ws";
import type {
  ConnectionStatus,
  WebSocketMessage,
} from "@package/dashboard-shared/contracts/ws";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

const envWsUrl = import.meta.env.VITE_WS_URL?.trim();
const envWsUrlDev = import.meta.env.VITE_WS_URL_DEV?.trim();
const DEFAULT_WS_URL = import.meta.env.DEV
  ? (envWsUrlDev ?? envWsUrl)
  : envWsUrl;

const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 15000;
const MAX_RECONNECT_ATTEMPTS = 8;
const RETRY_COOLDOWN_MS = 500;

type DashboardSocketState = {
  ws: WebSocket | null;
  reconnectTimeoutId: ReturnType<typeof setTimeout> | null;
  reconnectIntervalId: ReturnType<typeof setInterval> | null;
  retryCooldownTimeoutId: ReturnType<typeof setTimeout> | null;
  reconnectAttempt: number;
  shouldReconnect: boolean;
  retryAt: number | null;
  isUnmounting: boolean;
  manualRetryLocked: boolean;
};

export function useDashboardData(url = DEFAULT_WS_URL) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [reconnectNonce, setReconnectNonce] = useState(0);
  const [isRetryCooldown, setIsRetryCooldown] = useState(false);

  const socketStateRef = useRef<DashboardSocketState>({
    ws: null,
    reconnectTimeoutId: null,
    reconnectIntervalId: null,
    retryCooldownTimeoutId: null,
    reconnectAttempt: 0,
    shouldReconnect: true,
    retryAt: null,
    isUnmounting: false,
    manualRetryLocked: false,
  });

  const [nextRetryInSeconds, setNextRetryInSeconds] = useState<number | null>(
    null,
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

    const clearReconnectTimeout = () => {
      if (!state.reconnectTimeoutId) {
        return;
      }
      clearTimeout(state.reconnectTimeoutId);
      state.reconnectTimeoutId = null;
    };

    const clearReconnectInterval = () => {
      if (!state.reconnectIntervalId) {
        return;
      }
      clearInterval(state.reconnectIntervalId);
      state.reconnectIntervalId = null;
    };

    const resetRetryState = () => {
      state.retryAt = null;
      clearReconnectInterval();
      setNextRetryInSeconds(null);
    };

    const startRetryCountdown = () => {
      clearReconnectInterval();

      state.reconnectIntervalId = setInterval(() => {
        if (!state.retryAt) {
          resetRetryState();
          return;
        }

        const remainingSeconds = Math.max(
          0,
          Math.ceil((state.retryAt - Date.now()) / 1000),
        );
        setNextRetryInSeconds(remainingSeconds);

        if (remainingSeconds === 0) {
          clearReconnectInterval();
        }
      }, 250);
    };

    const scheduleReconnect = () => {
      if (!state.shouldReconnect) {
        return;
      }

      if (state.reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
        state.shouldReconnect = false;
        setConnectionStatus("offline");
        resetRetryState();
        return;
      }

      state.reconnectAttempt += 1;
      const delay = Math.min(
        INITIAL_RETRY_DELAY_MS * 2 ** (state.reconnectAttempt - 1),
        MAX_RETRY_DELAY_MS,
      );

      setConnectionStatus("reconnecting");
      state.retryAt = Date.now() + delay;
      setNextRetryInSeconds(Math.ceil(delay / 1000));
      startRetryCountdown();
      state.reconnectTimeoutId = setTimeout(connect, delay);
    };

    const connect = () => {
      clearReconnectTimeout();
      resetRetryState();
      setConnectionStatus(
        state.reconnectAttempt > 0 ? "reconnecting" : "connecting",
      );

      let ws: WebSocket;

      try {
        ws = new WebSocket(url);
      } catch (error) {
        console.error(`❌ Failed to open WebSocket with URL '${url}'`, error);
        scheduleReconnect();
        return;
      }

      state.ws = ws;

      ws.onopen = () => {
        if (state.isUnmounting) {
          ws.close();
          return;
        }

        state.reconnectAttempt = 0;
        state.shouldReconnect = true;
        setConnectionStatus("online");
      };

      ws.onmessage = (event: MessageEvent) => {
        if (state.isUnmounting) {
          return;
        }

        try {
          const rawMessage = JSON.parse(event.data);
          const parseResult = webSocketMessageSchema.safeParse(rawMessage);

          if (!parseResult.success) {
            console.error("Invalid message format", parseResult.error.format());
            return;
          }

          const { type, data }: WebSocketMessage = parseResult.data;

          if (type === "init" || type === "update") {
            setData(data);
          } else {
            console.error("⚠️ Unknown message type:", type);
          }
        } catch (error) {
          console.error("❌ Parsing error:", error);
        }
      };

      ws.onclose = () => {
        if (state.isUnmounting) {
          return;
        }

        if (!state.shouldReconnect) {
          setConnectionStatus("offline");
          return;
        }
        scheduleReconnect();
      };

      ws.onerror = (error: Event) => {
        if (state.isUnmounting) {
          return;
        }

        console.error("❌ WebSocket error:", error);
      };
    };

    connect();

    return () => {
      state.isUnmounting = true;
      state.shouldReconnect = false;
      clearReconnectTimeout();
      resetRetryState();
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
      setConnectionStatus("offline");
    };
  }, [url, reconnectNonce]);

  return {
    isConnected: connectionStatus === "online",
    connectionStatus,
    data,
    nextRetryInSeconds,
    isRetryCooldown,
    retryNow,
  };
}
