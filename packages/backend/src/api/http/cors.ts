const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0),
);

const isDevelopment = process.env.NODE_ENV !== "production";

const localhostHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

const isLocalDevOrigin = (origin: string): boolean => {
  try {
    const parsedUrl = new URL(origin);
    const isHttpProtocol =
      parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

    return isHttpProtocol && localhostHostnames.has(parsedUrl.hostname);
  } catch {
    return false;
  }
};

export const isOriginAllowed = (
  origin: string | undefined,
): origin is string => {
  if (!origin) {
    return false;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  if (isDevelopment && isLocalDevOrigin(origin)) {
    return true;
  }

  return false;
};
