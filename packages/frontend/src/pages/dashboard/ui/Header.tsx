import { StatusBadge } from "../../../modules/connection/ui/StatusBadge";
import { useDashboardConnection } from "../../../contexts/useDashboardConnection";

export const Header = () => {
  const { connectionStatus } = useDashboardConnection();

  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Incident monitoring
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-50">
          Live Dashboard
        </h1>
      </div>
      <StatusBadge connectionStatus={connectionStatus} />
    </div>
  );
};
