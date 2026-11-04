import type { Request, Response } from "express";
import { createIncidentInputSchema } from "@package/dashboard-shared/dashboard";
import { ZodError } from "zod";
import { logger } from "../../logger";
import { createIncident } from "../../features/incidents/service";

type IncidentCreatedHook = () => Promise<void>;

export const handleCreateIncidentRoute = async (
  req: Request,
  res: Response,
  onIncidentCreated?: IncidentCreatedHook,
): Promise<void> => {
  try {
    const payload = createIncidentInputSchema.parse(req.body ?? null);
    const createdIncident = await createIncident(payload);

    if (!createdIncident) {
      res.status(404).json({ error: "Selected service was not found" });
      return;
    }

    if (onIncidentCreated) {
      void onIncidentCreated().catch((error) => {
        logger.error("Failed to broadcast created incident", { error });
      });
    }

    res.status(201).json(createdIncident);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Invalid incident payload",
        details: error.flatten(),
      });
      return;
    }

    logger.error("Failed to create incident", { error });
    res.status(500).json({ error: "Failed to create incident" });
  }
};
