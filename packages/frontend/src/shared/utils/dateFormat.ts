export const DASHBOARD_DATE_FORMAT_OPTIONS = {
  date: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  time: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  },
  datetime: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;
