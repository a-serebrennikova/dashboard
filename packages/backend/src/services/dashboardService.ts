import type {
  DashboardPayload,
  Incident,
  IncidentEvent,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";
import { mapEvent, mapIncident, mapService } from "./dashboardPayloadMappers";
import {
  fetchIncidents,
  fetchRecentEvents,
  fetchServices,
} from "../persistence/dashboardRepository";

export async function getDashboardPayload(): Promise<DashboardPayload> {
  const [incidents, recentEvents] = await Promise.all([
    fetchIncidents(),
    fetchRecentEvents(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    incidents: incidents.map(mapIncident) satisfies Incident[],
    recentEvents: recentEvents.map(mapEvent) satisfies IncidentEvent[],
  };
}

export async function getDashboardUpdatePayload(): Promise<DashboardPayload> {
  return getDashboardPayload();
}

export async function getServicesPayload(): Promise<Service[]> {
  const services = await fetchServices();
  return services.map(mapService) satisfies Service[];
}
