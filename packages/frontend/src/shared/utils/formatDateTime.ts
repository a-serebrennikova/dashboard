import { formatDashboardTime } from "./formatDashboardTime";

export const formatDateTime = (value?: string): string => {
  return value ? formatDashboardTime(value, "datetime") : "--.--.----, --:--:--";
};
