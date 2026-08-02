import * as Tooltip from "@radix-ui/react-tooltip";
import type { ConnectionStatus } from "../../../../shared/types/dashboard";
import { STATUS_DESCRIPTIONS, STATUS_MAP } from "./utils/statusBadgeConsts";

const STATUS_INDICATOR_CLASSES: Record<ConnectionStatus, string> = {
  online: "bg-emerald-400",
  connecting: "bg-amber-500",
  reconnecting: "bg-yellow-500",
  offline: "bg-red-500",
};

interface StatusBadgeProps {
  connectionStatus?: ConnectionStatus;
}

export function StatusBadge({ connectionStatus }: StatusBadgeProps) {
  const resolvedStatus: ConnectionStatus = connectionStatus ?? "offline";
  const status = STATUS_MAP[resolvedStatus];
  const statusText = status.label.replace(/^\S+\s+/, "");
  const isReconnecting = resolvedStatus === "reconnecting";

  const srStatusText = isReconnecting ? "Reconnecting in progress" : statusText;

  return (
    <div className="flex items-center">
      <Tooltip.Provider delayDuration={120}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              aria-label={`Connection status: ${srStatusText}`}
              className={`inline-flex h-8 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors duration-300 ${status.classes}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${STATUS_INDICATOR_CLASSES[resolvedStatus]} ${
                  isReconnecting ? "animate-pulse" : ""
                }`}
                aria-hidden="true"
              />
              <span className="inline text-xs">
                <span>{statusText}</span>
              </span>
              <span className="sr-only">{srStatusText}</span>
            </button>
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
    </div>
  );
}
