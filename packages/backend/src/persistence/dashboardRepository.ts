import { TREND_HISTORY_POINTS } from "../constants/trendHistory";
import { db } from "../db";

export const fetchServices = () =>
  db.selectFrom("services").selectAll().orderBy("name", "asc").execute();

export const fetchIncidents = () =>
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

export const fetchRecentEvents = () =>
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

export const fetchTrendEvents = () =>
  db
    .selectFrom("incident_events")
    .select([
      "incident_events.incidentId",
      "incident_events.type",
      "incident_events.severity",
      "incident_events.createdAt",
    ])
    .orderBy("incident_events.createdAt", "desc")
    .limit(TREND_HISTORY_POINTS)
    .execute();

export const fetchDashboardSnapshot = () =>
  db.selectFrom("dashboard_snapshot").selectAll().executeTakeFirst();

export const fetchActiveServices = () =>
  db.selectFrom("services").select(["id", "isActive"]).execute();

export const fetchActiveIncidents = () =>
  db
    .selectFrom("incidents")
    .select(["id", "title", "severity", "status", "serviceId"])
    .execute();

export const updateDashboardSnapshot = (input: {
  id: string;
  openCount: number;
  criticalCount: number;
  warningCount: number;
  avgResponseTime: number;
  lastUpdatedAt: string;
}) =>
  db
    .updateTable("dashboard_snapshot")
    .set({
      openCount: input.openCount,
      criticalCount: input.criticalCount,
      warningCount: input.warningCount,
      avgResponseTime: input.avgResponseTime,
      lastUpdatedAt: input.lastUpdatedAt,
    })
    .where("id", "=", input.id)
    .execute();

export const updateIncident = (input: {
  id: string;
  status: string;
  severity: string;
  updatedAt: string;
  resolvedAt: string | null;
}) =>
  db
    .updateTable("incidents")
    .set({
      status: input.status,
      severity: input.severity,
      updatedAt: input.updatedAt,
      resolvedAt: input.resolvedAt,
    })
    .where("id", "=", input.id)
    .execute();

export const insertIncidentEvent = (input: {
  id: string;
  incidentId: string;
  type: string;
  message: string;
  severity: string | null;
  createdAt: string;
}) => db.insertInto("incident_events").values(input).execute();

export const pruneIncidentEventsHistory = async (limit = 150) => {
  const outdatedEvents = await db
    .selectFrom("incident_events")
    .select("id")
    .orderBy("createdAt", "desc")
    .offset(limit)
    .execute();

  if (outdatedEvents.length === 0) {
    return;
  }

  await db
    .deleteFrom("incident_events")
    .where(
      "id",
      "in",
      outdatedEvents.map((event) => event.id),
    )
    .execute();
};
