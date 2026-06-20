import { WebSocketServer, WebSocket } from "ws";
import { generateNewData, getInitialState } from "./dataGenerated.js";

const PORT = process.env.PORT || 8080;

try {
  const wss = new WebSocketServer({ port: Number(PORT) });
  console.log(`🟢 WebSocket server started on port ${PORT}`);
  console.log(`📡 Connect at: ws://localhost:${PORT}`);

  let currentData = getInitialState();

  wss.on("connection", (ws: WebSocket) => {
    console.log(`👤 New client connected! (Total: ${wss.clients.size})`);

    try {
      ws.send(
        JSON.stringify({
          type: "init",
          data: currentData,
        }),
      );
      console.log("📤 Initial data sent");
    } catch (error) {
      console.error("❌ Error sending data:", error);
    }

    ws.on("message", (message) => {
      console.log(`📨 Message received: ${message}`);
    });

    ws.on("close", () => {
      console.log(`👋 Client disconnected (Remaining: ${wss.clients.size})`);
    });
  });

  console.log("⏳ Starting interval...");

  setInterval(() => {
    try {
      generateNewData();
      currentData = getInitialState();

      const message = JSON.stringify({
        type: "update",
        data: currentData,
      });

      console.log(
        `📊 Indicator1: ${currentData.indicator1}, Indicator2: ${currentData.indicator2}`,
      );

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          (client as WebSocket).send(message);
        }
      });
    } catch (error) {
      console.error("❌ Interval error:", error);
    }
  }, 5000);

  console.log("✅ Interval started!");
} catch (error) {
  console.error("❌ CRITICAL ERROR:", error);
}

process.on("SIGINT", () => {
  console.log("\n🛑 Server stopped");
  process.exit(0);
});
