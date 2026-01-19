import { useState, useEffect, useRef, useCallback } from "react";

export default function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", url);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "ai_typing") {
          setIsAiTyping(data.value);
          return;
        }

        if (data.type === "message") {
          setMessages((prev) => [
            ...prev,
            {
              sender: data.message.sender,
              message: data.message.text, // ✅ normalize
              timestamp: Date.now(),
            },
          ]);
          return;
        }

        if (data.type === "error") {
          console.error("Backend error:", data.message);
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((text) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({ type: "message", message: text })
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return { messages, isAiTyping, sendMessage };
}
