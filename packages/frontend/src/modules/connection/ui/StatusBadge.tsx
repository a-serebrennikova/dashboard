import * as Tooltip from "@radix-ui/react-tooltip";
import type { ConnectionStatus } from "../../../types/dashboard";
import { STATUS_DESCRIPTIONS, STATUS_MAP } from "../utils/statusBadgeConsts";

interface StatusBadgeProps {
  connectionStatus?: ConnectionStatus;
  isConnected?: boolean;
  retryInSeconds?: number | null;
  isRetryCooldown?: boolean;
  onRetry?: () => void;
}

export function StatusBadge({
  connectionStatus,
  isConnected,
  retryInSeconds,
  isRetryCooldown,
  onRetry,
}: StatusBadgeProps) {
  const resolvedStatus: ConnectionStatus =
    connectionStatus ?? (isConnected ? "online" : "offline");
  const status = STATUS_MAP[resolvedStatus];
  const countdownText =
    resolvedStatus === "reconnecting" && typeof retryInSeconds === "number"
      ? ` (${retryInSeconds}s)`
      : "";
  const canRetry =
    onRetry &&
    (resolvedStatus === "reconnecting" || resolvedStatus === "offline");

  return (
    <div className="flex items-center gap-2">
      <Tooltip.Provider delayDuration={120}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span
              className={`px-4 py-1.5 rounded-full border ${status.classes}`}
            >
              {`${status.label}${countdownText}`}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="bottom"
              sideOffset={8}
              className="max-w-[320px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs leading-5 text-slate-200 shadow-xl"
            >
              {STATUS_DESCRIPTIONS[resolvedStatus]}
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
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
}
