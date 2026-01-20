import React, { useState } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = React.memo(function ChatMessage({ message, sender, timestamp, isTyping }) {
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // -----------------------------
  // AI Typing Bubble (special)
  // -----------------------------
  if (!isUser && isTyping) {
    return (
      <div className="flex w-full my-2 justify-start">
        <div className="flex mt-2 gap-2 w-full min-w-0">
          <FaRobot className="text-purple-600 w-4 h-4" />
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex items-center gap-1 max-w-[25%]">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-75"></span>
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-300"></span>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Normal User / AI Message
  // -----------------------------
  return (
    <div className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-2 w-full min-w-0 ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className="pt-1 flex-shrink-0 flex items-center relative">
          {isUser ? (
            <FaUser className="text-gray-500 w-4 h-4" />
          ) : (
            <FaRobot className="text-purple-600 w-4 h-4" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`relative p-3 rounded-lg flex flex-col min-w-0 max-w-[75%] ${
            isUser
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
        >
          {/* Copy button for AI */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute bottom-3 right-14 text-gray-400 hover:text-gray-700 transition"
              title={copied ? "Copied!" : "Copy"}
            >
              {copied ? (
                <FiCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </button>
          )}

          {/* AI / User Message */}
          {isUser ? (
            <span className="text-sm break-words whitespace-pre-wrap leading-relaxed">
              {message || ""}
            </span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p
                    className="text-sm break-words whitespace-pre-wrap leading-relaxed"
                    {...props}
                  />
                ),
                code: ({ node, inline, className, children, ...props }) => (
                  <code
                    className="bg-gray-200 rounded px-1 py-0.5 text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {message || ""}
            </ReactMarkdown>
          )}

          {/* Timestamp */}
          <span
            className={`text-[10px] mt-1 self-end ${
              isUser ? "text-purple-200" : "text-gray-400"
            }`}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
