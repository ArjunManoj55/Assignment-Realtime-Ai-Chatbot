import express from "express";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (msg) => {
    let payload;

    try {
      payload = JSON.parse(msg.toString());
    } catch {
      ws.send(JSON.stringify({
        type: "error",
        message: "Invalid JSON format",
      }));
      return;
    }

    if (payload.type !== "message" || !payload.message) return;

    const userMessage = payload.message;

    // AI typing start
    ws.send(JSON.stringify({ type: "ai_typing", value: true }));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);

        ws.send(JSON.stringify({
          type: "error",
          message: "Gemini API error",
        }));
        return;
      }

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response from AI";

      ws.send(
        JSON.stringify({
          type: "message",
          message: {
            sender: "ai",
            text: aiText,
          },
        })
      );
    } catch (err) {
      console.error("Fetch error:", err);
      ws.send(JSON.stringify({
        type: "error",
        message: "Failed to get AI response",
      }));
    } finally {
      // AI typing end
      ws.send(JSON.stringify({ type: "ai_typing", value: false }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
