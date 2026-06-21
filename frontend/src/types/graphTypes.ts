export type {
  DashboardData,
  HistoryPoint,
  WebSocketMessage,
} from "dashboard-shared";

export type ConnectionStatus =
  | "connecting"
  | "online"
  | "reconnecting"
  | "offline";
