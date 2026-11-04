const nowIso = (): string => new Date().toISOString();

export const transformIsoOrNow = (value: unknown): string => {
  if (value == null || value === "") {
    return nowIso();
  }

  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !(value instanceof Date)
  ) {
    return nowIso();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? nowIso() : parsed.toISOString();
};
