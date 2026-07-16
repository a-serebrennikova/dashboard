export const QuickActionsCard = () => {
  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
      <h3 className="text-sm font-medium text-slate-200 mb-4">Quick actions</h3>
      <div className="space-y-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-800 transition-colors">
          <span>➕</span> Create incident
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-800 transition-colors">
          <span>⚙️</span> Configure alerts
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-800 transition-colors">
          <span>🔄</span> Maintenance mode
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-800 transition-colors">
          <span>🔃</span> Refresh now
        </button>
      </div>
    </div>
  );
};
