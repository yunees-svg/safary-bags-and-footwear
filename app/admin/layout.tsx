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

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
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
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-10">
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
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating Safary AI Assistant */}
      <AiAssistantWidget />
    </div>
  );
}
