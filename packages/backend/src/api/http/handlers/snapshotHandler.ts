import type http from "node:http";
import { getDashboardPayload } from "../../../core/service";
import { handleGetRoute } from "../helpers/getRoute";

export const handleSnapshotRoute = async (
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> => {
  await handleGetRoute(
    res,
    getDashboardPayload,
    "Failed to get snapshot",
    "Failed to get snapshot",
  );
};
