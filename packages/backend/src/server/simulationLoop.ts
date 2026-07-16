import { WebSocketServer, WebSocket } from "ws";
import { logger } from "../logger";
import {
  getDashboardPayload,
  getDashboardUpdatePayload,
} from "../services/dashboardService";
import { simulateDataChanges } from "../services/dataSimulator";
import { webSocketMessageSchema } from "@package/dashboard-shared/contracts/ws";
import { buildInitPayload } from "./simulationTrendHistory";
import type {
  DashboardInitPayload,
  DashboardPayload,
} from "@package/dashboard-shared/contracts/dashboard";
import type { MessageType } from "@package/dashboard-shared/contracts/ws";

type CreateMessage = (type: MessageType, data: DashboardPayload) => string;

type SimulationLoopParams = {
  wss: WebSocketServer;
  createMessage: CreateMessage;
  getCurrentData: () => DashboardPayload | null;
  setCurrentData: (data: DashboardPayload) => void;
};

const MIN_SIMULATION_DELAY_MS = 1200;
const MAX_SIMULATION_DELAY_MS = 5000;

export function createSimulationLoop({
  wss,
  createMessage,
  getCurrentData,
  setCurrentData,
}: SimulationLoopParams) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const getNextDelayMs = () => {
    const delayRange = MAX_SIMULATION_DELAY_MS - MIN_SIMULATION_DELAY_MS;
    return (
      MIN_SIMULATION_DELAY_MS + Math.floor(Math.random() * (delayRange + 1))
    );
  };

  const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  const stop = () => {
    if (timeoutId === undefined) {
      return;
    }

    // Freeze updates when nobody is connected.
    clearTimeout(timeoutId);
    timeoutId = undefined;
    logger.info(
      "Simulation loop paused because there are no connected clients",
    );
  };

  const runSimulationTick = async () => {
    if (wss.clients.size === 0) {
      stop();
      return;
    }

    try {
      await simulateDataChanges();
      const currentData = getCurrentData();
      const nextData = await getDashboardUpdatePayload();
      setCurrentData(currentData ? { ...currentData, ...nextData } : nextData);

      const updateMessage = createMessage("update", nextData);
      logger.debug(
        `[Update] GeneratedAt: ${nextData.generatedAt}, Incidents: ${nextData.incidents.length}`,
      );

      // Push update right after data mutation, without waiting for a fixed cadence.
      broadcastMessage(updateMessage);
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
      // This timer drives the simulated data update flow for the MVP.
      timeoutId = undefined;
      void runSimulationTick();
    }, delayMs);
  };

  const start = () => {
    if (timeoutId !== undefined || wss.clients.size === 0) {
      return;
    }

    logger.info("Starting simulation loop");
    scheduleNextTick();
    logger.info("Simulation loop started");
  };

  const handleConnection = async (ws: WebSocket) => {
    logger.info(`New client connected (Total: ${wss.clients.size})`);

    try {
      let currentData = getCurrentData();

      if (!currentData) {
        currentData = await getDashboardPayload();
        setCurrentData(currentData);
      }

      ws.send(createMessage("init", await buildInitPayload(currentData)));
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
  data: DashboardPayload | DashboardInitPayload,
) {
  const payload = webSocketMessageSchema.parse({ type, data });
  return JSON.stringify(payload);
}
