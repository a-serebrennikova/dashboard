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
  variant?: "default" | "highlight";
  breakdown?: Array<{
    label: string;
    value: number;
    className: string;
  }>;
}

export const IndicatorCard: FC<IndicatorCardProps> = ({
  title,
  value,
  colorClass = "text-white",
  time,
  valueHint,
  prevValue,
  variant = "default",
  breakdown,
}) => {
  const isHighlight = variant === "highlight";
  const delta = typeof prevValue === "number" ? value - prevValue : null;
  const hasDeltaChange = delta !== null && delta !== 0;
  const deltaClass =
    delta === null
      ? ""
      : delta > 0
        ? "text-red-300 border-red-500/30 bg-red-500/10"
        : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";
  const deltaArrow = delta === null ? null : delta > 0 ? "↑" : "↓";
  const deltaText =
    delta === null ? null : delta > 0 ? `+${delta}` : `${Math.abs(delta)}`;

  return (
    <div
      className={`rounded-lg border p-5 ${
        isHighlight
          ? "border-slate-600 bg-slate-900"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-slate-300">{title}</div>
        <div className="text-[11px] text-slate-500">{formatDateTime(time)}</div>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="align-items-center self-center flex items-center justify-center gap-3 text-center">
          <div className={`text-4xl font-semibold leading-none ${colorClass}`}>
            {value}
          </div>
          {hasDeltaChange && deltaText !== null ? (
            <div
              className={`rounded-md border px-2 py-1 text-[11px] font-medium ${deltaClass}`}
            >
              <span className="mr-1">{deltaArrow}</span>
              <span>{deltaText}</span>
            </div>
          ) : null}
          {valueHint ? (
            <div className="text-xs leading-tight text-slate-400">
              {valueHint}
            </div>
          ) : null}
        </div>

        {breakdown && breakdown.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className={`w-[73px] rounded-md border px-2 py-2 text-[11px] ${item.className}`}
              >
                <div className="uppercase tracking-wide">{item.label}</div>
                <div className="mt-1 text-base font-semibold leading-none">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
