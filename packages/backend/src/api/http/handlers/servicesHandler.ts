import type http from "node:http";
import { getServicesPayload } from "../../../core/service";
import { handleGetRoute } from "../helpers/getRoute";

export const handleServicesRoute = async (
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> => {
  await handleGetRoute(
    res,
    getServicesPayload,
    "Failed to get services",
    "Failed to get services",
  );
};
