import { useEffect, useReducer } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { IncidentsTrendPoint } from "../types/dashboard";
import {
  formatDashboardTime,
  toDashboardTimestamp,
} from "../utils/formatDashboardTime";
import { countActiveIncidents } from "../modules/dashboard/utils/countActiveIncidents";

const MAX_INCIDENTS_TREND_POINTS = 30;
const INITIAL_INCIDENTS_TREND: IncidentsTrendPoint[] = [];

const getLatestUpdatedAt = (payload: DashboardPayload): string => {
  let latestUpdatedAt = payload.incidents[0]?.updatedAt ?? payload.generatedAt;
  let latestTimestamp =
    toDashboardTimestamp(latestUpdatedAt) ?? Number.NEGATIVE_INFINITY;

  for (const incident of payload.incidents) {
    const incidentTimestamp =
      toDashboardTimestamp(incident.updatedAt) ?? Number.NEGATIVE_INFINITY;
    if (incidentTimestamp > latestTimestamp) {
      latestUpdatedAt = incident.updatedAt;
      latestTimestamp = incidentTimestamp;
    }
  }

  return latestUpdatedAt;
};

const toTrendPoint = (
  payload: DashboardPayload,
): IncidentsTrendPoint | null => {
  const latestUpdatedAt = getLatestUpdatedAt(payload);
  const timestampMs = toDashboardTimestamp(latestUpdatedAt);

  if (timestampMs === null) {
    console.warn(
      "Skip trend point because latest incident updatedAt is invalid",
      latestUpdatedAt,
    );
    return null;
  }

  const incidentCounts = countActiveIncidents(payload.incidents);
  return {
    second: formatDashboardTime(timestampMs),
    timestampMs,
    total: incidentCounts.openCount,
    critical: incidentCounts.criticalCount,
    warning: incidentCounts.warningCount,
  };
};

const reduceIncidentsTrend = (
  previous: IncidentsTrendPoint[],
  payload: DashboardPayload,
): IncidentsTrendPoint[] => {
  const point = toTrendPoint(payload);
  if (point === null) {
    return previous;
  }

  if (previous.length === 0) {
    return [point];
  }

  const lastPoint = previous[previous.length - 1];
  if (lastPoint.timestampMs === point.timestampMs) {
    return [...previous.slice(0, -1), point];
  }

  return [...previous, point].slice(-MAX_INCIDENTS_TREND_POINTS);
};

export const useIncidentsTrend = (
  data: DashboardPayload | null,
): IncidentsTrendPoint[] => {
  const [incidentsTrend, setIncidentsTrend] = useReducer(
    reduceIncidentsTrend,
    INITIAL_INCIDENTS_TREND,
  );

  useEffect(() => {
    if (data) {
      setIncidentsTrend(data);
    }
  }, [data]);

  return incidentsTrend;
};
