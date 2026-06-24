import { z } from "zod";
import { dashboardPayloadSchema } from "./dashboard";

export const wsMessageTypeSchema = z.enum(["init", "update"]);

export const connectionStatusSchema = z.enum([
  "connecting",
  "online",
  "reconnecting",
  "offline",
]);

export const webSocketMessageSchema = z.object({
  type: wsMessageTypeSchema,
  data: dashboardPayloadSchema,
});

export type MessageType = z.infer<typeof wsMessageTypeSchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
