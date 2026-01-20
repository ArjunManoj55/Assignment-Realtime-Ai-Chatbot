import { useState, useEffect, useRef, useCallback } from "react";

export default function useWebSocket(url) {
  // Load messages from localStorage on init
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [live, setLive] = useState(false);

  const wsRef = useRef(null);
  const greetingSentRef = useRef(false);

  const firstChunk =
    "talk.....im live, no im not making a separate call to backend for the first text, it's websocket talking with a 1.5sec delay,";

  const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  //local storage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  //websocket
  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", url);
      setLive(true);

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
      let data;

      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("WS parse error:", err);
        return;
      }

      if (data.type === "ai_typing") {
        setIsAiTyping(Boolean(data.value));
        return;
      }

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            sender: data.message?.sender || "ai",
            message: data.message?.text || "",
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      //error handling
      if (data.type === "error") {
        const errorText = data?.error?.message || "Something went wrong";

        console.error("Backend error:", data?.error);

        setIsAiTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            sender: "ai",
            message: `⚠️ ${errorText}`,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setLive(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setLive(false);
    };

    return () => ws.close();
  }, [url]);

  //input message
  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        message: text,
      }),
    );

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

  //new chat
  const newChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    setIsAiTyping(true);
    greetingSentRef.current = false;

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
      greetingSentRef.current = true;
    }, 1500);
  };

  return {
    messages,
    isAiTyping,
    sendMessage,
    live,
    newChat,
  };
}
