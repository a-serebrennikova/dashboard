import { db } from "../../db";
import { TREND_HISTORY_POINTS } from "./constants";

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
