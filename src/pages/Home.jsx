import React from "react";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatHeader from "../components/Chat/ChatHeader";
import useWebSocket from "../hooks/useWebSocket";

export default function Home() {
  const { messages, isAiTyping, sendMessage, newChat, live } = useWebSocket(
    import.meta.env.VITE_WS_URL,
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-2 sm:px-4">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl sm:h-[85vh] bg-white rounded-md shadow-md flex flex-col">
        
        <ChatHeader live={live} />
        <ChatWindow
          messages={messages}
          onSend={sendMessage}
          isAiTyping={isAiTyping}
          onNewChat={newChat}
        />
      </div>
    </div>
  );
}
