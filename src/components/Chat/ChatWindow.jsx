import { useRef, useEffect, useMemo } from "react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatWindow({ messages, onSend, isAiTyping, onNewChat }) {
  const scrollRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Memoize the last AI message for stable reference
  const lastAiMessage = useMemo(
    () => messages.slice().reverse().find((m) => m.sender === "ai"),
    [messages]
  );

  return (
    <div className="flex flex-col h-[700px] border border-gray-300 bg-white">
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
              isTyping={false} // typing handled separately
            />
          ))
        ) : (
          <p className="text-gray-400 text-center mt-10">No messages yet</p>
        )}

        {/* AI Typing Bubble */}
        {isAiTyping && (
          <ChatMessage
            key="ai-typing"
            message=""
            sender="ai"
            timestamp={Date.now()}
            isTyping={true}
          />
        )}
      </div>

      {/* New Chat button */}
      <div className="flex justify-center mt-3">
        <button
          onClick={onNewChat}
          className="text-xs px-4 py-1.5 rounded-full
                     bg-gray-100 hover:bg-gray-200
                     text-gray-700 border border-gray-300
                     transition"
        >
          New Chat
        </button>
      </div>

      {/* Chat Input */}
      <ChatInput onSend={onSend} disabled={isAiTyping} />
    </div>
  );
}
