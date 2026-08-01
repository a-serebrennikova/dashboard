import { Tooltip } from "recharts";
import {
  formatTooltipLabel,
  formatTooltipSeriesName,
  sortTooltipItems,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from "./consts";

type Props = {
  cursor?: {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
  };
};

export const IncidentsChartTooltip = ({ cursor }: Props) => (
  <Tooltip
    cursor={cursor}
    labelFormatter={formatTooltipLabel}
    formatter={(value, name) => [value ?? 0, formatTooltipSeriesName(name)]}
    itemSorter={sortTooltipItems}
    contentStyle={TOOLTIP_CONTENT_STYLE}
    labelStyle={TOOLTIP_LABEL_STYLE}
  />
);
