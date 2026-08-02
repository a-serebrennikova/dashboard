import type { Dispatch } from "react";
import type { DashboardSocketState } from "../../shared/utils/dashboardSocket";
import { parseDashboardMessage } from "../../shared/utils/dashboardSocket";
import {
  clearFirstPayloadTimeout,
  clearReconnectTimeout,
  resetRetryState,
  scheduleReconnect,
} from "../../shared/utils/dashboardReconnect";
import type { DashboardSocketTransportAction } from "../dashboardStore";

type SocketConnectionDeps = {
  dispatch: Dispatch<DashboardSocketTransportAction>;
  socketState: DashboardSocketState;
  url: string;
  firstPayloadTimeoutMs: number;
};

export const createSocketConnectionController = ({
  dispatch,
  socketState,
  url,
  firstPayloadTimeoutMs,
}: SocketConnectionDeps) => {
  const requestReconnect = (connect: () => void) => {
    scheduleReconnect({
      state: socketState,
      connect,
      setConnectionStatus: (value) =>
        dispatch({ type: "SET_CONNECTION_STATUS", payload: value }),
    });
  };

  const isActiveSocket = (ws: WebSocket) => socketState.ws === ws;

  const handleOpen = (ws: WebSocket) => {
    if (!isActiveSocket(ws)) {
      return;
    }

    if (socketState.isUnmounting) {
      ws.close();
      return;
    }

    socketState.reconnectAttempt = 0;
    socketState.shouldReconnect = true;
    dispatch({ type: "SET_LAST_ERROR_REASON", payload: null });
    dispatch({ type: "SET_CONNECTION_STATUS", payload: "online" });

    clearFirstPayloadTimeout(socketState);
    socketState.firstPayloadTimeoutId = setTimeout(() => {
      if (!socketState.isUnmounting) {
        dispatch({ type: "SET_INITIAL_DATA_TIMEOUT", payload: true });
        dispatch({
          type: "SET_LAST_ERROR_REASON",
          payload: "initial_payload_timeout",
        });
      }
    }, firstPayloadTimeoutMs);
  };

  const handleMessage = (ws: WebSocket, event: MessageEvent) => {
    if (!isActiveSocket(ws)) {
      return;
    }

    if (socketState.isUnmounting) {
      return;
    }

    try {
      const { type, data: nextData } = parseDashboardMessage(event.data);
      clearFirstPayloadTimeout(socketState);
      dispatch({ type: "SET_INITIAL_DATA_TIMEOUT", payload: false });

      if (type === "init" || type === "update") {
        dispatch({ type: "SET_LAST_ERROR_REASON", payload: null });

        if (type === "init") {
          dispatch({ type: "SET_DATA", payload: nextData });
          return;
        }

        dispatch({ type: "APPLY_PATCH", payload: nextData });
        return;
      }

      console.error("⚠️ Unknown message type:", type);
    } catch (error) {
      console.error("❌ Parsing error:", error);
    }
  };

  const handleClose = (ws: WebSocket) => {
    if (!isActiveSocket(ws)) {
      return;
    }

    if (socketState.isUnmounting) {
      return;
    }

    if (!socketState.shouldReconnect) {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "offline" });
      return;
    }

    dispatch({ type: "SET_LAST_ERROR_REASON", payload: "connection_lost" });
    requestReconnect(connect);
  };

  const handleError = (ws: WebSocket, error: Event) => {
    if (!isActiveSocket(ws)) {
      return;
    }

    if (socketState.isUnmounting) {
      return;
    }

    console.error("❌ WebSocket error:", error);
  };

  const connect = () => {
    clearReconnectTimeout(socketState);
    resetRetryState();
    dispatch({
      type: "SET_CONNECTION_STATUS",
      payload: socketState.reconnectAttempt > 0 ? "reconnecting" : "connecting",
    });
    dispatch({ type: "SET_INITIAL_DATA_TIMEOUT", payload: false });

    let ws: WebSocket;

    try {
      ws = new WebSocket(url);
    } catch (error) {
      console.error(`❌ Failed to open WebSocket with URL '${url}'`, error);
      dispatch({ type: "SET_LAST_ERROR_REASON", payload: "ws_open_failed" });
      requestReconnect(connect);
      return;
    }

    socketState.ws = ws;
    ws.onopen = () => handleOpen(ws);
    ws.onmessage = (event) => handleMessage(ws, event);
    ws.onclose = () => handleClose(ws);
    ws.onerror = (error) => handleError(ws, error);
  };

  return {
    connect,
    handleOpen,
    handleMessage,
    handleClose,
    handleError,
  };
};
