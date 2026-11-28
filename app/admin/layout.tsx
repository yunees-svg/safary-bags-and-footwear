"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types/database";
import { AdminSidebar } from "@/lib/../components/admin/sidebar";
import { AdminHeader } from "@/lib/../components/admin/header";
import { AiAssistantWidget } from "@/components/admin/ai-assistant-widget";
import { getCurrentUser } from "@/lib/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  function handleMainScroll(e: React.UIEvent<HTMLElement>) {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)));
    }
  }

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    loadUser();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsAssistantOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-dvh overflow-hidden bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <AdminSidebar
          role={user?.role || "staff"}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[268px] bg-white dark:bg-[#0d1424] shadow-xl z-10">
            <AdminSidebar
              role={user?.role || "staff"}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileOpen(false)}
              onNavigate={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader
          user={user}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          isAssistantOpen={isAssistantOpen}
          onToggleAssistant={() => setIsAssistantOpen((prev) => !prev)}
        />
        {/* Sleek Top Scroll Progress Bar */}
        <div className="h-0.5 w-full bg-transparent shrink-0 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <main
          onScroll={handleMainScroll}
          className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto"
        >
          {children}
        </main>
      </div>

      {/* Docked Right Safary AI Assistant Panel */}
      <AiAssistantWidget
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userName={user?.full_name}
      />
    </div>
  );
}
