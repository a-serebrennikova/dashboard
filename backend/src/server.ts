import { WebSocketServer, WebSocket } from "ws";
import { generateNewData, getInitialState } from "./dataGenerated.js";
import { logger } from "./logger.js";
import type { DashboardData, MessageType } from "dashboard-shared";

const PORT = process.env.PORT || 8080;

let wss: WebSocketServer;
let intervalId: ReturnType<typeof setInterval>;

try {
  wss = new WebSocketServer({ port: Number(PORT) });
  logger.info(`WebSocket server started on port ${PORT}`);
  logger.info(`Connect at: ws://localhost:${PORT}`);

  let currentData = getInitialState();

  const createMessage = (type: MessageType, data: DashboardData) =>
    JSON.stringify({ type, data });

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

process.on("SIGINT", () => {
  clearInterval(intervalId);
  wss.close(() => {
    logger.info("Server stopped");
    process.exit(0);
  });
});
