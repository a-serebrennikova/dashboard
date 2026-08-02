import { DASHBOARD_DATE_FORMAT_OPTIONS } from "../../../shared/utils/dateFormat";

export const toDateTimeLocalValue = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const getInitialIncidentAtLocal = (): string => {
  const now = new Date();
  now.setSeconds(0, 0);
  return toDateTimeLocalValue(now);
};

export const getDatePart = (dateTimeLocalValue: string): string =>
  dateTimeLocalValue.slice(0, 10);

export const getTimePart = (dateTimeLocalValue: string): string =>
  dateTimeLocalValue.slice(11, 16);

const LOCAL_DATE_TIME_DISPLAY_FORMATTER = new Intl.DateTimeFormat(
  "ru-RU",
  DASHBOARD_DATE_FORMAT_OPTIONS.datetime,
);

export const formatIncidentDateTimeDisplay = (
  datePart: string,
  timePart: string,
): string => {
  if (!datePart || !timePart) {
    return "Select date and time";
  }

  const [yearRaw, monthRaw, dayRaw] = datePart.split("-");
  const [hourRaw, minuteRaw] = timePart.split(":");

  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    return `${datePart} ${timePart}`;
  }

  return LOCAL_DATE_TIME_DISPLAY_FORMATTER.format(
    new Date(year, month - 1, day, hour, minute, 0, 0),
  );
};

export const toIsoWithZeroSeconds = (
  datePart: string,
  timePart: string,
): string => {
  if (!datePart || !timePart) {
    throw new Error("Incident date/time is required");
  }

  const [yearRaw, monthRaw, dayRaw] = datePart.split("-");
  const [hourRaw, minuteRaw] = timePart.split(":");

  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    throw new Error("Incident date/time is invalid");
  }

  return new Date(year, month - 1, day, hour, minute, 0, 0).toISOString();
};
