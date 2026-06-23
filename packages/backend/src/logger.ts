import { createLogger, format, transports } from "winston";

const isDev = process.env.NODE_ENV === "development";

const levelIcon: Record<string, string> = {
  info: "🟢",
  warn: "🟡",
  error: "🔴",
  debug: "🔵",
};

export const logger = createLogger({
  level: "debug",
  silent: !isDev,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      const icon = levelIcon[level] ?? "⚪";
      const base = `${icon} [${timestamp}] ${level.toUpperCase()}: ${String(message)}`;
      return stack ? `${base}\n${stack}` : base;
    }),
  ),
  transports: [new transports.Console()],
});
