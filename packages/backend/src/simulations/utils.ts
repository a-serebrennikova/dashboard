import {
  DOWN_SERVICE_LATENCY_IMPACT_MS,
  DOWN_SERVICE_RATIO_IMPACT_MS,
  BASE_RESPONSE_TIME_MS,
  OPEN_INCIDENT_LATENCY_IMPACT_MS,
  WARNING_INCIDENT_LATENCY_IMPACT_MS,
  CRITICAL_INCIDENT_LATENCY_IMPACT_MS,
  RESPONSE_TIME_JITTER_MS,
  RESPONSE_TIME_EMA_ALPHA,
} from "./consts";

// Keep a number within [min, max]
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// Return a random integer in [-range, +range]
export const randomDelta = (range: number) =>
  Math.round((Math.random() * 2 - 1) * range);

// Pick a random element from an array, or null if empty
export const pickRandom = <T>(items: T[]): T | null => {
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? null;
};

type ServiceForSimulation = {
  id: string;
  isActive: boolean;
};

type SnapshotForSimulation = {
  openCount: number;
  criticalCount: number;
  warningCount: number;
  avgResponseTime: number;
};

type IncidentForSimulation = {
  id: string;
  serviceId: string;
  title: string;
  severity: string;
  status: string;
};

export const getActiveServiceIds = (services: ServiceForSimulation[]) =>
  new Set(
    services.filter((service) => service.isActive).map((service) => service.id),
  );

export const calculateNextSnapshot = (
  snapshot: SnapshotForSimulation,
  services: ServiceForSimulation[],
) => {
  const nextOpenCount = clamp(snapshot.openCount + randomDelta(2), 0, 20);
  const nextCriticalRaw = clamp(snapshot.criticalCount + randomDelta(1), 0, 10);
  const nextCriticalCount = Math.min(nextCriticalRaw, nextOpenCount);
  const nextWarningCount = clamp(snapshot.warningCount + randomDelta(2), 0, 15);

  const totalServices = services.length;
  const activeServices = services.reduce(
    (count, service) => count + (service.isActive ? 1 : 0),
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

  return {
    nextOpenCount,
    nextCriticalCount,
    nextWarningCount,
    nextAverageResponseTime: clamp(smoothedResponseTime, 80, 2000),
  };
};

export const selectActiveIncident = (
  incidents: IncidentForSimulation[],
  activeServiceIds: Set<string>,
) =>
  pickRandom(
    incidents.filter((incident) => activeServiceIds.has(incident.serviceId)),
  );
