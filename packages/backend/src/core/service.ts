import { randomUUID } from "node:crypto";
import type {
  CreateIncidentInput,
  DashboardPayload,
  Incident,
  IncidentEvent,
  Service,
} from "@package/dashboard-shared/dashboard";
import { mapEvent, mapIncident, mapService } from "./payloadMappers";
import {
  fetchIncidents,
  fetchRecentEvents,
  fetchServiceById,
  fetchServices,
  insertIncident,
  insertIncidentEvent,
} from "../persistence/dashboardRepository";

export async function getDashboardPayload(): Promise<DashboardPayload> {
  const [incidents, events] = await Promise.all([
    fetchIncidents(),
    fetchRecentEvents(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    incidents: incidents.map(mapIncident) satisfies Incident[],
    events: events.map(mapEvent) satisfies IncidentEvent[],
  };
}

export async function getServicesPayload(): Promise<Service[]> {
  const services = await fetchServices();
  return services.map(mapService) satisfies Service[];
}

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

  await insertIncident({
    id: incidentId,
    serviceId: input.serviceId,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: input.status,
    createdAt: incidentAtIso,
    updatedAt: incidentAtIso,
    resolvedAt,
  });

  await insertIncidentEvent({
    id: randomUUID(),
    incidentId,
    type: "created",
    message: `Incident created: ${input.title}`,
    severity: input.severity,
    createdAt: incidentAtIso,
  });

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
