import { WebSocketServer, WebSocket } from "ws";
import { generateNewData, getInitialState } from "./dataGenerated.js";

const PORT = process.env.PORT || 8080;

let wss: WebSocketServer;
let intervalId: ReturnType<typeof setInterval>;

try {
  wss = new WebSocketServer({ port: Number(PORT) });
  console.log(`🟢 WebSocket server started on port ${PORT}`);
  console.log(`📡 Connect at: ws://localhost:${PORT}`);

  let currentData = getInitialState();

  const createMessage = (type: "init" | "update", data: unknown) =>
    JSON.stringify({ type, data });

  const sendMessage = (
    ws: WebSocket,
    type: "init" | "update",
    data: unknown,
  ) => {
    try {
      ws.send(createMessage(type, data));
    } catch (error) {
      console.error(`❌ Failed to send ${type} message:`, error);
    }
  };

  const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        (client as WebSocket).send(message);
      }
    });
  };

  wss.on("connection", (ws: WebSocket) => {
    console.log(`👤 New client connected! (Total: ${wss.clients.size})`);

    sendMessage(ws, "init", currentData);
    console.log("📤 Initial data sent");

    ws.on("message", (message) => {
      console.log(`📨 Message received: ${message}`);
    });

    ws.on("close", () => {
      console.log(`👋 Client disconnected (Remaining: ${wss.clients.size})`);
    });
  });

  console.log("⏳ Starting interval...");

  intervalId = setInterval(() => {
    try {
      currentData = generateNewData();
      const updateMessage = createMessage("update", currentData);

      console.log(
        `📊 Indicator1: ${currentData.indicator1}, Indicator2: ${currentData.indicator2}`,
      );

      broadcastMessage(updateMessage);
    } catch (error) {
      console.error("❌ Interval error:", error);
    }
  }, 5000);

  console.log("✅ Interval started!");
} catch (error) {
  console.error("❌ CRITICAL ERROR:", error);
}

process.on("SIGINT", () => {
  clearInterval(intervalId);
  wss.close(() => {
    console.log("\n🛑 Server stopped");
    process.exit(0);
  });
});
