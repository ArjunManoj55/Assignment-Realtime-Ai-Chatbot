import React from "react";
import { FaRobot, FaCircle } from "react-icons/fa";

export default function ChatHeader({ live }) {
  return (
    <div className="flex items-center justify-between bg-purple-600 text-white px-4 py-3 rounded-t-lg">
      
      {/* Left: Chatbot Icon + Title */}
      <div className="flex items-center space-x-2">
        <FaRobot className="w-6 h-6" />
        <span className="font-semibold text-lg">Chatbot</span>
      </div>

      {/* Right: Live Status */}
      <div className="flex items-center space-x-2 text-sm">
        <FaCircle
          className={live ? "text-green-400" : "text-red-600"}
          size={10}
        />
        <span className="font-medium">
          {live ? "Online" : "Offline"}
        </span>
      </div>

    </div>
  );
}
