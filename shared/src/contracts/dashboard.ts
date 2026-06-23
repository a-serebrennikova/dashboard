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

export type HistoryPoint = z.infer<typeof historyPointSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
