import { z } from "zod";

export const historyPointSchema = z.object({
  time: z.string(),
  indicator1: z.number(),
  indicator2: z.number(),
});

export const dashboardDataSchema = z.object({
  indicator1: z.number(),
  indicator2: z.number(),
  timestamp: z.string(),
  history: z.array(historyPointSchema),
});

export const wsMessageTypeSchema = z.enum(["init", "update"]);

export const webSocketMessageSchema = z.object({
  type: wsMessageTypeSchema,
  data: dashboardDataSchema,
});

export type HistoryPoint = z.infer<typeof historyPointSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type MessageType = z.infer<typeof wsMessageTypeSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
