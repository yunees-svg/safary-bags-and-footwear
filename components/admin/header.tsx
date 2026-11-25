"use client";

import { useState } from "react";
import { Profile } from "@/lib/types/database";
import { logout } from "@/lib/actions/auth";
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  user: Profile | null;
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({ user, onOpenMobileSidebar }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Mobile Drawer Trigger & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search slippers, bills, customers..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right Actions: POS Fast Action, Notifications, User Chip */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pos"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
        >
          + Quick POS Bill
        </Link>

        {/* Low-stock / alerts bell */}
        <Link
          href="/admin/inventory"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg relative transition"
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
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user?.full_name || "Admin"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize flex items-center gap-1">
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
                <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
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
