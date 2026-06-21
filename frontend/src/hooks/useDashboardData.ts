import { useEffect, useRef, useState } from "react";
import type { DashboardData, WebSocketMessage } from "../types/graphTypes";

const DEFAULT_WS_URL = "ws://localhost:8080";

export function useDashboardData(url = DEFAULT_WS_URL) {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const { type, data }: WebSocketMessage = JSON.parse(event.data);

        if (type === "init" || type === "update") {
          const { indicator1, indicator2, timestamp, history } = data;
          setData({
            indicator1: indicator1,
            indicator2: indicator2,
            timestamp: timestamp,
            history: [...history],
          });
        } else {
          console.error("⚠️ Unknown message type:", type);
        }
      } catch (error) {
        console.error("❌ Parsing error:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error: Event) => {
      console.error("❌ WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { isConnected, data };
}
