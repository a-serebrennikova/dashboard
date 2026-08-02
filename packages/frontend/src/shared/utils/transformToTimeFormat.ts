import { formatDashboardTime } from "./formatDashboardTime";

export const transformToTimeFormat = (value: string) => {
  return formatDashboardTime(value, "time");
};
