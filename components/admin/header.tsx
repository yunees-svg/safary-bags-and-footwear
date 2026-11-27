"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Profile } from "@/lib/types/database";
import { logout } from "@/lib/actions/auth";
import { GUIDE_ENTRIES } from "@/lib/data/user-guide-data";
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Menu,
  Sparkles,
  Sun,
  Moon,
  BookOpen,
  X,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  user: Profile | null;
  onOpenMobileSidebar: () => void;
  isAssistantOpen?: boolean;
  onToggleAssistant?: () => void;
}

export function AdminHeader({
  user,
  onOpenMobileSidebar,
  isAssistantOpen,
  onToggleAssistant,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  const currentPageGuide =
    GUIDE_ENTRIES.find((g) => g.route === pathname) ||
    GUIDE_ENTRIES.find((g) => g.route !== "/admin" && pathname.startsWith(g.route)) ||
    GUIDE_ENTRIES[1];

  useEffect(() => {
    const saved = localStorage.getItem("safary_theme");
    const prefersDark = saved === "dark";
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("safary_theme", next ? "dark" : "light");
  }

  return (
    <>
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2">
      {/* Mobile Drawer Trigger & Quick Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition shrink-0"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block flex-1 max-w-xs min-w-[140px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search slippers, bills..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right Actions: How to use, Theme Toggle, AI Assistant, POS Fast Action, Notifications, User Chip */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Velom-style "How to use" context guide button */}
        <button
          type="button"
          onClick={() => setShowHowToUse(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition whitespace-nowrap shrink-0"
          title="How to use this page"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">How to use</span>
        </button>

        {/* Light / Dark Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-blue-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {onToggleAssistant && (
          <button
            type="button"
            onClick={onToggleAssistant}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap shrink-0 ${
              isAssistantOpen
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
            }`}
            title="Toggle Safary AI Assistant (Ctrl+K)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAssistantOpen ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
            <span className="hidden xs:inline sm:inline">Assistant</span>
          </button>
        )}

        <Link
          href="/admin/pos"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition whitespace-nowrap shrink-0"
        >
          + Quick POS
        </Link>

        {/* Low-stock / alerts bell */}
        <Link
          href="/admin/inventory"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg relative transition shrink-0"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </Link>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs uppercase">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user?.full_name || "Admin"}
              </span>
              <span className="text-2xs text-slate-400 font-medium capitalize flex items-center gap-1">
                {user?.role === "owner" ? (
                  <Shield className="w-2.5 h-2.5 text-blue-600" />
                ) : (
                  <User className="w-2.5 h-2.5 text-emerald-600" />
                )}
                {user?.role || "Staff"}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800 truncate">{user?.full_name}</p>
                <p className="text-slate-400 text-2xs truncate">{user?.email}</p>
              </div>
              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="block px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
              >
                Shop Settings
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Context-Aware "How to use" Modal */}
    {showHowToUse && currentPageGuide && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85dvh]">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">
                  How to Use: {currentPageGuide.title.replace(/^\d+\.\s*/, "")}
                </h2>
                <span className="text-2xs font-mono text-slate-400">
                  {currentPageGuide.route} • {currentPageGuide.role}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHowToUse(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition shrink-0"
              aria-label="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentPageGuide.summary}
            </p>

            <div className="space-y-2.5">
              {currentPageGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-800 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tip:</strong> {currentPageGuide.tip}
              </span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowHowToUse(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
            <Link
              href="/admin/guide"
              onClick={() => setShowHowToUse(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              Open Full User Guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
