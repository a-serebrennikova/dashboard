const SQL_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/;
const TIMEZONE_SUFFIX_REGEX = /Z|[+-]\d{2}:?\d{2}$/;

const nowIso = (): string => new Date().toISOString();

const isDateInput = (value: unknown): value is string | number | Date => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date
  );
};

const parseSqlDateTimeAsUtc = (value: string): string | null => {
  const hasTimezone = TIMEZONE_SUFFIX_REGEX.test(value);
  const isSqlDateTime = SQL_DATETIME_REGEX.test(value);
  if (!isSqlDateTime || hasTimezone) {
    return null;
  }

  const parsedUtc = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(parsedUtc.getTime()) ? null : parsedUtc.toISOString();
};

export const transformIsoOrNow = (value: unknown): string => {
  if (value == null || value === "") {
    return nowIso();
  }

  // SQLite DATETIME often comes as "YYYY-MM-DD HH:mm:ss" without timezone.
  // Treat such values as UTC to avoid local-time shifts after ISO conversion.
  if (typeof value === "string") {
    const parsedSqlDateTime = parseSqlDateTimeAsUtc(value);
    if (parsedSqlDateTime) {
      return parsedSqlDateTime;
    }
  }

  if (!isDateInput(value)) {
    return nowIso();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? nowIso() : parsed.toISOString();
};
