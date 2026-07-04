export const CHART_MODES = ["stackedBar", "stacked", "step"] as const;

export type ChartMode = (typeof CHART_MODES)[number];

export type IncidentsTrendInputPoint = {
  second: string;
  timestampMs: number;
  total: number;
  critical: number;
  warning: number;
};

export type IncidentsChartPoint = IncidentsTrendInputPoint & {
  other: number;
};

export const CHART_MODE_LABELS: Record<ChartMode, string> = {
  stackedBar: "Bar",
  stacked: "Area",
  step: "Stairs",
};

const TOOLTIP_ORDER: Record<string, number> = {
  Open: 0,
  Warning: 1,
  Critical: 2,
  Other: 3,
};

export const sortTooltipItems = (item: { name?: string | number }): number => {
  return TOOLTIP_ORDER[String(item.name ?? "")] ?? Number.MAX_SAFE_INTEGER;
};
