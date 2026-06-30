import http from "node:http";
import { WebSocketServer } from "ws";
import { logger } from "./logger";
import {
  createRequestHandler,
  HEALTH_PATH,
  SNAPSHOT_PATH,
} from "./server/httpRoutes";
import {
  createDashboardMessage,
  createSimulationLoop,
} from "./server/simulationLoop";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";

const DEFAULT_PORT = 8080;
const parsedPort = Number(process.env.PORT)
const PORT = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;

let wss: WebSocketServer;
let httpServer: http.Server;

try {
  httpServer = http.createServer(createRequestHandler(PORT));

  wss = new WebSocketServer({ server: httpServer });

  httpServer.listen(PORT, () => {
    logger.info(`HTTP/WebSocket server started on port ${PORT}`);
    logger.info(`Health endpoint: http://localhost:${PORT}${HEALTH_PATH}`);
    logger.info(`Snapshot endpoint: http://localhost:${PORT}${SNAPSHOT_PATH}`);
    logger.info(`WebSocket endpoint: ws://localhost:${PORT}`);
  });

  let currentData: DashboardPayload | null = null;
  const { handleConnection } = createSimulationLoop({
    wss,
    createMessage: createDashboardMessage,
    getCurrentData: () => currentData,
    setCurrentData: (nextData) => {
      currentData = nextData;
    },
  });

  wss.on("connection", handleConnection);
} catch (error) {
  logger.error("Critical server startup error", { error });
}

const shutdown = () => {
  if (wss) {
    // close all WebSocket connections before shutting down the server
    wss.clients.forEach((client) => {
      client.terminate();
    });

    wss.close(() => {
      httpServer.close(() => {
        logger.info("Server stopped");
        process.exit(0);
      });
    });
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
