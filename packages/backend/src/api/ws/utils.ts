import type {
  Incident,
  IncidentsTrendPoint,
  DashboardPayload,
} from "@package/dashboard-shared/dashboard";
import { DashboardUpdatePayload } from "@package/dashboard-shared/ws";
import { TREND_TIME_FORMATTER } from "../../consts";
import {
  MAX_SIMULATION_DELAY_MS,
  MIN_SIMULATION_DELAY_MS,
} from "../../simulations/consts";

const countActiveIncidentGroups = (incidents: Incident[]) => {
  let total = 0;
  let critical = 0;
  let warning = 0;

  for (const incident of incidents) {
    if (incident.status === "resolved") {
      continue;
    }

    total += 1;

    if (incident.severity === "critical") {
      critical += 1;
      continue;
    }

    if (incident.severity === "warning") {
      warning += 1;
    }
  }

  return { total, critical, warning };
};

const toTrendPoint = (
  generatedAt: string,
  incidents: Incident[],
): IncidentsTrendPoint | null => {
  const timestampMs = Date.parse(generatedAt);

  if (Number.isNaN(timestampMs)) {
    return null;
  }

  const counts = countActiveIncidentGroups(incidents);

  return {
    second: TREND_TIME_FORMATTER.format(new Date(timestampMs)),
    timestampMs,
    total: counts.total,
    critical: counts.critical,
    warning: counts.warning,
  };
};

export const buildUpdatePayload = (
  previousData: DashboardPayload | null,
  nextData: DashboardPayload,
): DashboardUpdatePayload => {
  if (!previousData) {
    const trendPoint = toTrendPoint(nextData.generatedAt, nextData.incidents);

    return {
      generatedAt: nextData.generatedAt,
      incidents: nextData.incidents,
      events: nextData.events,
      trendHistory: trendPoint ? [trendPoint] : undefined,
    };
  }

  const previousEventIds = new Set(
    previousData.events.map((event) => event.id),
  );

  const newEvents = nextData.events.filter(
    (event) => !previousEventIds.has(event.id),
  );

  const changedIncidentIds = new Set(
    newEvents.map((event) => event.incidentId),
  );
  
  const changedIncidents = nextData.incidents.filter((incident) =>
    changedIncidentIds.has(incident.id),
  );

  const trendPoint = toTrendPoint(nextData.generatedAt, nextData.incidents);

  return {
    generatedAt: nextData.generatedAt,
    incidents: changedIncidents.length > 0 ? changedIncidents : undefined,
    events: newEvents.length > 0 ? newEvents : undefined,
    trendHistory: trendPoint ? [trendPoint] : undefined,
  };
};

export const getNextDelayMs = () => {
  const delayRange = MAX_SIMULATION_DELAY_MS - MIN_SIMULATION_DELAY_MS;
  return MIN_SIMULATION_DELAY_MS + Math.floor(Math.random() * (delayRange + 1));
};
