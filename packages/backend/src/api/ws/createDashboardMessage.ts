import { DashboardInitPayload } from "@package/dashboard-shared/dashboard";
import {
  MessageType,
  DashboardUpdatePayload,
  webSocketMessageSchema,
} from "@package/dashboard-shared/ws";

export function createDashboardMessage(
  type: MessageType,
  data: DashboardInitPayload | DashboardUpdatePayload,
) {
  const payload = webSocketMessageSchema.parse({ type, data });
  return JSON.stringify(payload);
}
