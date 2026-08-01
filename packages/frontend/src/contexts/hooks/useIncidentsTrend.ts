import { useEffect, useReducer, useRef } from "react";
import type {
  DashboardPayload,
  IncidentsTrendPoint as SharedIncidentsTrendPoint,
} from "@package/dashboard-shared/dashboard";
import type { IncidentsTrendPoint } from "../../shared/types/dashboard";
import {
  formatDashboardTime,
  toDashboardTimestamp,
} from "../../shared/utils/formatDashboardTime";
import { countActiveIncidents } from "../../shared/utils/countActiveIncidents";

const MAX_INCIDENTS_TREND_POINTS = 30;
const INITIAL_INCIDENTS_TREND: IncidentsTrendPoint[] = [];

const normalizeTrendPoint = (
  index: number,
  point: SharedIncidentsTrendPoint,
): IncidentsTrendPoint => ({
  second: point.second,
  timestampMs: point.timestampMs,
  x: index,
  total: point.total,
  critical: point.critical,
  warning: point.warning,
});

const toTrendPoint = (
  payload: DashboardPayload,
): IncidentsTrendPoint | null => {
  const timestampMs = toDashboardTimestamp(payload.generatedAt);

  if (timestampMs === null) {
    console.warn("Skip trend point because generatedAt is invalid", payload);
    return null;
  }

  const incidentCounts = countActiveIncidents(payload.incidents);
  return {
    second: formatDashboardTime(timestampMs),
    timestampMs,
    x: 0,
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
    return [...previous.slice(0, -1), { ...point, x: lastPoint.x }];
  }

  return [...previous, point]
    .slice(-MAX_INCIDENTS_TREND_POINTS)
    .map((trendPoint, index) => ({ ...trendPoint, x: index }));
};

const seedInitialTrend = (
  history: SharedIncidentsTrendPoint[],
): IncidentsTrendPoint[] => {
  return history
    .slice(-MAX_INCIDENTS_TREND_POINTS)
    .map((point, index) => normalizeTrendPoint(index, point));
};

type TrendAction =
  | { type: "seed"; history: SharedIncidentsTrendPoint[] }
  | { type: "append"; payload: DashboardPayload };

const incidentsTrendReducer = (
  previous: IncidentsTrendPoint[],
  action: TrendAction,
): IncidentsTrendPoint[] => {
  if (action.type === "seed") {
    return seedInitialTrend(action.history);
  }

  return reduceIncidentsTrend(previous, action.payload);
};

export const useIncidentsTrend = (
  data: DashboardPayload | null,
  initialHistory: SharedIncidentsTrendPoint[] | undefined = undefined,
): IncidentsTrendPoint[] => {
  const [incidentsTrend, dispatchTrendAction] = useReducer(
    incidentsTrendReducer,
    INITIAL_INCIDENTS_TREND,
  );
  const initialHistoryAppliedRef = useRef(false);
  const initialPayloadHandledRef = useRef(false);

  useEffect(() => {
    const trendHistory = initialHistory ?? [];

    if (trendHistory.length === 0 || initialHistoryAppliedRef.current) {
      return;
    }

    dispatchTrendAction({ type: "seed", history: trendHistory });
    initialHistoryAppliedRef.current = true;
    initialPayloadHandledRef.current = false;
  }, [initialHistory]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const trendHistory = initialHistory ?? [];

    if (trendHistory.length > 0 && !initialHistoryAppliedRef.current) {
      return;
    }

    if (trendHistory.length > 0 && !initialPayloadHandledRef.current) {
      initialPayloadHandledRef.current = true;
      return;
    }

    dispatchTrendAction({ type: "append", payload: data });
  }, [data, initialHistory]);

  return incidentsTrend;
};
