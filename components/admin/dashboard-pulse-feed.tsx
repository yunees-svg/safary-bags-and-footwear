"use client";

import { useState } from "react";
import Link from "next/link";
import { PulseFeedItem } from "@/lib/actions/dashboard";
import { ReceiptModal } from "@/components/admin/receipt-modal";
import { Bill, ShopSettings } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Activity,
  ShoppingBag,
  AlertTriangle,
  WalletCards,
  Truck,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Receipt,
  Sparkles,
  Phone,
} from "lucide-react";

interface DashboardPulseFeedProps {
  feed: PulseFeedItem[];
  settings: ShopSettings;
  bills: Bill[];
}

export function DashboardPulseFeed({ feed, settings, bills }: DashboardPulseFeedProps) {
  const [activeBill, setActiveBill] = useState<Bill | null>(null);

  function handleOpenReceipt(billId?: string) {
    if (!billId) return;
    const b = bills.find((item) => item.id === billId);
    if (b) setActiveBill(b);
  }

  function getIcon(type: PulseFeedItem["type"]) {
    switch (type) {
      case "sale":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case "stock_alert":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "credit_warning":
        return <WalletCards className="w-4 h-4 text-red-600" />;
      case "purchase":
        return <Truck className="w-4 h-4 text-purple-600" />;
      case "enquiry":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  }

  function getBadgeClasses(color?: string) {
    switch (color) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "amber":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "red":
        return "bg-red-50 text-red-700 border-red-200";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Live Store Heartbeat
                <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Real-Time Pulse
                </span>
              </h2>
              <p className="text-2xs text-slate-400">
                Live counter sales, low stock alerts & customer activity
              </p>
            </div>
          </div>
          <span className="text-2xs text-slate-400 font-mono hidden sm:inline">
            Active Feed
          </span>
        </div>

        {/* Chronological Event Feed */}
        <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
          {feed.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent events in the heartbeat feed.
            </div>
          ) : (
            feed.map((item) => (
              <div
                key={item.id}
                className="p-3.5 hover:bg-slate-50/80 transition flex items-start gap-3 group"
              >
                {/* Icon Circle */}
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                  {getIcon(item.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-2xs font-semibold border ${getBadgeClasses(
                          item.badgeColor
                        )} shrink-0`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-2xs text-slate-600 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-2xs">
                    <span className="text-slate-400">
                      {formatDate(item.timestamp)}
                    </span>

                    {/* Quick Action Button */}
                    <div className="flex items-center gap-2">
                      {item.billId && (
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(item.billId)}
                          className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                        >
                          <Receipt className="w-3 h-3" /> View Receipt
                        </button>
                      )}

                      {item.actionHref && (
                        <Link
                          href={item.actionHref}
                          className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                        >
                          {item.actionLabel} →
                        </Link>
                      )}

                      {item.whatsAppUrl && (
                        <a
                          href={item.whatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                        >
                          <Phone className="w-3 h-3" /> Send Due Reminder
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Receipt Modal View */}
      {activeBill && (
        <ReceiptModal
          bill={activeBill}
          settings={settings}
          onClose={() => setActiveBill(null)}
        />
      )}
    </>
  );
}
