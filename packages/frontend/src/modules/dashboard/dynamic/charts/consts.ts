import type { ReactNode } from "react";
import { DASHBOARD_DYNAMIC_COLORS } from "../severityColors";

export const CHART_MODES = ["step", "stacked", "stackedBar"] as const;

export type ChartMode = (typeof CHART_MODES)[number];

export type IncidentsChartPoint = {
  name: string;
  x: number;
  critical: number;
  warning: number;
  other: number;
  total: number;
};

export type IncidentsTrendInputPoint = {
  second: string;
  timestampMs: number;
  x: number;
  total: number;
  critical: number;
  warning: number;
};

export const CHART_MODE_LABELS: Record<ChartMode, string> = {
  step: "Steps",
  stacked: "Stacked",
  stackedBar: "Bars",
};

const TOOLTIP_ORDER: Record<string, number> = {
  Critical: 0,
  Warning: 1,
  Other: 2,
  critical: 0,
  warning: 1,
  other: 2,
};

export const TOOLTIP_CONTENT_STYLE = {
  background: DASHBOARD_DYNAMIC_COLORS.surface,
  border: `1px solid ${DASHBOARD_DYNAMIC_COLORS.border}`,
  borderRadius: 8,
  color: DASHBOARD_DYNAMIC_COLORS.tooltipText,
} as const;

export const TOOLTIP_LABEL_STYLE = {
  color: DASHBOARD_DYNAMIC_COLORS.axisText,
  fontSize: 12,
} as const;

const SERIES_NAMES: Record<string, string> = {
  critical: "Critical",
  warning: "Warning",
  other: "Other",
};

export const formatTooltipSeriesName = (
  name: string | number | undefined,
): string => {
  return SERIES_NAMES[String(name)] ?? String(name);
};

export const formatTooltipLabel = (
  label: ReactNode,
  payload: ReadonlyArray<{ payload?: IncidentsChartPoint }>,
): ReactNode => {
  const firstPoint = payload?.[0]?.payload;
  if (firstPoint?.name) {
    return firstPoint.name;
  }

  return label;
};

export const sortTooltipItems = (item: { name?: string | number }): number => {
  return TOOLTIP_ORDER[String(item.name ?? "")] ?? Number.MAX_SAFE_INTEGER;
};
