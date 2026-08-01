import type {
  IncidentsChartPoint,
  IncidentsTrendInputPoint,
} from "../charts/consts";

export const buildIncidentsChartData = (
  trend: IncidentsTrendInputPoint[],
): IncidentsChartPoint[] =>
  trend.map((point) => ({
    name: point.second,
    x: point.x,
    critical: point.critical,
    warning: point.warning,
    other: Math.max(point.total - point.critical - point.warning, 0),
    total: point.total,
  }));
