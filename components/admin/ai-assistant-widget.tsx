"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { askShopAssistantAction } from "@/lib/actions/ai-assistant";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  ArrowRight,
  Minimize2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  links?: { label: string; href: string }[];
}

const QUICK_PROMPTS = [
  "How much sales today?",
  "Show low stock alerts",
  "Who owes Khata credit?",
  "Check size 8 stock",
];

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "👋 Hi! I'm **Safary AI**.\nAsk me about today's sales, low-stock alerts, Khata dues, or slipper/bag availability!",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleAsk(promptText?: string) {
    const query = (promptText ?? input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput("");
    setLoading(true);

    try {
      const res = await askShopAssistantAction(query);
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: "ai",
        text: res.answer,
        links: res.suggestedLinks,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "ai",
          text: "Sorry, I couldn't process that right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs font-bold"
          aria-label="Open Safary AI Assistant"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Ask Safary AI</span>
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[82vh]">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Safary AI Assistant
                  <span className="px-1.5 py-0.5 rounded-full text-2xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live
                  </span>
                </h3>
                <p className="text-2xs text-slate-300">Connected to store inventory & sales</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50 min-h-[260px]"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs"
                  }`}
                >
                  {m.text.split("**").map((part, idx) =>
                    idx % 2 === 1 ? (
                      <strong key={idx}>{part}</strong>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </div>

                {/* Suggested Action Links */}
                {m.links && m.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.links.map((lk) => (
                      <Link
                        key={lk.href}
                        href={lk.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-2xs font-semibold transition"
                      >
                        {lk.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Checking live store data...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp}
                type="button"
                disabled={loading}
                onClick={() => handleAsk(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-2xs font-medium shrink-0 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about sales, stock, Khata..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
