type SystemHealthCardProps = {
  activeServicesCount: number;
  openCount: number;
  resolvedTodayCount: number;
};

export const SystemHealthCard = ({
  activeServicesCount,
  openCount,
  resolvedTodayCount,
}: SystemHealthCardProps) => {
  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <h3 className="text-sm font-medium text-slate-200 mb-4">System health</h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Active services</span>
          <span className="font-medium text-emerald-400">
            {activeServicesCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Open incidents</span>
          <span className="font-medium text-red-400">{openCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Resolved today</span>
          <span className="font-medium text-emerald-400">
            {resolvedTodayCount}
          </span>
        </div>
      </div>
    </div>
  );
};
