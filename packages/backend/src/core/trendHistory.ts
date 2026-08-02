import type {
  DashboardInitPayload,
  DashboardPayload,
  Incident,
  IncidentsTrendPoint,
} from "@package/dashboard-shared/dashboard";
import { fetchTrendEvents } from "../persistence/dashboardRepository";
import { TREND_TIME_FORMATTER, TREND_HISTORY_POINTS } from "../consts";

type TrendEventRow = {
  incidentId: string;
  type: string;
  severity: string | null;
  createdAt: string;
};

type TrendCounts = {
  total: number;
  critical: number;
  warning: number;
};

const countTrendCounts = (incidents: Incident[]): TrendCounts => {
  const activeIncidents = incidents.filter(
    (incident) => incident.status !== "resolved",
  );

  return {
    total: activeIncidents.length,
    critical: activeIncidents.filter(
      (incident) => incident.severity === "critical",
    ).length,
    warning: activeIncidents.filter(
      (incident) => incident.severity === "warning",
    ).length,
  };
};

const formatTrendTime = (timestampMs: number) =>
  TREND_TIME_FORMATTER.format(new Date(timestampMs));

const getEventSeverity = (
  event: TrendEventRow,
  incidentsById: Map<string, Incident>,
) => {
  if (event.severity) {
    return event.severity;
  }

  return incidentsById.get(event.incidentId)?.severity ?? "warning";
};

const createTrendPoint = (
  timestampMs: number,
  counts: TrendCounts,
): IncidentsTrendPoint => ({
  second: formatTrendTime(timestampMs),
  timestampMs,
  total: counts.total,
  critical: counts.critical,
  warning: counts.warning,
});

const applyTrendEvent = (
  counts: TrendCounts,
  event: TrendEventRow,
  incidentsById: Map<string, Incident>,
) => {
  const nextCounts = { ...counts };
  const eventSeverity = getEventSeverity(event, incidentsById);

  if (event.type === "created") {
    nextCounts.total = Math.max(nextCounts.total - 1, 0);

    if (eventSeverity === "critical") {
      nextCounts.critical = Math.max(nextCounts.critical - 1, 0);
    } else if (eventSeverity === "warning") {
      nextCounts.warning = Math.max(nextCounts.warning - 1, 0);
    }
  }

  if (event.type === "resolved") {
    nextCounts.total += 1;

    if (eventSeverity === "critical") {
      nextCounts.critical += 1;
    } else if (eventSeverity === "warning") {
      nextCounts.warning += 1;
    }
  }

  return nextCounts;
};

const replayTrendHistory = (
  events: TrendEventRow[],
  incidentsById: Map<string, Incident>,
  initialCounts: TrendCounts,
) => {
  let counts = initialCounts;
  const points: IncidentsTrendPoint[] = [];

  for (const event of events) {
    const timestampMs = Date.parse(event.createdAt);

    if (!Number.isNaN(timestampMs)) {
      points.push(createTrendPoint(timestampMs, counts));
    }

    counts = applyTrendEvent(counts, event, incidentsById);
  }

  return points.reverse().slice(-TREND_HISTORY_POINTS);
};

const buildTrendHistory = async (
  data: DashboardPayload,
): Promise<IncidentsTrendPoint[]> => {
  const events = await fetchTrendEvents();
  const incidentsById = new Map(
    data.incidents.map((incident) => [incident.id, incident]),
  );
  const currentCounts = countTrendCounts(data.incidents);

  return replayTrendHistory(events, incidentsById, currentCounts);
};

export const buildInitPayload = async (
  data: DashboardPayload,
): Promise<DashboardInitPayload> => ({
  ...data,
  trendHistory: await buildTrendHistory(data),
});
