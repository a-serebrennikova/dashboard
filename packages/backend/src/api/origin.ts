const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
);

export const detectOriginAllowed = (
  origin: string | undefined,
): origin is string => {
  return origin !== undefined && allowedOrigins.has(origin);
};
