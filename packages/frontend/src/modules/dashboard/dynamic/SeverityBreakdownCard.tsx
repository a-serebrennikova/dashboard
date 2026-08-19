import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useResizer } from "../../../shared/hooks/useResizer";
import { DASHBOARD_DYNAMIC_COLORS, SEVERITY_COLORS } from "./severityColors";

type SeverityBreakdownCardProps = {
  criticalCount: number;
  warningCount: number;
  otherCount: number;
};

export const SeverityBreakdownCard = ({
  criticalCount,
  warningCount,
  otherCount,
}: SeverityBreakdownCardProps) => {
  const { ref: containerRef, width } = useResizer<HTMLDivElement>();
  const isWideLayout = width > 400;

  const severityTotal = criticalCount + warningCount + otherCount;
  const severityData = [
    { name: "Critical", value: criticalCount, color: SEVERITY_COLORS.critical },
    { name: "Warning", value: warningCount, color: SEVERITY_COLORS.warning },
    { name: "Other", value: otherCount, color: SEVERITY_COLORS.other },
  ];
  const hasSeverityData = severityTotal > 0;
  const pieData = hasSeverityData
    ? severityData
    : [{ name: "No data", value: 1, color: SEVERITY_COLORS.noData }];

  return (
    <div
      ref={containerRef}
      className="panel-surface flex h-full min-h-[320px] flex-col"
    >
      <h3 className="text-base font-medium text-slate-200 mb-4">
        Incidents by severity
      </h3>
      <div
        className={`flex flex-1 gap-4 ${
          isWideLayout ? "flex-row items-center" : "flex-col"
        }`}
      >
        <div
          className={`dashboard-chart relative ${
            isWideLayout
              ? "h-[180px] w-[200px] shrink-0"
              : "h-[180px] w-full sm:h-[200px]"
          }`}
        >
          <div className="relative z-10 h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={74}
                  paddingAngle={0}
                  strokeWidth={0}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 30 }}
                  contentStyle={{
                    background: DASHBOARD_DYNAMIC_COLORS.surface,
                    border: `1px solid ${DASHBOARD_DYNAMIC_COLORS.border}`,
                    borderRadius: "8px",
                    color: DASHBOARD_DYNAMIC_COLORS.tooltipText,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
            <div className="text-[1.9rem] font-bold leading-none tracking-tight text-slate-100 sm:text-[2.2rem]">
              {severityTotal}
            </div>
            <div className="mt-1 max-w-[96px] text-center text-xs leading-snug text-slate-500">
              Total open by severity
            </div>
          </div>
        </div>

        <div
          className={`${isWideLayout ? "min-w-0 flex-1" : "mt-auto"} space-y-2.5`}
        >
          {severityData.map((entry) => {
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between py-0.5 sm:py-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span
                    className="min-w-0 text-xs"
                    style={{ color: entry.color }}
                  >
                    {entry.name}
                  </span>
                </div>
                <span
                  className="flex-shrink-0 text-xs font-medium"
                  style={{ color: entry.color }}
                >
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
