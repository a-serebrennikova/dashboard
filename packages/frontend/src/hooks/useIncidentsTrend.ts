import { useEffect, useReducer } from "react";
import type { DashboardPayload } from "@package/dashboard-shared/contracts/dashboard";
import type { IncidentsTrendPoint } from "../types/dashboard";
import { transformToTimeFormat } from "../utils/transformToTimeFormat";

const MAX_INCIDENTS_TREND_POINTS = 60;

type TrendAction = {
  type: "ingest";
  payload: DashboardPayload;
};

const trendReducer = (
  previous: IncidentsTrendPoint[],
  action: TrendAction,
): IncidentsTrendPoint[] => {
  const { payload } = action;
  const timestampMs = Date.parse(payload.generatedAt);
  if (Number.isNaN(timestampMs)) {
    console.warn(
      "Skip trend point because generatedAt is invalid",
      payload.generatedAt,
    );
    return previous;
  }

  const point: IncidentsTrendPoint = {
    second: transformToTimeFormat(payload.generatedAt),
    timestampMs,
    total: payload.snapshot.openCount,
    critical: payload.snapshot.criticalCount,
  };

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
  const [incidentsTrend, dispatch] = useReducer(
    trendReducer,
    [] as IncidentsTrendPoint[],
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    dispatch({ type: "ingest", payload: data });
  }, [data]);

  return incidentsTrend;
};
