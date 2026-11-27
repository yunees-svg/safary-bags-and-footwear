"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { askShopAssistantAction } from "@/lib/actions/ai-assistant";
import {
  Sparkles,
  X,
  ArrowUp,
  Loader2,
  Plus,
  Compass,
  ChevronRight,
  ArrowRight,
  Paperclip,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  links?: { label: string; href: string }[];
}

interface AiAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

function getPageLabel(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/pos")) return "Billing / POS";
  if (pathname.startsWith("/admin/purchases/new")) return "AI Invoice Agent";
  if (pathname.startsWith("/admin/purchases")) return "Purchases";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  if (pathname.startsWith("/admin/inventory")) return "Inventory";
  if (pathname.startsWith("/admin/credit")) return "Credit & Khata";
  if (pathname.startsWith("/admin/customers")) return "Customers";
  if (pathname.startsWith("/admin/reports")) return "Reports";
  if (pathname.startsWith("/admin/expenses")) return "Expenses";
  if (pathname.startsWith("/admin/returns")) return "Returns";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Dashboard";
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function AiAssistantWidget({ isOpen, onClose, userName }: AiAssistantWidgetProps) {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);
  const firstName = userName?.split(" ")[0] || "Owner";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  function handleReset() {
    setMessages([]);
    setInput("");
  }

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
    <aside className="fixed inset-0 z-50 lg:static lg:inset-auto lg:z-30 w-full lg:w-[350px] xl:w-[380px] h-dvh lg:h-screen lg:sticky lg:top-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 shadow-xl lg:shadow-none">
      {/* Top Header Bar */}
      <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Safary Assistant</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="New Conversation"
            aria-label="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Close Assistant (Ctrl+K)"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50">
        {/* Page Context Pill */}
        <div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Page: <span className="text-slate-900 ml-1">{pageLabel}</span>
          </span>
        </div>

        {/* Personalized Welcome & Guide Suggestions (when no chat started yet) */}
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-slate-900">
                {getGreeting()}, {firstName}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                I can see the <strong className="text-slate-700">{pageLabel}</strong> page. Ask a question about sales, stock, or Khata dues, or jump straight to an action.
              </p>
            </div>

            {/* Guide Me Quick Pill */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-500">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Actions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/purchases/new"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition"
                >
                  Scan a wholesale bill
                </Link>
                <Link
                  href="/admin/pos"
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs font-semibold transition"
                >
                  Open Billing POS
                </Link>
              </div>
            </div>

            {/* Vertical Stacked Prompt Cards */}
            <div className="space-y-2 pt-2">
              {[
                { text: "How much sales today?" },
                { text: "Show low stock alerts" },
                { text: "Who owes Khata credit?" },
                { text: "Check size 8 stock" },
              ].map((item) => (
                <button
                  key={item.text}
                  type="button"
                  onClick={() => handleAsk(item.text)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left flex items-center justify-between gap-2 transition group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.text}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 transition" />
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleAsk("How do I scan a wholesale supplier invoice?")}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left flex items-center justify-between gap-2 transition group shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">
                    How do I scan a supplier bill?
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-2xs font-semibold">
                    Guide me
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Active Conversation Messages */
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-xs"
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

                {m.links && m.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.links.map((lk) => (
                      <Link
                        key={lk.href}
                        href={lk.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-2xs font-semibold transition"
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
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Checking live store data...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Input Dock */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-1.5 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2 p-1.5 pl-3 bg-slate-50 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition"
        >
          <Link
            href="/admin/purchases/new"
            title="Upload Supplier Invoice"
            className="text-slate-400 hover:text-blue-600 transition shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </Link>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask or tell Safary AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none min-w-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 shadow-2xs"
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
        <p className="text-center text-2xs text-slate-400 hidden sm:block">
          Enter sends • Ctrl+K toggles the assistant
        </p>
      </div>
    </aside>
  );
}
