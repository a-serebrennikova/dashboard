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
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "init" || message.type === "update") {
          setData({
            indicator1: message.data.indicator1,
            indicator2: message.data.indicator2,
            timestamp: message.data.timestamp,
            history: [...message.data.history],
          });
        } else {
          console.error("⚠️ Unknown message type:", (message as any).type);
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
