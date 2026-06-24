import type { FC } from "react";
import { ArrowUp, ArrowDown } from "./ArrowIcons";

interface IndicatorCardProps {
  title: string;
  value: number;
  time: string;
  prevValue?: number;
  colorClass?: string;
}

const IndicatorCard: FC<IndicatorCardProps> = ({
  title,
  value,
  colorClass = "text-white",
  time,
  prevValue,
}) => {
  const hasPrev = typeof prevValue === "number";
  const delta = hasPrev ? value - prevValue : 0;
  const percent = hasPrev && prevValue !== 0 ? delta / prevValue * 100 : null;

  const formatPercent = (p: number | null) => {
    if (p === null) return "—";
    const sign = p > 0 ? "+" : p < 0 ? "" : "";
    return `${sign}${p.toFixed(0)}%`;
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="text-slate-400 text-sm">{title}</div>

      <div className="flex items-baseline gap-3">
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>

        {hasPrev && (
          <div className="flex items-center text-sm font-medium">
            {delta > 0 ? (
              <ArrowUp className="text-green-400" />
            ) : delta < 0 ? (
              <ArrowDown className="text-red-400" />
            ) : (
              <span className="text-slate-400">—</span>
            )}
            <span
              className={`ml-1 ${
                delta > 0
                  ? "text-green-400"
                  : delta < 0
                    ? "text-red-400"
                    : "text-slate-400"
              }`}
            >
              {formatPercent(percent)}
            </span>
          </div>
        )}
      </div>
      <div className="text-slate-500 text-xs mt-2">🕐 {time}</div>
    </div>
  );
};

export default IndicatorCard;
