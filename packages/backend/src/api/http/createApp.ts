import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import {
  getDashboardPayload,
  getServicesPayload,
} from "../../features/dashboard/service";
import { logger } from "../../logger";
import { detectOriginAllowed } from "../origin";
import { handleCreateIncidentRoute } from "./incidents";

export const HEALTH_PATH = "/health";
export const SNAPSHOT_PATH = "/api/snapshot";
export const SERVICES_PATH = "/api/services";
export const INCIDENTS_PATH = "/api/incidents";

type CreateAppOptions = {
  port: number;
  onIncidentCreated?: () => Promise<void>;
};

export function createApp({
  port,
  onIncidentCreated,
}: CreateAppOptions): express.Express {
  const app = express();

  app.use(
    "/api",
    cors({
      origin: (origin, callback) => {
        callback(null, origin ? detectOriginAllowed(origin) : false);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    }),
  );

  app.get(HEALTH_PATH, (_req, res) => {
    res.json({ status: "ok", port });
  });
  app.get(SNAPSHOT_PATH, async (_req, res) => {
    res.json(await getDashboardPayload());
  });
  app.get(SERVICES_PATH, async (_req, res) => {
    res.json(await getServicesPayload());
  });
  app.post(INCIDENTS_PATH, express.json(), (req, res) => {
    return handleCreateIncidentRoute(req, res, onIncidentCreated);
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const handleRequestError: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number" &&
      error.status >= 400 &&
      error.status < 500
    ) {
      const message =
        error.status === 413 ? "Request body is too large" : "Invalid request";
      res.status(error.status).json({ error: message });
      return;
    }

    logger.error("Unhandled HTTP request error", { error });
    res.status(500).json({ error: "Internal server error" });
  };

  app.use(handleRequestError);

  return app;
}
