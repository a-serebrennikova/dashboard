import { randomUUID } from "node:crypto";
import type {
  CreateIncidentInput,
  Incident,
} from "@package/dashboard-shared/dashboard";
import { mapIncident } from "./mapper";
import {
  fetchServiceById,
  insertIncidentWithEvent,
} from "./repository";

export async function createIncident(
  input: CreateIncidentInput,
): Promise<Incident | null> {
  const service = await fetchServiceById(input.serviceId);

  if (!service) {
    return null;
  }

  const incidentAt = new Date(input.incidentAt);
  incidentAt.setUTCSeconds(0, 0);
  const incidentAtIso = incidentAt.toISOString();
  const incidentId = randomUUID();
  const resolvedAt = input.status === "resolved" ? incidentAtIso : null;

  await insertIncidentWithEvent(
    {
      id: incidentId,
      serviceId: input.serviceId,
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: input.status,
      createdAt: incidentAtIso,
      updatedAt: incidentAtIso,
      resolvedAt,
    },
    {
      id: randomUUID(),
      incidentId,
      type: "created",
      message: `Incident created: ${input.title}`,
      severity: input.severity,
      createdAt: incidentAtIso,
    },
  );

  return mapIncident({
    id: incidentId,
    serviceId: input.serviceId,
    serviceName: service.name,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: input.status,
    createdAt: incidentAtIso,
    updatedAt: incidentAtIso,
    resolvedAt,
  });
}
