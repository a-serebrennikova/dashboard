export type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

export type ConnectionStatus =
  | "connecting"
  | "online"
  | "reconnecting"
  | "offline";

export type LastErrorReason =
  | "connection_lost"
  | "ws_open_failed"
  | "initial_payload_timeout"
  | null;

export type IncidentsTrendPoint = {
  second: string;
  timestampMs: number;
  total: number;
  critical: number;
};
