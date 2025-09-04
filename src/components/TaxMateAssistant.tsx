import { useState } from "react";

export default function TaxMateAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  };

  const handleQuickPrompt = (prompt: { label: string; response: string }) => {
    setMessages([
      { sender: "user", text: prompt.label },
      { sender: "bot", text: prompt.response },
    ]);
    setOpen(true);
  };

  const quickPrompts = [
    {
      label: "How do I start a new filing?",
      response: "To start a new filing, click 'New Filing' in the top navigation. We'll guide you step-by-step from there.",
    },
    {
      label: "Where can I see my monthly summary?",
      response: "Your monthly summary is available under 'Monthly Summary'. It shows categorized transactions and trends.",
    },
    {
      label: "How do I correct a category?",
      response: "Click 'Edit' next to any transaction to manually adjust its category. This helps improve auto-categorization over time.",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          onClick={() => {
            setMessages([]);
            setOpen(true);
          }}
          className="bg-[#6C63FF] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#574ee6] transition transform duration-200 ease-in-out flex items-center gap-2"
          title="Click for your personal AI assistant"
        >
          🤖 Chat
        </button>
      ) : (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg w-80 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-[#3f3d56]">TaxMate Assistant</h3>
            <button
              onClick={() => {
                setOpen(false);
                setMessages([]);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✖
            </button>
          </div>

          <div className="text-xs text-gray-600 mb-3">
            How can I help you today?
          </div>

          <div className="space-y-2 mb-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="w-full text-left text-sm text-indigo-600 hover:underline"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto text-sm space-y-2 mb-2 max-h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-indigo-50 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-2 py-1 rounded text-sm"
              placeholder="Ask something..."
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
