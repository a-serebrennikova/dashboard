import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SEVERITY_COLORS } from "../../model/severityColors";

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
    <div className="flex h-full min-h-[320px] flex-col rounded-lg border border-slate-700 bg-slate-900 p-5">
      <h3 className="text-sm font-medium text-slate-200 mb-4">
        Incidents by severity
      </h3>
      <div className="flex flex-1 flex-col gap-4">
        <div className="relative h-[180px] w-full sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={hasSeverityData ? 60 : 0}
                outerRadius={74}
                paddingAngle={0}
                strokeWidth={0}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[2.35rem] font-bold leading-none tracking-tight text-slate-100 sm:text-[2.75rem]">
              {severityTotal}
            </div>
            <div className="max-w-[88px] text-center text-[10px] leading-snug text-slate-500 sm:max-w-[92px]">
              Total open by severity
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-2.5">
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
                  <span className="min-w-0 text-[11px] text-slate-400">
                    {entry.name}
                  </span>
                </div>
                <span className="flex-shrink-0 text-[11px] font-medium text-slate-300">
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
