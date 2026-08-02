import { DASHBOARD_DATE_FORMAT_OPTIONS } from "./dateFormat";

const DATE_FORMATTERS = {
  time: new Intl.DateTimeFormat("ru-RU", DASHBOARD_DATE_FORMAT_OPTIONS.time),
  datetime: new Intl.DateTimeFormat(
    "ru-RU",
    DASHBOARD_DATE_FORMAT_OPTIONS.datetime,
  ),
} as const;

const parseDashboardDate = (value: string | number | Date): Date | null => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toDashboardTimestamp = (
  value: string | number | Date,
): number | null => {
  const parsed = parseDashboardDate(value);
  return parsed ? parsed.getTime() : null;
};

export const formatDashboardTime = (
  value: string | number | Date,
  mode: "time" | "datetime" = "time",
): string => {
  const date = parseDashboardDate(value);
  if (!date) {
    return mode === "time" ? "--:--:--" : String(value);
  }

  return DATE_FORMATTERS[mode].format(date);
};
