import { useCallback, useEffect, useRef, useState } from "react";
import { webSocketMessageSchema } from "dashboard-shared/contracts/ws";
import type {
  ConnectionStatus,
  DashboardData,
  WebSocketMessage,
} from "../types/graphTypes";

const envWsUrl = import.meta.env.VITE_WS_URL?.trim();
const envWsUrlDev = import.meta.env.VITE_WS_URL_DEV?.trim();
const DEFAULT_WS_URL = import.meta.env.DEV
  ? (envWsUrlDev ?? envWsUrl)
  : envWsUrl;

const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 15000;
const MAX_RECONNECT_ATTEMPTS = 8;
const RETRY_COOLDOWN_MS = 500;

export function useDashboardData(url = DEFAULT_WS_URL) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [data, setData] = useState<DashboardData | null>(null);
  const [reconnectNonce, setReconnectNonce] = useState(0);
  const [isRetryCooldown, setIsRetryCooldown] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const retryCooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const manualRetryLockedRef = useRef(false);
  const retryAtRef = useRef<number | null>(null);
  const [nextRetryInSeconds, setNextRetryInSeconds] = useState<number | null>(
    null,
  );

  const retryNow = useCallback(() => {
    if (manualRetryLockedRef.current) {
      return;
    }

    manualRetryLockedRef.current = true;
    setIsRetryCooldown(true);
    if (retryCooldownTimeoutRef.current) {
      clearTimeout(retryCooldownTimeoutRef.current);
    }
    retryCooldownTimeoutRef.current = setTimeout(() => {
      manualRetryLockedRef.current = false;
      setIsRetryCooldown(false);
      retryCooldownTimeoutRef.current = null;
    }, RETRY_COOLDOWN_MS);

    setReconnectNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const clearReconnectTimeout = () => {
      if (!reconnectTimeoutRef.current) {
        return;
      }
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    };

    const clearReconnectInterval = () => {
      if (!reconnectIntervalRef.current) {
        return;
      }
      clearInterval(reconnectIntervalRef.current);
      reconnectIntervalRef.current = null;
    };

    const resetRetryState = () => {
      retryAtRef.current = null;
      clearReconnectInterval();
      setNextRetryInSeconds(null);
    };

    const startRetryCountdown = () => {
      clearReconnectInterval();

      reconnectIntervalRef.current = setInterval(() => {
        if (!retryAtRef.current) {
          resetRetryState();
          return;
        }

        const remainingSeconds = Math.max(
          0,
          Math.ceil((retryAtRef.current - Date.now()) / 1000),
        );
        setNextRetryInSeconds(remainingSeconds);

        if (remainingSeconds === 0) {
          clearReconnectInterval();
        }
      }, 250);
    };

    const scheduleReconnect = () => {
      if (!shouldReconnectRef.current) {
        return;
      }

      if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
        shouldReconnectRef.current = false;
        setConnectionStatus("offline");
        resetRetryState();
        return;
      }

      reconnectAttemptRef.current += 1;
      const delay = Math.min(
        INITIAL_RETRY_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1),
        MAX_RETRY_DELAY_MS,
      );

      setConnectionStatus("reconnecting");
      retryAtRef.current = Date.now() + delay;
      setNextRetryInSeconds(Math.ceil(delay / 1000));
      startRetryCountdown();
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    const connect = () => {
      clearReconnectTimeout();
      resetRetryState();
      setConnectionStatus(
        reconnectAttemptRef.current > 0 ? "reconnecting" : "connecting",
      );

      let ws: WebSocket;

      try {
        ws = new WebSocket(url);
      } catch (error) {
        console.error(`❌ Failed to open WebSocket with URL '${url}'`, error);
        scheduleReconnect();
        return;
      }

      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptRef.current = 0;
        shouldReconnectRef.current = true;
        setConnectionStatus("online");
      };

      ws.onmessage = (event: MessageEvent) => {
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
        if (!shouldReconnectRef.current) {
          setConnectionStatus("offline");
          return;
        }
        scheduleReconnect();
      };

      ws.onerror = (error: Event) => {
        console.error("❌ WebSocket error:", error);
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      resetRetryState();
      if (retryCooldownTimeoutRef.current) {
        clearTimeout(retryCooldownTimeoutRef.current);
        retryCooldownTimeoutRef.current = null;
      }
      manualRetryLockedRef.current = false;
      setIsRetryCooldown(false);
      wsRef.current?.close();
      wsRef.current = null;
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
