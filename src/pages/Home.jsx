import React from "react";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatHeader from "../components/Chat/ChatHeader";
import useWebSocket from "../hooks/useWebSocket";

export default function Home() {
  // Connect to your backend WebSocket
  const { messages, isAiTyping, sendMessage } = useWebSocket("ws://localhost:3000");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-2 sm:px-4">
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl sm:h-[65vh] bg-white rounded-md shadow-md flex flex-col">
        <ChatHeader />
        <ChatWindow
          messages={messages}
          onSend={sendMessage}
          isAiTyping={isAiTyping}
        />
      </div>
    </div>
  );
}
