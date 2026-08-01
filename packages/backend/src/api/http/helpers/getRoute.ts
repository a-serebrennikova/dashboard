import type http from "node:http";
import { logger } from "../../../logger";
import { respondJson } from "./responses";

export const handleGetRoute = async (
  res: http.ServerResponse,
  fetchPayload: () => Promise<unknown>,
  logMessage: string,
  errorMessage: string,
): Promise<void> => {
  try {
    const payload = await fetchPayload();
    respondJson(res, 200, payload);
  } catch (error) {
    logger.error(logMessage, { error });
    respondJson(res, 500, { error: errorMessage });
  }
};
