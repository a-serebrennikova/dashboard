import { db } from "../db";
import { randomUUID } from "node:crypto";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const randomDelta = (range: number) =>
  Math.round((Math.random() * 2 - 1) * range);

const pickRandom = <T>(items: T[]): T | null => {
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? null;
};

const BASE_RESPONSE_TIME_MS = 120;
const OPEN_INCIDENT_LATENCY_IMPACT_MS = 18;
const WARNING_INCIDENT_LATENCY_IMPACT_MS = 12;
const CRITICAL_INCIDENT_LATENCY_IMPACT_MS = 70;
const DOWN_SERVICE_LATENCY_IMPACT_MS = 45;
const DOWN_SERVICE_RATIO_IMPACT_MS = 140;
const RESPONSE_TIME_JITTER_MS = 12;
const RESPONSE_TIME_EMA_ALPHA = 0.35;

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

  const activeServiceIds = new Set(
    services.filter((s) => s.isActive).map((s) => s.id),
  );

  const nextOpenCount = clamp(snapshot.openCount + randomDelta(2), 0, 20);
  const nextCriticalRaw = clamp(snapshot.criticalCount + randomDelta(1), 0, 10);
  const nextCriticalCount = Math.min(nextCriticalRaw, nextOpenCount);
  const nextWarningCount = clamp(snapshot.warningCount + randomDelta(2), 0, 15);

  const totalServices = services.length;
  const activeServices = services.reduce(
    (count, service) => count + (Boolean(service.isActive) ? 1 : 0),
    0,
  );
  const downServices = Math.max(0, totalServices - activeServices);
  const downRatio = totalServices > 0 ? downServices / totalServices : 0;
  const servicesPenalty =
    downServices * DOWN_SERVICE_LATENCY_IMPACT_MS +
    Math.round(downRatio * DOWN_SERVICE_RATIO_IMPACT_MS);

  const targetResponseTime =
    BASE_RESPONSE_TIME_MS +
    nextOpenCount * OPEN_INCIDENT_LATENCY_IMPACT_MS +
    nextWarningCount * WARNING_INCIDENT_LATENCY_IMPACT_MS +
    nextCriticalCount * CRITICAL_INCIDENT_LATENCY_IMPACT_MS +
    servicesPenalty +
    randomDelta(RESPONSE_TIME_JITTER_MS);

  const smoothedResponseTime = Math.round(
    snapshot.avgResponseTime +
      (targetResponseTime - snapshot.avgResponseTime) * RESPONSE_TIME_EMA_ALPHA,
  );

  await db
    .updateTable("dashboard_snapshot")
    .set({
      openCount: nextOpenCount,
      criticalCount: nextCriticalCount,
      warningCount: nextWarningCount,
      avgResponseTime: clamp(smoothedResponseTime, 80, 2000),
      lastUpdatedAt: new Date().toISOString(),
    })
    .where("id", "=", snapshot.id)
    .execute();

  const incident = pickRandom(
    incidents.filter((i) => activeServiceIds.has(i.serviceId)),
  );

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
