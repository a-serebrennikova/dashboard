import type http from "node:http";
import { logger } from "../logger";
import {
  getDashboardPayload,
  getServicesPayload,
} from "../services/dashboardService";
import { isOriginAllowed } from "./cors";

export const HEALTH_PATH = "/health";
export const SNAPSHOT_PATH = "/api/snapshot";
export const SERVICES_PATH = "/api/services";

const applyCorsHeaders = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): boolean => {
  const origin = req.headers.origin;
  if (!isOriginAllowed(origin)) {
    return false;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  const requestedHeaders = req.headers["access-control-request-headers"];
  if (typeof requestedHeaders === "string" && requestedHeaders.length > 0) {
    res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
  } else {
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  res.setHeader("Access-Control-Max-Age", "86400");

  return true;
};

const respondJson = (
  res: http.ServerResponse,
  statusCode: number,
  payload: unknown,
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const isApiRequest = (url: string | undefined): boolean => {
  return Boolean(url?.startsWith("/api/"));
};

export function createRequestHandler(port: number): http.RequestListener {
  return async (req, res) => {
    const hasCorsHeaders = applyCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
      if (isApiRequest(req.url) && !hasCorsHeaders) {
        respondJson(res, 403, { error: "Origin is not allowed" });
        return;
      }

      res.writeHead(204);
      res.end();
      return;
    }

    if (isApiRequest(req.url) && req.headers.origin && !hasCorsHeaders) {
      respondJson(res, 403, { error: "Origin is not allowed" });
      return;
    }

    if (req.url === HEALTH_PATH) {
      respondJson(res, 200, { status: "ok", port });
      return;
    }

    if (req.url === SNAPSHOT_PATH && req.method === "GET") {
      try {
        const payload = await getDashboardPayload();
        respondJson(res, 200, payload);
        return;
      } catch (error) {
        logger.error("Failed to get snapshot", { error });
        respondJson(res, 500, { error: "Failed to get snapshot" });
        return;
      }
    }

    if (req.url === SERVICES_PATH && req.method === "GET") {
      try {
        const payload = await getServicesPayload();
        respondJson(res, 200, payload);
        return;
      } catch (error) {
        logger.error("Failed to get services", { error });
        respondJson(res, 500, { error: "Failed to get services" });
        return;
      }
    }

    respondJson(res, 404, { message: "Not found" });
  };
}
