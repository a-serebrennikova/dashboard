import type { FC } from "react";

interface StatusBadgeProps {
  isConnected: boolean;
}

const StatusBadge: FC<StatusBadgeProps> = ({ isConnected }) => (
  <span
    className={`px-4 py-1.5 rounded-full border ${
      isConnected
        ? "bg-green-100 text-green-600 border-green-200"
        : "bg-red-100 text-red-600 border-red-200"
    }`}
  >
    {isConnected ? "🟢 Online" : "🔴 Offline"}
  </span>
);

export default StatusBadge;
