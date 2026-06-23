import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { generateNewData, getInitialState } from "./dataGenerated.js";
import { logger } from "./logger.js";
import { webSocketMessageSchema } from "dashboard-shared/contracts/ws";
import type { DashboardData } from "dashboard-shared/contracts/dashboard";
import type { MessageType } from "dashboard-shared/contracts/ws";

const DEFAULT_PORT = 8080;
const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const PORT =
  Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
const HEALTH_PATH = "/health";

let wss: WebSocketServer;
let httpServer: http.Server;
let intervalId: ReturnType<typeof setInterval>;

try {
  httpServer = http.createServer((req, res) => {
    if (req.url === HEALTH_PATH) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
  });

  wss = new WebSocketServer({ server: httpServer });

  httpServer.listen(PORT, () => {
    logger.info(`HTTP/WebSocket server started on port ${PORT}`);
    logger.info(`Health endpoint: http://localhost:${PORT}${HEALTH_PATH}`);
    logger.info(`WebSocket endpoint: ws://localhost:${PORT}`);
  });

  let currentData = getInitialState();

  const createMessage = (type: MessageType, data: DashboardData) => {
    const payload = webSocketMessageSchema.parse({ type, data });
    return JSON.stringify(payload);
  };

  const sendMessage = (
    ws: WebSocket,
    type: MessageType,
    data: DashboardData,
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

  wss.on("connection", (ws: WebSocket) => {
    logger.info(`New client connected (Total: ${wss.clients.size})`);

    sendMessage(ws, "init", currentData);
    logger.info("Initial data sent");

    ws.on("message", (message) => {
      logger.info(`Message received: ${message}`);
    });

    ws.on("close", () => {
      logger.info(`Client disconnected (Remaining: ${wss.clients.size})`);
    });
  });

  logger.info("Starting interval");

  intervalId = setInterval(() => {
    try {
      currentData = generateNewData();
      const updateMessage = createMessage("update", currentData);

      logger.debug(
        `Time: ${currentData.timestamp} - Indicator1: ${currentData.indicator1}, Indicator2: ${currentData.indicator2}`,
      );

      broadcastMessage(updateMessage);
    } catch (error) {
      logger.error("Interval error", { error });
    }
  }, 5000);

  logger.info("Interval started");
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
