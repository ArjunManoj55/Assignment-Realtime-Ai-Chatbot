import React, { useState, memo } from "react";
import { FaRobot, FaUser } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = memo(function ChatMessage({
  message = "",
  sender,
  timestamp,
  isTyping,
}) {
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

  if (!isUser && isTyping) {
    return (
      <div className="flex w-full my-2 justify-start">
        <div className="flex gap-2 mt-2 w-full min-w-0">
          <FaRobot className="w-4 h-4 text-purple-600" />

          <div className="flex items-center gap-1 p-3 max-w-[25%] bg-gray-100 border border-gray-300 rounded-lg">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-75" />
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-150" />
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full my-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start gap-2 w-full min-w-0 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div className="pt-1 flex-shrink-0">
          {isUser ? (
            <FaUser className="w-4 h-4 text-gray-500" />
          ) : (
            <FaRobot className="w-4 h-4 text-purple-600" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`relative flex flex-col p-3 min-w-0 max-w-[75%] rounded-lg ${
            isUser
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-800 border border-gray-300"
          }`}
        >
          {/* Copy button (AI only) */}
          {!isUser && (
            <button
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy"}
              className="absolute bottom-3 right-14 text-gray-400 hover:text-gray-700 transition"
            >
              {copied ? (
                <FiCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FiCopy className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Message content */}
          {isUser ? (
            <span className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message}
            </span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => (
                  <p
                    {...props}
                    className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                  />
                ),
                code: ({ children, ...props }) => (
                  <code
                    {...props}
                    className="px-1 py-0.5 text-xs font-mono bg-gray-200 rounded"
                  >
                    {children}
                  </code>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          )}

          {/* Timestamp */}
          <span
            className={`mt-1 self-end text-[10px] ${
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
