export type {
  DashboardData,
  HistoryPoint,
} from "dashboard-shared/contracts/dashboard";

export type { WebSocketMessage } from "dashboard-shared/contracts/ws";

export type ConnectionStatus =
  | "connecting"
  | "online"
  | "reconnecting"
  | "offline";
