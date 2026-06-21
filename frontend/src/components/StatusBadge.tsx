import type { FC } from "react";
import type { ConnectionStatus } from "../types/graphTypes";

interface StatusBadgeProps {
  connectionStatus?: ConnectionStatus;
  isConnected?: boolean;
  retryInSeconds?: number | null;
  isRetryCooldown?: boolean;
  onRetry?: () => void;
}

const statusMap: Record<ConnectionStatus, { label: string; classes: string }> =
  {
    online: {
      label: "🟢 Online",
      classes: "bg-green-100 text-green-600 border-green-200",
    },
    connecting: {
      label: "🟠 Connecting",
      classes: "bg-amber-100 text-amber-700 border-amber-200",
    },
    reconnecting: {
      label: "🟡 Reconnecting",
      classes: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    offline: {
      label: "🔴 Offline",
      classes: "bg-red-100 text-red-600 border-red-200",
    },
  };

const StatusBadge: FC<StatusBadgeProps> = ({
  connectionStatus,
  isConnected,
  retryInSeconds,
  isRetryCooldown,
  onRetry,
}) => {
  const resolvedStatus: ConnectionStatus =
    connectionStatus ?? (isConnected ? "online" : "offline");
  const status = statusMap[resolvedStatus];
  const countdownText =
    resolvedStatus === "reconnecting" && typeof retryInSeconds === "number"
      ? ` (${retryInSeconds}s)`
      : "";
  const canRetry =
    typeof onRetry === "function" &&
    (resolvedStatus === "reconnecting" || resolvedStatus === "offline");

  return (
    <div className="flex items-center gap-2">
      <span className={`px-4 py-1.5 rounded-full border ${status.classes}`}>
        {`${status.label}${countdownText}`}
      </span>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetryCooldown}
          className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Retry now
        </button>
      )}
    </div>
  );
};

export default StatusBadge;
