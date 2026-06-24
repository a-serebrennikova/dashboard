import { db } from "../db";
import type {
  DashboardPayload,
  Incident,
  IncidentEvent,
  IncidentEventType,
  IncidentSeverity,
  IncidentStatus,
  Service,
} from "@package/dashboard-shared/contracts/dashboard";

export async function getDashboardPayload(): Promise<DashboardPayload> {
  const [snapshot, services, incidents, recentEvents] = await Promise.all([
    db.selectFrom("dashboard_snapshot").selectAll().executeTakeFirst(),
    db.selectFrom("services").selectAll().orderBy("name", "asc").execute(),
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
      .execute(),
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
      .execute(),
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
      lastUpdatedAt: new Date(snapshot.lastUpdatedAt).toISOString(),
    },
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      team: service.team,
      isActive: Boolean(service.isActive),
      createdAt: new Date(service.createdAt).toISOString(),
      updatedAt: new Date(service.updatedAt).toISOString(),
    })) satisfies Service[],
    incidents: incidents.map((incident) => ({
      id: incident.id,
      serviceId: incident.serviceId,
      serviceName: incident.serviceName,
      title: incident.title,
      description: incident.description,
      severity: incident.severity as IncidentSeverity,
      status: incident.status as IncidentStatus,
      createdAt: new Date(incident.createdAt).toISOString(),
      updatedAt: new Date(incident.updatedAt).toISOString(),
      resolvedAt: incident.resolvedAt
        ? new Date(incident.resolvedAt).toISOString()
        : null,
    })) satisfies Incident[],
    recentEvents: recentEvents.map((event) => ({
      id: event.id,
      incidentId: event.incidentId,
      incidentTitle: event.incidentTitle,
      serviceName: event.serviceName,
      type: event.type as IncidentEventType,
      message: event.message,
      severity: event.severity as IncidentSeverity | null,
      createdAt: new Date(event.createdAt).toISOString(),
    })) satisfies IncidentEvent[],
  };
}
