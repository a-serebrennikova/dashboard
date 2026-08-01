import { webSocketMessageSchema } from "@package/dashboard-shared/ws";
import type { WebSocketMessage } from "@package/dashboard-shared/ws";

export type DashboardSocketState = {
  ws: WebSocket | null;
  reconnectTimeoutId: ReturnType<typeof setTimeout> | null;
  retryCooldownTimeoutId: ReturnType<typeof setTimeout> | null;
  firstPayloadTimeoutId: ReturnType<typeof setTimeout> | null;
  reconnectAttempt: number;
  shouldReconnect: boolean;
  isUnmounting: boolean;
  manualRetryLocked: boolean;
};

export const createInitialSocketState = (): DashboardSocketState => ({
  ws: null,
  reconnectTimeoutId: null,
  retryCooldownTimeoutId: null,
  firstPayloadTimeoutId: null,
  reconnectAttempt: 0,
  shouldReconnect: true,
  isUnmounting: false,
  manualRetryLocked: false,
});

// TODO type guard for WebSocketMessage
export const parseDashboardMessage = (rawMessage: string): WebSocketMessage => {
  const parsedMessage = JSON.parse(rawMessage);
  const parseResult = webSocketMessageSchema.safeParse(parsedMessage);

  if (!parseResult.success) {
    throw new Error(parseResult.error?.message ?? "Invalid message format");
  }

  return parseResult.data;
};
