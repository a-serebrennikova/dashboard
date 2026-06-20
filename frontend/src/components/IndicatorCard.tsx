import type { FC } from "react";

interface IndicatorCardProps {
  title: string;
  value: number;
  color: string;
}

const IndicatorCard: FC<IndicatorCardProps> = ({ title, value, color }) => (
  <div
    style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #334155",
    }}
  >
    <div style={{ color: "#94a3b8", fontSize: "14px" }}>{title}</div>
    <div
      style={{
        fontSize: "32px",
        fontWeight: "bold",
        color,
      }}
    >
      {value}
    </div>
  </div>
);

export default IndicatorCard;
