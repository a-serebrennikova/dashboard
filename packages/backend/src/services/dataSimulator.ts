import { db } from "../db";
import { randomUUID } from "node:crypto";
import {
  calculateNextSnapshot,
  getActiveServiceIds,
  selectActiveIncident,
} from "./dataSimulationUtils";

const INCIDENT_STATUSES = ["open", "investigating", "resolved"] as const;
type IncidentStatus = (typeof INCIDENT_STATUSES)[number];
const isIncidentStatus = (value: string): value is IncidentStatus => {
  return INCIDENT_STATUSES.some((status) => status === value);
};

const INCIDENT_SEVERITIES = ["info", "warning", "critical"] as const;
type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];
const isIncidentSeverity = (value: string): value is IncidentSeverity => {
  return INCIDENT_SEVERITIES.some((severity) => severity === value);
};

const normalizeIncidentStatus = (value: string): IncidentStatus => {
  return isIncidentStatus(value) ? value : "open";
};

const normalizeIncidentSeverity = (value: string): IncidentSeverity => {
  return isIncidentSeverity(value) ? value : "warning";
};

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

  const nowIso = new Date().toISOString();
  const shouldResolve = incident.status !== "resolved" && Math.random() < 0.2;
  const shouldReopen = incident.status === "resolved" && Math.random() < 0.25;

  let nextStatus: IncidentStatus = normalizeIncidentStatus(incident.status);

  if (shouldResolve) {
    nextStatus = "resolved";
  } else if (shouldReopen) {
    nextStatus = Math.random() < 0.5 ? "open" : "investigating";
  } else if (incident.status !== "resolved" && Math.random() < 0.35) {
    nextStatus = incident.status === "open" ? "investigating" : "open";
  }

  const severityOrder = INCIDENT_SEVERITIES;
  const currentSeverityIndex = severityOrder.indexOf(
    normalizeIncidentSeverity(incident.severity),
  );
  const canAdjustSeverity = incident.status !== "resolved";
  const shouldIncreaseSeverity = canAdjustSeverity && Math.random() < 0.25;
  const shouldDecreaseSeverity = canAdjustSeverity && Math.random() < 0.2;

  let nextSeverity: IncidentSeverity = normalizeIncidentSeverity(
    incident.severity,
  );
  if (currentSeverityIndex !== -1) {
    if (shouldIncreaseSeverity) {
      nextSeverity =
        severityOrder[
          Math.min(currentSeverityIndex + 1, severityOrder.length - 1)
        ] ?? nextSeverity;
    } else if (shouldDecreaseSeverity) {
      nextSeverity =
        severityOrder[Math.max(currentSeverityIndex - 1, 0)] ?? nextSeverity;
    }
  }

  await db
    .updateTable("incidents")
    .set({
      status: nextStatus,
      severity: nextSeverity,
      updatedAt: nowIso,
      resolvedAt: nextStatus === "resolved" ? nowIso : null,
    })
    .where("id", "=", incident.id)
    .execute();

  const eventType = nextStatus === "resolved" ? "resolved" : "updated";
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
      severity: nextSeverity,
      createdAt: nowIso,
    })
    .execute();
}
