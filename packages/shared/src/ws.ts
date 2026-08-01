import { z } from "zod";
import {
  dashboardInitPayloadSchema,
  incidentEventSchema,
  incidentSchema,
  incidentsTrendPointSchema,
} from "./dashboard";

export const wsMessageTypeSchema = z.enum(["init", "update"]);

export const connectionStatusSchema = z.enum([
  "connecting",
  "online",
  "reconnecting",
  "offline",
]);

const initMessageSchema = z.object({
  type: z.literal("init"),
  data: dashboardInitPayloadSchema,
});

export const dashboardUpdatePayloadSchema = z.object({
  generatedAt: z.string(),
  incidents: z.array(incidentSchema).optional(),
  events: z.array(incidentEventSchema).optional(),
  trendHistory: z.array(incidentsTrendPointSchema).optional(),
});

const updateMessageSchema = z.object({
  type: z.literal("update"),
  data: dashboardUpdatePayloadSchema,
});

export const webSocketMessageSchema = z.union([
  initMessageSchema,
  updateMessageSchema,
]);

export type MessageType = z.infer<typeof wsMessageTypeSchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
export type DashboardUpdatePayload = z.infer<
  typeof dashboardUpdatePayloadSchema
>;
