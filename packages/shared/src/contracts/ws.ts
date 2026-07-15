import { z } from "zod";
import {
  dashboardInitPayloadSchema,
  dashboardPayloadSchema,
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

const updateMessageSchema = z.object({
  type: z.literal("update"),
  data: dashboardPayloadSchema,
});

export const webSocketMessageSchema = z.union([
  initMessageSchema,
  updateMessageSchema,
]);

export type MessageType = z.infer<typeof wsMessageTypeSchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
