export interface HistoryPoint {
  time: string;
  indicator1: number;
  indicator2: number;
}

export interface DashboardData {
  indicator1: number;
  indicator2: number;
  timestamp: string;
  history: HistoryPoint[];
}

export interface WebSocketMessage {
  type: "init" | "update";
  data: DashboardData;
}

export type ConnectionStatus =
  | "connecting"
  | "online"
  | "reconnecting"
  | "offline";
