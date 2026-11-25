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
} from "lucide-react";

interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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

export function AdminSidebar({ role, isCollapsed, onToggleCollapse }: SidebarProps) {
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
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-200 z-30",
        isCollapsed ? "w-18" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Footprints className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-bold text-slate-900 text-sm block leading-tight">
                Safary Hub
              </span>
              <span className="text-[11px] text-slate-400 font-medium capitalize">
                {role} Console
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition hidden lg:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider px-2.5 mb-1.5 uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition group relative",
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition",
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-100 text-blue-700">
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

      {/* Customer Website Link at Bottom */}
      <div className="p-3 border-t border-slate-100">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition",
            isCollapsed && "justify-center"
          )}
          title="Open Customer Website"
        >
          <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>View Storefront</span>}
        </Link>
      </div>
    </aside>
  );
}
