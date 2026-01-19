// src/components/Chat/ChatInput.jsx
import React, { useState, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";

const MAX_CHAR_LIMIT = 200;

export default function ChatInput({ onSend, disabled = false, generatedResponse }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const remainingChars = MAX_CHAR_LIMIT - message.length;

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_CHAR_LIMIT) {
      setMessage(value);

      // Auto-grow textarea
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }
  };

  const handleSend = () => {
    if (disabled || message.trim() === "") return;

    onSend(message);
    setMessage("");

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2 border-gray-300 rounded-md">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={disabled ? "AI is responding..." : "Message..."}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 resize-none overflow-hidden border border-gray-300 rounded-2xl px-4 py-2 leading-5 disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ maxHeight: "120px" }} // prevents infinite growth
        />

        <button
          onClick={handleSend}
          disabled={disabled || message.trim() === ""}
          className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FiArrowUp size={18} />
        </button>
      </div>

      {/* Character counter */}
      <div
        className={`text-xs text-right pr-2 ${
          remainingChars <= 20 ? "text-red-500" : "text-gray-400"
        }`}
      >
        {message.length} / {MAX_CHAR_LIMIT}
      </div>
    </div>
  );
}
