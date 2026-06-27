import type http from "node:http";
import { logger } from "../logger";
import { getDashboardPayload } from "../services/dashboardService";

export const HEALTH_PATH = "/health";
export const SNAPSHOT_PATH = "/api/snapshot";

export function createRequestHandler(port: number): http.RequestListener {
  return async (req, res) => {
    if (req.url === HEALTH_PATH) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", port }));
      return;
    }

    if (req.url === SNAPSHOT_PATH && req.method === "GET") {
      try {
        const payload = await getDashboardPayload();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(payload));
        return;
      } catch (error) {
        logger.error("Failed to get snapshot", { error });
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to get snapshot" }));
        return;
      }
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
  };
}
