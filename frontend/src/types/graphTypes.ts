export interface HistoryPoint {
  time: string;
  indicator1: number;
  indicator2: number;
}

// Type for dashboard data
export interface DashboardData {
  indicator1: number;
  indicator2: number;
  history: HistoryPoint[];
}

// Type for server message (with type/data wrapper)
export interface WebSocketMessage {
  type: "init" | "update";
  data: DashboardData;
}
