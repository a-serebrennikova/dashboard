import { WebSocketServer, WebSocket } from "ws";
import { logger } from "../logger";
import { getDashboardPayload } from "../services/dashboardService";
import { simulateDataChanges } from "../services/dataSimulator";
import { webSocketMessageSchema } from "@package/dashboard-shared/contracts/ws";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { MessageType } from "@package/dashboard-shared/contracts/ws";

type CreateMessage = (type: MessageType, data: DashboardPayload) => string;

type SimulationLoopParams = {
  wss: WebSocketServer;
  createMessage: CreateMessage;
  getCurrentData: () => DashboardPayload | null;
  setCurrentData: (data: DashboardPayload) => void;
};

export function createSimulationLoop({
  wss,
  createMessage,
  getCurrentData,
  setCurrentData,
}: SimulationLoopParams) {
  let intervalId: ReturnType<typeof setInterval> | undefined;

  const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  const stop = () => {
    if (intervalId === undefined) {
      return;
    }

    // Freeze updates when nobody is connected.
    clearInterval(intervalId);
    intervalId = undefined;
    logger.info(
      "Update interval paused because there are no connected clients",
    );
  };

  const start = () => {
    if (intervalId !== undefined || wss.clients.size === 0) {
      return;
    }

    logger.info("Starting update interval");

    intervalId = setInterval(async () => {
      try {
        if (wss.clients.size === 0) {
          stop();
          return;
        }

        await simulateDataChanges();
        const nextData = await getDashboardPayload();
        setCurrentData(nextData);

        const updateMessage = createMessage("update", nextData);
        logger.debug(
          `[Update] GeneratedAt: ${nextData.generatedAt}, Open: ${nextData.snapshot.openCount}, Critical: ${nextData.snapshot.criticalCount}`,
        );

        broadcastMessage(updateMessage);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown interval error";
        logger.error(`Interval error: ${message}`);
      }
    }, 5000);

    logger.info("Update interval started");
  };

  const handleConnection = async (ws: WebSocket) => {
    logger.info(`New client connected (Total: ${wss.clients.size})`);

    try {
      let currentData = getCurrentData();

      if (!currentData) {
        currentData = await getDashboardPayload();
        setCurrentData(currentData);
      }

      ws.send(createMessage("init", currentData));
      logger.info("Initial data sent");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown initial send error";
      logger.error(`Failed to send initial data: ${message}`);
      ws.close();
      return;
    }

    start();

    ws.on("message", (message) => {
      logger.info(`Message received: ${message}`);
    });

    ws.on("close", () => {
      logger.info(`Client disconnected (Remaining: ${wss.clients.size})`);

      if (wss.clients.size === 0) {
        stop();
      }
    });
  };

  return { handleConnection };
}

export function createDashboardMessage(
  type: MessageType,
  data: DashboardPayload,
) {
  const payload = webSocketMessageSchema.parse({ type, data });
  return JSON.stringify(payload);
}
