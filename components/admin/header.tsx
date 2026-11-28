"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types/database";
import { logout } from "@/lib/actions/auth";
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Menu,
  PanelLeft,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  user: Profile | null;
  onOpenMobileSidebar: () => void;
  isSidebarOpen?: boolean;
  onToggleDesktopSidebar?: () => void;
  isAssistantOpen?: boolean;
  onToggleAssistant?: () => void;
}

export function AdminHeader({
  user,
  onOpenMobileSidebar,
  isSidebarOpen = true,
  onToggleDesktopSidebar,
  isAssistantOpen,
  onToggleAssistant,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("safary_theme");
    const prefersDark = saved !== "light";
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
    <header className="h-16 bg-white dark:bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1e2a44] sticky top-0 z-20 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2">
      {/* Mobile Drawer Trigger & Quick Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-[#8896b3] hover:bg-slate-100 dark:hover:bg-[#162036] transition shrink-0"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {onToggleDesktopSidebar && (
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-[#8896b3] hover:text-slate-800 dark:hover:text-[#f4f7fc] hover:bg-slate-100 dark:hover:bg-[#162036] border border-transparent hover:border-slate-200 dark:hover:border-[#1e2a44] transition shrink-0"
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="relative hidden sm:block flex-1 max-w-xs min-w-[140px]">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#8896b3] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search slippers, bills…"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#162036] border border-slate-200 dark:border-[#1e2a44] rounded-xl text-slate-800 dark:text-[#f4f7fc] placeholder-slate-400 dark:placeholder-[#8896b3] focus:outline-none focus:border-[#1f5fff] focus:ring-2 focus:ring-[#1f5fff]/25 transition"
          />
        </div>
      </div>

      {/* Right Actions: Theme Toggle, AI Assistant, POS Fast Action, Notifications, User Chip */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Light / Dark Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-[#8896b3] hover:text-slate-800 dark:hover:text-[#f4f7fc] hover:bg-slate-100 dark:hover:bg-[#162036] transition shrink-0"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-[#5b8cff]" /> : <Moon className="w-4 h-4" />}
        </button>

        {onToggleAssistant && (
          <button
            type="button"
            onClick={onToggleAssistant}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 whitespace-nowrap shrink-0 spring-press ${
              isAssistantOpen
                ? "bg-[#1f5fff] text-white border-[#1f5fff] shadow-[0_0_16px_rgba(31,95,255,0.35)]"
                : "bg-slate-100 dark:bg-[#162036] hover:bg-slate-200 dark:hover:bg-[#1e2a44] text-slate-800 dark:text-[#f4f7fc] border-slate-200 dark:border-[#1e2a44]"
            }`}
            title="Toggle Safary AI Assistant (Ctrl+K)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAssistantOpen ? "text-white" : "text-[#5b8cff]"}`} />
            <span className="hidden xs:inline sm:inline">Assistant</span>
          </button>
        )}

        <Link
          href="/admin/pos"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1f5fff] to-[#3b76ff] hover:brightness-110 text-white shadow-[0_4px_14px_rgba(31,95,255,0.35)] transition-all duration-150 whitespace-nowrap shrink-0 spring-press"
        >
          + Quick POS
        </Link>

        {/* Low-stock / alerts bell */}
        <Link
          href="/admin/inventory"
          className="p-2 text-slate-400 dark:text-[#8896b3] hover:text-slate-600 dark:hover:text-[#f4f7fc] hover:bg-slate-100 dark:hover:bg-[#162036] rounded-xl relative transition shrink-0"
          title="Stock Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0d1424]" />
        </Link>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#162036] transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-[#162036] text-[#f4f7fc] ring-2 ring-[#1f5fff] flex items-center justify-center font-bold text-xs uppercase">
              {user?.full_name?.charAt(0) || "O"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-slate-800 dark:text-[#f4f7fc] block leading-tight">
                {user?.full_name || "Owner"}
              </span>
              <span className="text-2xs text-slate-400 dark:text-[#8896b3] font-medium capitalize flex items-center gap-1">
                {user?.role === "owner" ? (
                  <Shield className="w-2.5 h-2.5 text-[#5b8cff]" />
                ) : (
                  <User className="w-2.5 h-2.5 text-[#2ad69a]" />
                )}
                {user?.role || "Owner"}
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
  );
}
