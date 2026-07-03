import { db } from "../db";
import type {
  DashboardPayload,
  Incident,
  IncidentEvent,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";
import { mapEvent, mapIncident, mapService } from "./dashboardPayloadMappers";

const fetchServices = () =>
  db.selectFrom("services").selectAll().orderBy("name", "asc").execute();

const fetchIncidents = () =>
  db
    .selectFrom("incidents")
    .innerJoin("services", "incidents.serviceId", "services.id")
    .select([
      "incidents.id",
      "incidents.serviceId",
      "incidents.title",
      "incidents.description",
      "incidents.severity",
      "incidents.status",
      "incidents.createdAt",
      "incidents.updatedAt",
      "incidents.resolvedAt",
      "services.name as serviceName",
    ])
    .orderBy("incidents.updatedAt", "desc")
    .execute();

const fetchRecentEvents = () =>
  db
    .selectFrom("incident_events")
    .innerJoin("incidents", "incident_events.incidentId", "incidents.id")
    .innerJoin("services", "incidents.serviceId", "services.id")
    .select([
      "incident_events.id",
      "incident_events.incidentId",
      "incident_events.type",
      "incident_events.message",
      "incident_events.severity",
      "incident_events.createdAt",
      "incidents.title as incidentTitle",
      "services.name as serviceName",
    ])
    .orderBy("incident_events.createdAt", "desc")
    .limit(12)
    .execute();

export async function getDashboardPayload(): Promise<DashboardPayload> {
  const [services, incidents, recentEvents] = await Promise.all([
    fetchServices(),
    fetchIncidents(),
    fetchRecentEvents(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    services: services.map(mapService) satisfies Service[],
    incidents: incidents.map(mapIncident) satisfies Incident[],
    recentEvents: recentEvents.map(mapEvent) satisfies IncidentEvent[],
  };
}
