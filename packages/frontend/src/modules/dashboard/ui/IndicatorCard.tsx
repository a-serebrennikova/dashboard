import type { FC } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";

interface IndicatorCardProps {
  title: string;
  value: number;
  time: string;
  valueHint?: string;
  prevValue?: number;
  colorClass?: string;
  lowerIsBetter?: boolean;
}

export const IndicatorCard: FC<IndicatorCardProps> = ({
  title,
  value,
  colorClass = "text-white",
  time,
  valueHint,
}) => {
  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="flex items-baseline gap-3 align-items-center">
        <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
        {valueHint ? (
          <div className="text-xs text-slate-400 leading-tight">
            {valueHint}
          </div>
        ) : null}
      </div>
      <div className="text-slate-500 text-xs mt-2">
        🕐 {formatDateTime(time)}
      </div>
    </div>
  );
};
