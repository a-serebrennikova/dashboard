import { detectValidDate } from "./detectValidDate";

const TIME_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export const transformToTimeFormat = (value: string) => {
  const date = new Date(value);

  if (!detectValidDate(date)) {
    console.warn("Invalid generatedAt received for trend point", value);
    return "--:--:--";
  }

  return TIME_FORMATTER.format(date);
};
