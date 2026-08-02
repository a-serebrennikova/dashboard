import { WebSocketServer, WebSocket } from "ws";
import type {
  DashboardInitPayload,
  DashboardPayload,
} from "@package/dashboard-shared/dashboard";
import type {
  DashboardUpdatePayload,
  MessageType,
} from "@package/dashboard-shared/ws";
import { logger } from "../../logger";
import { getDashboardPayload } from "../../core/service";
import { simulateDataChanges } from "../../simulations/dataSimulator";
import { buildInitPayload } from "../../core/trendHistory";
import { buildUpdatePayload, getNextDelayMs } from "./utils";

type CreateMessage = (
  type: MessageType,
  data: DashboardInitPayload | DashboardUpdatePayload,
) => string;

type SimulationLoopParams = {
  wss: WebSocketServer;
  createMessage: CreateMessage;
};

export function createSimulationLoop({
  wss,
  createMessage,
}: SimulationLoopParams) {
  // This timer drives the simulated data update flow for the MVP.
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let dashboardData: DashboardPayload | null = null;

  const broadcastDashboardUpdate = async () => {
    const previousData = dashboardData;
    const nextData = await getDashboardPayload();
    dashboardData = nextData;

    if (wss.clients.size > 0) {
      const updatePayload = buildUpdatePayload(previousData, nextData);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(createMessage("update", updatePayload));
        }
      });
    }

    return nextData;
  };

  const sendInitialPayload = async (
    ws: WebSocket,
    currentData: DashboardPayload,
  ) => {
    ws.send(createMessage("init", await buildInitPayload(currentData)));
    logger.info("Initial data sent");
  };

  const stop = () => {
    if (timeoutId === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = undefined;
    logger.info("Simulation loop stopped");
  };

  const runSimulationTick = async () => {
    if (wss.clients.size === 0) {
      stop();
      return;
    }

    try {
      await simulateDataChanges();
      const nextData = await broadcastDashboardUpdate();
      logger.debug(
        `[Update] GeneratedAt: ${nextData.generatedAt}, Incidents: ${nextData.incidents.length}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown simulation error";
      logger.error(`Simulation tick error: ${message}`);
    } finally {
      scheduleNextTick();
    }
  };

  const scheduleNextTick = () => {
    if (timeoutId !== undefined || wss.clients.size === 0) {
      return;
    }

    const delayMs = getNextDelayMs();
    logger.debug(`Next simulation tick scheduled in ${delayMs}ms`);

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      runSimulationTick();
    }, delayMs);
  };

  const start = () => {
    if (wss.clients.size === 0) {
      return;
    }

    stop();
    logger.info("Starting simulation loop");
    scheduleNextTick();
    logger.info("Simulation loop started");
  };

  const handleConnection = async (ws: WebSocket) => {
    logger.info(`New client connected (Total: ${wss.clients.size})`);

    try {
      let currentData = dashboardData;

      if (!currentData) {
        currentData = await getDashboardPayload();
        dashboardData = currentData;
      }

      await sendInitialPayload(ws, currentData);
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

  return {
    handleConnection,
    broadcastDashboardUpdate,
  };
}
