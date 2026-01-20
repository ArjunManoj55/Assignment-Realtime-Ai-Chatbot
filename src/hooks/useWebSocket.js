import { useState, useEffect, useRef, useCallback } from "react";

export default function useWebSocket(url) {
  
  // Load messages from localStorage on hook initialization
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [live, setLive] = useState(false);

  const wsRef = useRef(null);
  const greetingSentRef = useRef(false);

  const firstChunk =
    "come on talk.....im live, no im not making a separate call to backend for the first text; it's the websocket talking with a 1.5sec delay.";

  // Helper: generate stable unique ID
  const generateId = () =>
    Date.now() + "-" + Math.random().toString(36).substr(2, 9);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", url);
      setLive(true);

      // Send greeting only once Send greeting only if no messages exist
      if (!greetingSentRef.current && messages.length === 0) {
        greetingSentRef.current = true;
        setIsAiTyping(true);

        setTimeout(() => {
          setMessages([
            {
              id: generateId(),
              sender: "ai",
              message: firstChunk,
              timestamp: Date.now(),
            },
          ]);
          setIsAiTyping(false);
        }, 1500);
      }
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
              id: generateId(),
              sender: data.message.sender,
              message: data.message.text,
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
      setLive(false);
    };

    return () => ws.close();
  }, [url]);

  // Send user message
  const sendMessage = useCallback((text) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: "message", message: text }));

    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        sender: "user",
        message: text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Start new chat
  const newChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages"); // Clear localStorage
    setIsAiTyping(true);
    greetingSentRef.current = false;

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "reset_conversation" }));
    }

    setTimeout(() => {
      const firstMsg = {
        id: generateId(),
        sender: "ai",
        message: firstChunk,
        timestamp: Date.now(),
      };
      setMessages([firstMsg]);
      setIsAiTyping(false);
      greetingSentRef.current = true;
    }, 1500);
  };

  return { messages, isAiTyping, sendMessage, live, newChat };
}
