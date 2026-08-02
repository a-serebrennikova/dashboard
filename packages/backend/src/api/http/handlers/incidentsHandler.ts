import type http from "node:http";
import { createIncidentInputSchema } from "@package/dashboard-shared/dashboard";
import { ZodError } from "zod";
import { logger } from "../../../logger";
import { createIncident } from "../../../core/service";
import { readJsonBody } from "../helpers/request";
import { respondJson } from "../helpers/responses";

type IncidentCreatedHook = () => Promise<void>;

export const handleCreateIncidentRoute = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  onIncidentCreated?: IncidentCreatedHook,
): Promise<void> => {
  try {
    const payload = createIncidentInputSchema.parse(await readJsonBody(req));
    const createdIncident = await createIncident(payload);

    if (!createdIncident) {
      respondJson(res, 404, { error: "Selected service was not found" });
      return;
    }

    if (onIncidentCreated) {
      void onIncidentCreated().catch((error) => {
        logger.error("Failed to broadcast created incident", { error });
      });
    }

    respondJson(res, 201, createdIncident);
  } catch (error) {
    if (error instanceof SyntaxError) {
      respondJson(res, 400, { error: "Invalid JSON body" });
      return;
    }

    if (error instanceof ZodError) {
      respondJson(res, 400, {
        error: "Invalid incident payload",
        details: error.flatten(),
      });
      return;
    }

    logger.error("Failed to create incident", { error });
    respondJson(res, 500, { error: "Failed to create incident" });
  }
};
