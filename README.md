# 🚀 Real-Time AI Chatbot with Streaming (React + WebSockets + Gemini)

Build a real-time AI chatbot with streaming responses using WebSockets, React, and Google Gemini GenAI APIs.  
This project is frontend-focused, with a minimal backend WebSocket server required only to enable real-time streaming.

Built in a time-constrained environment with focus on real-time communication, UX, and GenAI integration.

---

## ✨ Features

- Real-time AI responses (streaming) using WebSockets
- Google Gemini API (Gemini 3 Flash Preview model)
- AI typing animation
- New Chat (reset conversation)
- Clipboard copy for AI messages
- Markdown rendering in AI responses (tables, code blocks, lists)
- Message persistence using localStorage
- Live WebSocket connection status
- Built with React + Vite

---

## 🧱 Tech Stack

Frontend:

- React (Vite)
- JavaScript
- WebSockets
- react-markdown + remark-gfm
- Tailwind CSS

Backend:

- Node.js
- Google Gemini GenAI API

---

## 🧠 AI Model Used

Google Gemini 3 Flash Preview model:

https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent

---

## 🔐 Environment Variables

Frontend (.env):

VITE_WS_URL= websocket url

Backend (backend/.env):

GEMINI_API_KEY=your_google_gemini_api_key

---

## ▶️ Running the Project

1. Install backend dependencies

cd backend
npm install

2. Start WebSocket server

node server.js

3. Install frontend dependencies

npm install

4. Start frontend app

npm run dev

App runs at:
http://localhost:5173

---

## 📦 Required NPM Packages

WebSocket:
npm install ws

Markdown rendering:
npm install react-markdown remark-gfm

---

## 💾 Message Persistence

- Messages are saved automatically to localStorage
- Messages are restored on page refresh
- New Chat clears localStorage and starts a fresh conversation

---

## 🧪 UX Details

- AI typing indicator does not re-render existing messages
- ai agent online/ offline status
- Copy button feedback for AI messages
- Auto-scroll on new messages
- Input disabled while AI is typing

---

## ⚠️ Notes

- Frontend-first implementation
- Backend exists only for WebSocket streaming
- No authentication included
- Not production-hardened

---

## 🛠 Built With

- vite@latest
- React
- WebSockets
- Google Gemini GenAI API

---
