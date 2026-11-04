import type {
  DashboardPayload,
  Incident,
  IncidentEvent,
  Service,
} from "@package/dashboard-shared/dashboard";
import { mapEvent, mapService } from "./mapper.js";
import { mapIncident } from "../incidents/mapper.js";
import {
  fetchIncidents,
  fetchRecentEvents,
  fetchServices,
} from "./repository";

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
