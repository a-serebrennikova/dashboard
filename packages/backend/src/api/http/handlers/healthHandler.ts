import type http from "node:http";
import { respondJson } from "../helpers/responses";

export const handleHealthRoute = async (
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  port: number,
): Promise<void> => {
  respondJson(res, 200, { status: "ok", port });
};
