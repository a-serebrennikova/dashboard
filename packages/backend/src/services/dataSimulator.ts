import { db } from "../db";
import { randomUUID } from "node:crypto";
import {
  calculateNextSnapshot,
  getActiveServiceIds,
  selectActiveIncident,
} from "./dataSimulationUtils";

export async function simulateDataChanges(): Promise<void> {
  const [snapshot, services, incidents] = await Promise.all([
    db.selectFrom("dashboard_snapshot").selectAll().executeTakeFirst(),
    db.selectFrom("services").select(["id", "isActive"]).execute(),
    db
      .selectFrom("incidents")
      .select(["id", "title", "severity", "status", "serviceId"])
      .execute(),
  ]);

  if (!snapshot) {
    return;
  }

  const activeServiceIds = getActiveServiceIds(services);
  const {
    nextOpenCount,
    nextCriticalCount,
    nextWarningCount,
    nextAverageResponseTime,
  } = calculateNextSnapshot(snapshot, services);

  await db
    .updateTable("dashboard_snapshot")
    .set({
      openCount: nextOpenCount,
      criticalCount: nextCriticalCount,
      warningCount: nextWarningCount,
      avgResponseTime: nextAverageResponseTime,
      lastUpdatedAt: new Date().toISOString(),
    })
    .where("id", "=", snapshot.id)
    .execute();

  const incident = selectActiveIncident(incidents, activeServiceIds);

  if (!incident) {
    return;
  }

  const eventType = incident.status === "resolved" ? "resolved" : "updated";
  const eventMessage =
    eventType === "resolved"
      ? `Incident resolved: ${incident.title}`
      : `State refreshed for incident: ${incident.title}`;

  await db
    .insertInto("incident_events")
    .values({
      id: randomUUID(),
      incidentId: incident.id,
      type: eventType,
      message: eventMessage,
      severity: incident.severity,
      createdAt: new Date().toISOString(),
    })
    .execute();
}
