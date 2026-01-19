// src/components/Chat/ChatHeader.jsx
import React from "react";
import { FaRobot } from "react-icons/fa"; // Chatbot icon
import { FaChevronDown } from "react-icons/fa"; // Dropdown/expand icon

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between bg-purple-600 text-white px-4 py-3 rounded-t-lg">
      {/* Left: Chatbot Icon + Title */}
      <div className="flex items-center space-x-2">
        <FaRobot className="w-6 h-6" />
        <span className="font-semibold text-lg">Chatbot</span>
      </div>
    </div>
  );
}
