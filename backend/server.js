import express from "express";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

function safeSend(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function sendError(ws, message, code = "SERVER_ERROR") {
  safeSend(ws, {
    type: "error",
    error: {
      code,
      message,
    },
  });
}

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (msg) => {
    let payload;

    try {
      payload = JSON.parse(msg.toString());
    } catch {
      sendError(ws, "Invalid JSON format", "INVALID_JSON");
      return;
    }

    if (payload.type !== "message" || !payload.message?.trim()) {
      sendError(ws, "Message payload is missing", "INVALID_PAYLOAD");
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      sendError(ws, "Server misconfiguration: missing API key", "CONFIG_ERROR");
      return;
    }

    const userMessage = payload.message;

    safeSend(ws, { type: "ai_typing", value: true });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessage }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);

        sendError(ws, "AI service returned an error", "GEMINI_ERROR");
        return;
      }

      const data = await response.json();

      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        sendError(ws, "Empty AI response", "EMPTY_RESPONSE");
        return;
      }

      safeSend(ws, {
        type: "message",
        message: {
          sender: "ai",
          text: aiText,
        },
      });
    } catch (err) {
      console.error("Fetch error:", err);

      sendError(ws, "Failed to connect to AI service", "NETWORK_ERROR");
    } finally {
      safeSend(ws, { type: "ai_typing", value: false });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
