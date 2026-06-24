import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";
import { getDashboardPayload } from "./services/dashboardService";
import { webSocketMessageSchema } from "@package/dashboard-shared/contracts/ws";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { MessageType } from "@package/dashboard-shared/contracts/ws";

const DEFAULT_PORT = 8080;
const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const PORT =
  Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
const HEALTH_PATH = "/health";
const SNAPSHOT_PATH = "/api/snapshot";

let wss: WebSocketServer;
let httpServer: http.Server;
let intervalId: ReturnType<typeof setInterval>;

try {
  httpServer = http.createServer(async (req, res) => {
    if (req.url === HEALTH_PATH) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", port: PORT }));
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
  });

  wss = new WebSocketServer({ server: httpServer });

  httpServer.listen(PORT, () => {
    logger.info(`HTTP/WebSocket server started on port ${PORT}`);
    logger.info(`Health endpoint: http://localhost:${PORT}${HEALTH_PATH}`);
    logger.info(`Snapshot endpoint: http://localhost:${PORT}${SNAPSHOT_PATH}`);
    logger.info(`WebSocket endpoint: ws://localhost:${PORT}`);
  });

  let currentData: DashboardPayload | null = null;

  const createMessage = (type: MessageType, data: DashboardPayload) => {
    const payload = webSocketMessageSchema.parse({ type, data });
    return JSON.stringify(payload);
  };

  const sendMessage = (
    ws: WebSocket,
    type: MessageType,
    data: DashboardPayload,
  ) => {
    try {
      ws.send(createMessage(type, data));
    } catch (error) {
      logger.error(`Failed to send ${type} message`, { error });
    }
  };

  const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  wss.on("connection", async (ws: WebSocket) => {
    logger.info(`New client connected (Total: ${wss.clients.size})`);

    try {
      if (!currentData) {
        currentData = await getDashboardPayload();
      }
      sendMessage(ws, "init", currentData);
      logger.info("Initial data sent");
    } catch (error) {
      logger.error("Failed to send initial data", { error });
      ws.close();
      return;
    }

    ws.on("message", (message) => {
      logger.info(`Message received: ${message}`);
    });

    ws.on("close", () => {
      logger.info(`Client disconnected (Remaining: ${wss.clients.size})`);
    });
  });

  logger.info("Starting update interval");

  intervalId = setInterval(async () => {
    try {
      currentData = await getDashboardPayload();
      const updateMessage = createMessage("update", currentData);

      logger.debug(
        `[Update] GeneratedAt: ${currentData.generatedAt}, Open: ${currentData.snapshot.openCount}, Critical: ${currentData.snapshot.criticalCount}`,
      );

      broadcastMessage(updateMessage);
    } catch (error) {
      logger.error("Interval error", { error });
    }
  }, 5000);

  logger.info("Update interval started");
} catch (error) {
  logger.error("Critical server startup error", { error });
}

const shutdown = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }

  if (wss) {
    wss.clients.forEach((client) => {
      client.terminate();
    });

    wss.close(() => {
      if (httpServer) {
        httpServer.close(() => {
          logger.info("Server stopped");
          process.exit(0);
        });
      } else {
        logger.info("Server stopped");
        process.exit(0);
      }
    });
    return;
  }

  if (httpServer) {
    httpServer.close(() => {
      logger.info("Server stopped");
      process.exit(0);
    });
    return;
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
