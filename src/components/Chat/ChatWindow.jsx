import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, onSend, isAiTyping }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  return (
    <div className="flex flex-col h-[600px] border border-gray-300 rounded-md bg-white">
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
      >
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg.message}
              sender={msg.sender}
              timestamp={msg.timestamp}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">No messages yet</p>
        )}

        {isAiTyping && (
          <p className="text-sm text-gray-400 mt-2">AI is typing...</p>
        )}
      </div>

      <ChatInput onSend={onSend} disabled={isAiTyping} />
    </div>
  );
}
