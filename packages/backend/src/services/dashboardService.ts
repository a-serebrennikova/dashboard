import { db } from "../db";
import type {
  DashboardPayload,
  Incident,
  IncidentEvent,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";
import { mapEvent, mapIncident, mapService } from "./dashboardPayloadMappers";

const toIsoOrNow = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value as string | number | Date);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
};

const fetchSnapshot = () =>
  db.selectFrom("dashboard_snapshot").selectAll().executeTakeFirst();

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
    .orderBy("incidents.createdAt", "desc")
    .limit(10)
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
  const [snapshot, services, incidents, recentEvents] = await Promise.all([
    fetchSnapshot(),
    fetchServices(),
    fetchIncidents(),
    fetchRecentEvents(),
  ]);

  if (!snapshot) {
    throw new Error("Dashboard snapshot not found");
  }

  return {
    generatedAt: new Date().toISOString(),
    snapshot: {
      openCount: snapshot.openCount,
      criticalCount: snapshot.criticalCount,
      warningCount: snapshot.warningCount,
      avgResponseTime: snapshot.avgResponseTime,
      lastUpdatedAt: toIsoOrNow(snapshot.lastUpdatedAt),
    },
    services: services.map(mapService) satisfies Service[],
    incidents: incidents.map(mapIncident) satisfies Incident[],
    recentEvents: recentEvents.map(mapEvent) satisfies IncidentEvent[],
  };
}
