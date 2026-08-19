import { StatusBadge } from "./StatusBadge";
import type { ConnectionStatus } from "../../../../shared/types/dashboard";

type TitleBlockProps = {
  connectionStatus: ConnectionStatus;
};

export const TitleBlock = ({ connectionStatus }: TitleBlockProps) => {
  return (
    <div className="flex-1">
      <p className="text-sm uppercase text-slate-500">
        Incident monitoring
      </p>

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="text-2xl font-semibold text-slate-50">
          Live Dashboard
        </h1>
        <StatusBadge connectionStatus={connectionStatus} />
      </div>
      <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
        Real-time overview of system incidents
      </p>
    </div>
  );
};
