import { useCallback, useEffect, useReducer, useRef } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/dashboard";
import type {
  ConnectionStatus,
  LastErrorReason,
} from "../../shared/types/dashboard";
import {
  createInitialSocketState,
  type DashboardSocketState,
} from "../../shared/utils/dashboardSocket";
import {
  clearFirstPayloadTimeout,
  clearReconnectTimeout,
  resetRetryState,
} from "../../shared/utils/dashboardReconnect";
import {
  createInitialDashboardState,
  dashboardReducer,
} from "../../store/dashboardStore";
import { createSocketConnectionController } from "../../store/utils/socketController";

const FIRST_PAYLOAD_TIMEOUT_MS = import.meta.env.DEV ? 30000 : 10000;
const RETRY_COOLDOWN_MS = 500;
const BACKGROUND_PAUSE_AFTER_MS = 3 * 60 * 1000;

type TimeoutRef = ReturnType<typeof setTimeout> | null;

type UseDashboardSocketTransportResult = {
  connectionStatus: ConnectionStatus;
  data: DashboardPayload | null;
  isInitialDataTimedOut: boolean;
  lastErrorReason: LastErrorReason;
  isRetryCooldown: boolean;
  retryNow: () => void;
};

export const useDashboardSocketTransport = (
  url: string,
): UseDashboardSocketTransportResult => {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    undefined,
    createInitialDashboardState,
  );

  const socketStateRef = useRef<DashboardSocketState>(
    createInitialSocketState(),
  );
  const backgroundPauseTimeoutRef = useRef<TimeoutRef>(null);
  const isPausedForBackgroundRef = useRef(false);

  const retryNow = useCallback(() => {
    const socketState = socketStateRef.current;

    if (socketState.manualRetryLocked) {
      return;
    }

    socketState.manualRetryLocked = true;
    dispatch({ type: "SET_RETRY_COOLDOWN", payload: true });

    if (socketState.retryCooldownTimeoutId) {
      clearTimeout(socketState.retryCooldownTimeoutId);
    }

    socketState.retryCooldownTimeoutId = setTimeout(() => {
      socketState.manualRetryLocked = false;
      dispatch({ type: "SET_RETRY_COOLDOWN", payload: false });
      socketState.retryCooldownTimeoutId = null;
    }, RETRY_COOLDOWN_MS);

    dispatch({ type: "REQUEST_RETRY" });
  }, []);

  useEffect(() => {
    const socketState = socketStateRef.current;
    socketState.shouldReconnect = true;
    socketState.isUnmounting = false;

    const clearRetryCooldownTimeout = () => {
      if (!socketState.retryCooldownTimeoutId) {
        return;
      }

      clearTimeout(socketState.retryCooldownTimeoutId);
      socketState.retryCooldownTimeoutId = null;
    };

    const closeSocket = () => {
      if (!socketState.ws) {
        return;
      }

      if (
        socketState.ws.readyState === WebSocket.OPEN ||
        socketState.ws.readyState === WebSocket.CLOSING
      ) {
        socketState.ws.close();
      }

      socketState.ws = null;
    };

    const clearBackgroundPauseTimeout = () => {
      if (!backgroundPauseTimeoutRef.current) {
        return;
      }

      clearTimeout(backgroundPauseTimeoutRef.current);
      backgroundPauseTimeoutRef.current = null;
    };

    const pauseForBackground = () => {
      if (isPausedForBackgroundRef.current) {
        return;
      }

      isPausedForBackgroundRef.current = true;
      socketState.shouldReconnect = false;
      clearReconnectTimeout(socketState);
      clearFirstPayloadTimeout(socketState);

      if (
        socketState.ws &&
        (socketState.ws.readyState === WebSocket.OPEN ||
          socketState.ws.readyState === WebSocket.CONNECTING)
      ) {
        socketState.ws.close();
      }

      socketState.ws = null;
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "offline" });
      dispatch({ type: "SET_LAST_ERROR_REASON", payload: null });
      dispatch({ type: "SET_INITIAL_DATA_TIMEOUT", payload: false });
    };

    const resumeFromBackground = () => {
      if (!isPausedForBackgroundRef.current) {
        return;
      }

      isPausedForBackgroundRef.current = false;
      socketState.shouldReconnect = true;
      dispatch({ type: "REQUEST_RETRY" });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearBackgroundPauseTimeout();
        backgroundPauseTimeoutRef.current = setTimeout(() => {
          pauseForBackground();
        }, BACKGROUND_PAUSE_AFTER_MS);
        return;
      }

      clearBackgroundPauseTimeout();
      resumeFromBackground();
    };

    const connectionController = createSocketConnectionController({
      dispatch,
      socketState,
      url,
      firstPayloadTimeoutMs: FIRST_PAYLOAD_TIMEOUT_MS,
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.visibilityState === "hidden") {
      handleVisibilityChange();
    }

    connectionController.connect();

    return () => {
      socketState.isUnmounting = true;
      socketState.shouldReconnect = false;
      clearBackgroundPauseTimeout();
      isPausedForBackgroundRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearReconnectTimeout(socketState);
      resetRetryState();
      clearFirstPayloadTimeout(socketState);

      clearRetryCooldownTimeout();

      socketState.manualRetryLocked = false;
      dispatch({ type: "SET_RETRY_COOLDOWN", payload: false });

      closeSocket();
    };
  }, [url, state.reconnectNonce]);

  return {
    connectionStatus: state.connectionStatus,
    data: state.data,
    isInitialDataTimedOut: state.isInitialDataTimedOut,
    lastErrorReason: state.lastErrorReason,
    isRetryCooldown: state.isRetryCooldown,
    retryNow,
  };
};
