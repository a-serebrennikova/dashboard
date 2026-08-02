import type http from "node:http";
import { handleCreateIncidentRoute } from "./handlers/incidentsHandler";
import { handleHealthRoute } from "./handlers/healthHandler";
import { handleServicesRoute } from "./handlers/servicesHandler";
import { handleSnapshotRoute } from "./handlers/snapshotHandler";
import { passesApiCorsGuard } from "./helpers/corsGuard";
import { isApiRequest } from "./helpers/request";
import { respondJson } from "./helpers/responses";

export const HEALTH_PATH = "/health";
export const SNAPSHOT_PATH = "/api/snapshot";
export const SERVICES_PATH = "/api/services";
export const INCIDENTS_PATH = "/api/incidents";

type CreateRequestHandlerOptions = {
  port: number;
  onIncidentCreated?: () => Promise<void>;
};

type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => Promise<void>;

const createRouteHandlers = (
  port: number,
  onIncidentCreated?: () => Promise<void>,
): Record<string, RouteHandler> => {
  return {
    [`GET ${HEALTH_PATH}`]: async (req, res) => {
      await handleHealthRoute(req, res, port);
    },
    [`GET ${SNAPSHOT_PATH}`]: async (req, res) => {
      await handleSnapshotRoute(req, res);
    },
    [`GET ${SERVICES_PATH}`]: async (req, res) => {
      await handleServicesRoute(req, res);
    },
    [`POST ${INCIDENTS_PATH}`]: async (req, res) => {
      await handleCreateIncidentRoute(req, res, onIncidentCreated);
    },
  };
};

export function createRequestHandler({
  port,
  onIncidentCreated,
}: CreateRequestHandlerOptions): http.RequestListener {
  const routeHandlers = createRouteHandlers(port, onIncidentCreated);

  return async (req, res) => {
    const isApi = isApiRequest(req.url);
    if (!passesApiCorsGuard(req, res, isApi)) {
      return;
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const routeKey = `${req.method ?? ""} ${req.url ?? ""}`;
    const routeHandler = routeHandlers[routeKey];

    if (routeHandler) {
      await routeHandler(req, res);
      return;
    }

    respondJson(res, 404, { error: "Not found" });
  };
}
