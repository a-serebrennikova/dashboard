import { createLogger, format, transports } from "winston";

const allowedLevels = ["error", "warn", "info", "debug"] as const;
type LogLevel = (typeof allowedLevels)[number];

const isValidLogLevel = (level: string): level is LogLevel =>
  allowedLevels.includes(level as LogLevel);

const configuredLevel = (process.env.LOG_LEVEL ?? "error").toLowerCase();
const level: LogLevel = isValidLogLevel(configuredLevel)
  ? configuredLevel
  : "error";

const levelIcon: Record<string, string> = {
  info: "🟢",
  warn: "🟡",
  error: "🔴",
  debug: "🔵",
};

export const logger = createLogger({
  level,
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
