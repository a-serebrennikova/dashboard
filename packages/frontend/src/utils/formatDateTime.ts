import { formatDashboardTime } from "./formatDashboardTime";

export const formatDateTime = (value: string): string => {
  return formatDashboardTime(value, "datetime");
};
