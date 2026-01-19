import { useState, useEffect, useRef, useCallback } from "react";

export default function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [live, setLive] = useState(false);

  const wsRef = useRef(null);
  const greetingSentRef = useRef(false);  

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", url);
      setLive(true);

      // greeting once
      if (!greetingSentRef.current) {
        greetingSentRef.current = true;

        // to make it look like ai
        setIsAiTyping(true);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              message: "come on talk....., no im not making a seperate call to backend for the fisrt text its the websocket talking with a 1.5sec delay, ",
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

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((text) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: "message", message: text }));

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message: text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return { messages, isAiTyping, sendMessage, live };
}
