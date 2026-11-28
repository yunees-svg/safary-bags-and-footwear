"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  Truck,
  CreditCard,
  MessageSquareQuote,
  RotateCcw,
  Users,
  WalletCards,
  ReceiptText,
  BarChart3,
  UserCog,
  Settings,
  Footprints,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    ownerOnly?: boolean;
    badge?: string;
  }[];
}

export function AdminSidebar({ role, isCollapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const navSections: NavSection[] = [
    {
      title: "MAIN",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "CATALOG",
      items: [
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Categories", href: "/admin/categories", icon: Layers },
        { label: "Inventory", href: "/admin/inventory", icon: Boxes },
      ],
    },
    {
      title: "SHOP OPERATIONS",
      items: [
        { label: "Billing / POS", href: "/admin/pos", icon: CreditCard, badge: "POS" },
        { label: "Purchases", href: "/admin/purchases", icon: Truck },
        { label: "AI Invoice Agent", href: "/admin/purchases/new", icon: Sparkles, badge: "AI" },
        { label: "Orders & Enquiries", href: "/admin/enquiries", icon: MessageSquareQuote },
        { label: "Returns & Exchanges", href: "/admin/returns", icon: RotateCcw },
      ],
    },
    {
      title: "CUSTOMERS",
      items: [
        { label: "Customers", href: "/admin/customers", icon: Users },
        { label: "Credit Management", href: "/admin/credit", icon: WalletCards },
      ],
    },
    {
      title: "FINANCE",
      items: [
        { label: "Expenses", href: "/admin/expenses", icon: ReceiptText },
        { label: "Reports", href: "/admin/reports", icon: BarChart3, ownerOnly: true },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Staff Management", href: "/admin/staff", icon: UserCog, ownerOnly: true },
        { label: "Settings", href: "/admin/settings", icon: Settings, ownerOnly: true },
        { label: "User Guide", href: "/admin/guide", icon: BookOpen },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "relative h-screen sticky top-0 bg-white dark:bg-[#0d1424] border-r border-slate-200 dark:border-[#1e2a44] flex flex-col transition-all duration-200 z-30",
        isCollapsed ? "w-[76px]" : "w-[268px]"
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-slate-100 dark:border-[#1e2a44]",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3",
            !isCollapsed && "overflow-hidden min-w-0"
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-[#162036] border border-[#1f5fff] text-[#f4f7fc] font-extrabold text-sm flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(31,95,255,0.4)]">
            S
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-[#f4f7fc] text-[12px] block leading-tight tracking-tight">
                Safary Bags &amp; Footwear
              </span>
              <span className="text-2xs text-slate-400 dark:text-[#8896b3] font-medium capitalize">
                {role} Console
              </span>
            </div>
          )}
        </Link>
        {!isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 dark:text-[#8896b3] hover:text-slate-600 dark:hover:text-[#f4f7fc] hover:bg-slate-100 dark:hover:bg-[#162036] transition hidden lg:flex items-center justify-center shrink-0"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center absolute -right-3 top-5 z-40 w-6 h-6 rounded-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2a44] text-slate-500 dark:text-[#8896b3] hover:text-[#1f5fff] dark:hover:text-[#5b8cff] shadow-md transition"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => {
          // Filter items based on role
          const visibleItems = section.items.filter(
            (item) => !item.ownerOnly || role === "owner"
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="text-2xs font-bold tracking-wider text-slate-400 dark:text-[#8896b3]/80 px-3 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : item.href === "/admin/purchases"
                      ? pathname === "/admin/purchases"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-[#1f5fff]/20 to-[#1f5fff]/5 text-blue-700 dark:text-[#f4f7fc] font-semibold"
                          : "text-slate-600 dark:text-[#8896b3] hover:bg-slate-100 dark:hover:bg-[#162036] hover:text-slate-900 dark:hover:text-[#f4f7fc]"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#1f5fff] shadow-[0_0_10px_#1f5fff]" />
                      )}
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition",
                          isActive
                            ? "text-[#1f5fff] dark:text-[#5b8cff]"
                            : "text-slate-400 dark:text-[#8896b3] group-hover:text-slate-600 dark:group-hover:text-[#f4f7fc]"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="px-2 py-0.5 text-2xs font-bold rounded-full bg-white text-[#1f5fff] shadow-2xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
