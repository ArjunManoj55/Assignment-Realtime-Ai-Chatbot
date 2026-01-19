import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";

export default function ChatMessage({ message, sender, timestamp }) {
  const isUser = sender === "user";

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-start gap-2 w-full min-w-0 ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="pt-1 flex-shrink-0">
          {isUser ? (
            <FaUser className="text-gray-500 w-4 h-4" />
          ) : (
            <FaRobot className="text-purple-600 w-4 h-4" />
          )}
        </div>

        <div
          className={`p-3 rounded-lg flex flex-col min-w-0 max-w-[75%] ${
            isUser
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
        >
          <span className="text-sm break-words whitespace-pre-wrap leading-relaxed">
            {message}
          </span>
          <span className={`text-[10px] mt-1 self-end ${isUser ? "text-purple-200" : "text-gray-400"}`}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
