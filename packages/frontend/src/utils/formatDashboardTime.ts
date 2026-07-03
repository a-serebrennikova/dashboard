const TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

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

  return mode === "time"
    ? TIME_FORMATTER.format(date)
    : DATE_TIME_FORMATTER.format(date);
};
