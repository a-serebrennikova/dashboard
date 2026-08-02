import { StatusBadge } from "./StatusBadge";
import type { ConnectionStatus } from "../../../../shared/types/dashboard";

type TitleBlockProps = {
  connectionStatus: ConnectionStatus;
};

export const TitleBlock = ({ connectionStatus }: TitleBlockProps) => {
  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
        Incident monitoring
      </p>

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="text-2xl font-semibold text-slate-50 sm:whitespace-nowrap">
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
