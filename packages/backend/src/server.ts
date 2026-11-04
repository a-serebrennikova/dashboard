import http from "node:http";
import { sql } from "kysely";
import { WebSocketServer } from "ws";
import { logger } from "./logger";
import { db } from "./db";
import { createApp, HEALTH_PATH, SNAPSHOT_PATH } from "./api/http/createApp";
import { detectOriginAllowed } from "./api/origin";
import { createSimulationLoop } from "./api/ws/simulationLoop";
import { createDashboardMessage } from "./api/ws/createDashboardMessage";

const DEFAULT_PORT = 8080;
const parsedPort = Number(process.env.PORT);
const PORT = Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

let wss: WebSocketServer | undefined;
let httpServer: http.Server | undefined;
let shutdownRequested = false;
let shutdownPromise: Promise<void> | undefined;

const closeHttpServer = (server: http.Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

const shutdown = (): Promise<void> => {
  shutdownRequested = true;
  if (shutdownPromise) {
    return shutdownPromise;
  }

  shutdownPromise = (async () => {
    wss?.clients.forEach((client) => client.terminate());

    const closeTasks: Promise<unknown>[] = [];
    if (wss) {
      closeTasks.push(
        new Promise<void>((resolve, reject) => {
          wss?.close((error) => (error ? reject(error) : resolve()));
        }),
      );
    }
    if (httpServer?.listening) {
      closeTasks.push(closeHttpServer(httpServer));
    }

    const closeResults = await Promise.allSettled(closeTasks);
    let shutdownFailed = false;
    for (const result of closeResults) {
      if (result.status === "rejected") {
        shutdownFailed = true;
        logger.error(`Failed to close server: ${getErrorMessage(result.reason)}`);
      }
    }

    try {
      await db.destroy();
    } catch (error) {
      shutdownFailed = true;
      logger.error(
        `Failed to close database connections: ${getErrorMessage(error)}`,
      );
    }

    if (shutdownFailed) {
      process.exitCode = 1;
    } else {
      logger.info("Server stopped");
    }
  })();

  return shutdownPromise;
};

const startServer = async () => {
  try {
    await sql`SELECT 1`.execute(db);
    logger.info("PostgreSQL connection established");

    if (shutdownRequested) {
      return;
    }

    wss = new WebSocketServer({ noServer: true });

    const dashboardLoop = createSimulationLoop({
      wss,
      createMessage: createDashboardMessage,
    });

    const app = createApp({
      port: PORT,
      onIncidentCreated: async () => {
        await dashboardLoop.broadcastDashboardUpdate();
      },
    });
    httpServer = http.createServer(app);

    httpServer.on("upgrade", (request, socket, head) => {
      if (!detectOriginAllowed(request.headers.origin)) {
        logger.warn("Rejected websocket upgrade from disallowed origin", {
          origin: request.headers.origin,
        });

        socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
        socket.destroy();
        return;
      }

      wss?.handleUpgrade(request, socket, head, (ws) => {
        wss?.emit("connection", ws, request);
      });
    });

    wss.on("connection", dashboardLoop.handleConnection);

    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => {
        httpServer?.off("listening", onListening);
        reject(error);
      };
      const onListening = () => {
        httpServer?.off("error", onError);
        resolve();
      };

      httpServer?.once("error", onError);
      httpServer?.once("listening", onListening);
      httpServer?.listen(PORT);
    });

    logger.info(`HTTP/WebSocket server started on port ${PORT}`);
    logger.info(`Health endpoint: http://localhost:${PORT}${HEALTH_PATH}`);
    logger.info(`Snapshot endpoint: http://localhost:${PORT}${SNAPSHOT_PATH}`);
    logger.info(`WebSocket endpoint: ws://localhost:${PORT}`);
  } catch (error) {
    logger.error(`Critical server startup error: ${getErrorMessage(error)}`);
    process.exitCode = 1;
    await shutdown();
  }
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

void startServer();
