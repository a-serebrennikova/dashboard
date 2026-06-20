import type { FC } from "react";

interface StatusBadgeProps {
  isConnected: boolean;
}

const StatusBadge: FC<StatusBadgeProps> = ({ isConnected }) => (
  <span
    style={{
      padding: "6px 16px",
      borderRadius: "20px",
      background: isConnected ? "#22c55e20" : "#ef444420",
      color: isConnected ? "#22c55e" : "#ef4444",
      border: `1px solid ${isConnected ? "#22c55e40" : "#ef444440"}`,
    }}
  >
    {isConnected ? "🟢 Online" : "🔴 Offline"}
  </span>
);

export default StatusBadge;
