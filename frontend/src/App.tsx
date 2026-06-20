import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DashboardData, WebSocketMessage } from "./types/graphTypes";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("✅ Connected!");
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "init" || message.type === "update") {
          // ✅ IMPORTANT: create a new object so React sees the change
          setData({
            indicator1: message.data.indicator1,
            indicator2: message.data.indicator2,
            history: [...message.data.history], // also copy the array
          });
          console.log("✅ Data updated:", message.data);
        } else {
          console.log("⚠️ Unknown message type:", (message as any).type);
        }
      } catch (error) {
        console.error("❌ Parsing error:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("❌ Disconnected");
    };

    ws.onerror = (error: Event) => {
      console.error("❌ WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1>📊 Live Dashboard</h1>
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
      </div>

      {data ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #334155",
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                📈 Indicator 1
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#3b82f6",
                }}
              >
                {data.indicator1}
              </div>
            </div>
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #334155",
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                📉 Indicator 2
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#22c55e",
                }}
              >
                {data.indicator2}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #334155",
            }}
          >
            <h3
              style={{
                color: "#94a3b8",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              📊 Metrics history (last 15 points)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="indicator1"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="Indicator 1"
                />
                <Line
                  type="monotone"
                  dataKey="indicator2"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                  name="Indicator 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          ⏳ Waiting for data...
        </div>
      )}
    </div>
  );
}

export default App;
