import type { ConnectionStatus } from "@package/dashboard-shared/contracts/ws";

export const STATUS_MAP: Record<
  ConnectionStatus,
  { label: string; classes: string }
> = {
  online: {
    label: "🟢 Online",
    classes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  connecting: {
    label: "🟠 Connecting",
    classes: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
  reconnecting: {
    label: "🟡 Reconnecting",
    classes: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  },
  offline: {
    label: "🔴 Offline",
    classes: "bg-red-500/10 text-red-300 border-red-500/30",
  },
};

export const STATUS_DESCRIPTIONS: Record<ConnectionStatus, string> = {
  online: "Connection is active, realtime data is streaming.",
  connecting: "Establishing the initial connection to the WebSocket server.",
  reconnecting: "Trying to restore the connection after an interruption.",
  offline: "No server connection. Automatic retry attempts have stopped.",
};
