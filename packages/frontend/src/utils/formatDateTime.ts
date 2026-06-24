import { detectValidDate } from "./detectValidDate";

const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export const formatDateTime = (value: string): string => {
  const date = new Date(value);

  if (!detectValidDate(date)) {
    return value;
  }

  return formatter.format(date);
};
