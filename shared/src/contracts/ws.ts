import { z } from "zod";
import { dashboardDataSchema } from "./dashboard.js";

export const wsMessageTypeSchema = z.enum(["init", "update"]);

export const webSocketMessageSchema = z.object({
  type: wsMessageTypeSchema,
  data: dashboardDataSchema,
});

export type MessageType = z.infer<typeof wsMessageTypeSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
