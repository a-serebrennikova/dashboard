import { randomUUID } from "node:crypto";
import {
  fetchActiveIncidents,
  fetchActiveServices,
  fetchDashboardSnapshot,
  insertIncidentEvent,
  pruneIncidentEventsHistory,
  updateDashboardSnapshot,
  updateIncident,
} from "../persistence/dashboardRepository";
import type {
  IncidentSeverity,
  IncidentStatus,
} from "@package/dashboard-shared/dashboard";
import { INCIDENT_SEVERITIES } from "@package/dashboard-shared/dashboard";
import { isIncidentSeverity, isIncidentStatus } from "../utils";
import {
  getActiveServiceIds,
  calculateNextSnapshot,
  selectActiveIncident,
} from "./utils";

const normalizeIncidentStatus = (value: string): IncidentStatus => {
  return isIncidentStatus(value) ? value : "open";
};

const normalizeIncidentSeverity = (value: string): IncidentSeverity => {
  return isIncidentSeverity(value) ? value : "warning";
};

export async function simulateDataChanges(): Promise<void> {
  const [snapshot, services, incidents] = await Promise.all([
    fetchDashboardSnapshot(),
    fetchActiveServices(),
    fetchActiveIncidents(),
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

  await updateDashboardSnapshot({
    id: snapshot.id,
    openCount: nextOpenCount,
    criticalCount: nextCriticalCount,
    warningCount: nextWarningCount,
    avgResponseTime: nextAverageResponseTime,
    lastUpdatedAt: new Date().toISOString(),
  });

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

  await updateIncident({
    id: incident.id,
    status: nextStatus,
    severity: nextSeverity,
    updatedAt: nowIso,
    resolvedAt: nextStatus === "resolved" ? nowIso : null,
  });

  const eventType = nextStatus === "resolved" ? "resolved" : "updated";
  const eventMessage =
    eventType === "resolved"
      ? `Incident resolved: ${incident.title}`
      : `State refreshed for incident: ${incident.title}`;

  await insertIncidentEvent({
    id: randomUUID(),
    incidentId: incident.id,
    type: eventType,
    message: eventMessage,
    severity: nextSeverity,
    createdAt: nowIso,
  });

  await pruneIncidentEventsHistory();
}
