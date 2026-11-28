import { getDashboardMetrics } from "@/lib/actions/dashboard";
import { DashboardPulseFeed } from "@/components/admin/dashboard-pulse-feed";
import { AnimatedNumber } from "@/components/admin/animated-number";
import { ScrollReveal } from "@/components/admin/scroll-reveal";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  ArrowUpRight,
  PlusCircle,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";

export const instant = false;

export default async function AdminOverviewPage() {
  const data = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Hero Card */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gradient-to-br dark:from-[#111a2e] dark:to-[#0d1424] p-6 sm:p-7 rounded-[22px] border border-slate-200 dark:border-[#1e2a44] shadow-xs animate-fade-up">
        {/* Subtle top-right blue radial glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#1f5fff]/15 blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 dark:text-[#f4f7fc] tracking-tight leading-tight">
            Shop Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8896b3] mt-1">
            Real-time sales, inventory alerts, and daily retail performance.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1f5fff] hover:bg-[#326dff] text-white rounded-[13px] text-xs font-semibold shadow-[0_4px_16px_rgba(31,95,255,0.35)] transition-all duration-150 spring-press"
          >
            <PlusCircle className="w-4 h-4" />
            New Bill (POS)
          </Link>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-[#162036] hover:bg-slate-200 dark:hover:bg-[#1e2a44] text-slate-700 dark:text-[#f4f7fc] border border-slate-200 dark:border-[#1e2a44] rounded-[13px] text-xs font-semibold transition-all duration-150 spring-press"
          >
            <Package className="w-4 h-4 text-[#5b8cff]" />
            Check Stock
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (4 Cards with Left Glow Accent, 34px Numbers & Sparklines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div
          className="relative overflow-hidden bg-white dark:bg-[#111a2e] p-5 pl-6 rounded-[20px] border border-slate-200 dark:border-[#1e2a44] hover:border-[#2ad69a]/60 dark:hover:border-[#2ad69a]/60 hover:-translate-y-[3px] transition-all duration-200 shadow-xs animate-fade-up group"
          style={{ animationDelay: "0ms" }}
        >
          <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[#2ad69a] shadow-[0_0_12px_#2ad69a]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8896b3]">
              Today&apos;s Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2ad69a]/15 border border-[#2ad69a]/25 text-[#2ad69a] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-[32px] sm:text-[34px] font-bold text-slate-900 dark:text-[#f4f7fc] tracking-tight leading-none">
              <AnimatedNumber value={data.todaySales} />
            </span>
            <span className="text-xs font-semibold text-[#2ad69a]">
              {data.todayBillCount} {data.todayBillCount === 1 ? "bill" : "bills"}
            </span>
          </div>
          <p className="text-2xs text-slate-400 dark:text-[#8896b3] mt-2">
            Live confirmed counter sales
          </p>
          {/* Faint Sparkline */}
          <svg className="w-full h-6 mt-3 opacity-35 group-hover:opacity-60 transition" viewBox="0 0 120 24" fill="none">
            <path d="M2 20 C 20 18, 30 12, 48 14 C 66 16, 78 6, 98 9 C 108 10, 114 4, 118 3" stroke="#2ad69a" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Total Revenue */}
        <div
          className="relative overflow-hidden bg-white dark:bg-[#111a2e] p-5 pl-6 rounded-[20px] border border-slate-200 dark:border-[#1e2a44] hover:border-[#1f5fff]/60 dark:hover:border-[#1f5fff]/60 hover:-translate-y-[3px] transition-all duration-200 shadow-xs animate-fade-up group"
          style={{ animationDelay: "60ms" }}
        >
          <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[#1f5fff] shadow-[0_0_12px_#1f5fff]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8896b3]">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#1f5fff]/15 border border-[#1f5fff]/25 text-[#5b8cff] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[32px] sm:text-[34px] font-bold text-slate-900 dark:text-[#f4f7fc] tracking-tight leading-none">
              <AnimatedNumber value={data.totalRevenue} />
            </span>
          </div>
          <p className="text-2xs text-slate-400 dark:text-[#8896b3] mt-2">
            Accumulated completed transactions
          </p>
          {/* Faint Sparkline */}
          <svg className="w-full h-6 mt-3 opacity-35 group-hover:opacity-60 transition" viewBox="0 0 120 24" fill="none">
            <path d="M2 19 C 24 17, 42 15, 62 11 C 82 7, 96 10, 118 4" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Estimated Gross Profit (Owner only) */}
        {data.isOwner && (
          <div
            className="relative overflow-hidden bg-white dark:bg-[#111a2e] p-5 pl-6 rounded-[20px] border border-slate-200 dark:border-[#1e2a44] hover:border-[#7a5cff]/60 dark:hover:border-[#7a5cff]/60 hover:-translate-y-[3px] transition-all duration-200 shadow-xs animate-fade-up group"
            style={{ animationDelay: "120ms" }}
          >
            <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[#7a5cff] shadow-[0_0_12px_#7a5cff]" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8896b3]">
                Est. Gross Profit
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#7a5cff]/15 border border-[#7a5cff]/25 text-[#7a5cff] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] sm:text-[34px] font-bold text-[#7a5cff] tracking-tight leading-none">
                <AnimatedNumber value={data.estimatedGrossProfit ?? 0} />
              </span>
            </div>
            <p className="text-2xs text-slate-400 dark:text-[#8896b3] mt-2">
              Cost vs selling price margin
            </p>
            {/* Faint Sparkline */}
            <svg className="w-full h-6 mt-3 opacity-35 group-hover:opacity-60 transition" viewBox="0 0 120 24" fill="none">
              <path d="M2 21 C 18 16, 36 18, 56 12 C 76 6, 98 8, 118 5" stroke="#7a5cff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Low Stock Alert Card */}
        <div
          className="relative overflow-hidden bg-white dark:bg-[#111a2e] p-5 pl-6 rounded-[20px] border border-slate-200 dark:border-[#1e2a44] hover:border-[#f5a524]/60 dark:hover:border-[#f5a524]/60 hover:-translate-y-[3px] transition-all duration-200 shadow-xs animate-fade-up group"
          style={{ animationDelay: "180ms" }}
        >
          <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[#f5a524] shadow-[0_0_12px_#f5a524]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#8896b3]">
              Low Stock Warnings
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#f5a524]/15 border border-[#f5a524]/25 text-[#f5a524] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[32px] sm:text-[34px] font-bold text-slate-900 dark:text-[#f4f7fc] tracking-tight leading-none">
              <AnimatedNumber value={data.lowStockItems.length} isCurrency={false} />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-[#8896b3]">
              variants critical
            </span>
          </div>
          <p className="text-2xs text-slate-400 dark:text-[#8896b3] mt-2">
            Stock ≤ threshold quantity
          </p>
          {/* Faint Sparkline */}
          <svg className="w-full h-6 mt-3 opacity-35 group-hover:opacity-60 transition" viewBox="0 0 120 24" fill="none">
            <path d="M2 16 C 26 16, 44 19, 64 15 C 84 11, 102 14, 118 12" stroke="#f5a524" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Low Stock Warning Callout if any */}
      {data.lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-amber-900">
                Action Needed: {data.lowStockItems.length} Product Variants Running Low
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                {data.lowStockItems.map((i) => `${i.product.name} (${i.colour}, Size ${i.size}): ${i.stock_quantity} left`).slice(0, 3).join(" • ")}
                {data.lowStockItems.length > 3 && ` +${data.lowStockItems.length - 3} more`}
              </p>
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline shrink-0"
          >
            Manage Inventory →
          </Link>
        </div>
      )}

      {/* Live Store Heartbeat & Activity Pulse */}
      <ScrollReveal delayMs={80}>
        <DashboardPulseFeed
          feed={data.pulseFeed}
          settings={data.settings}
          bills={data.recentBills}
        />
      </ScrollReveal>

      {/* Main Grid: Recent Transactions & Best Sellers */}
      <ScrollReveal delayMs={140}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bills (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111a2e] rounded-[22px] border border-slate-200 dark:border-[#1e2a44] shadow-xs overflow-hidden transition-colors duration-200">
          <div className="p-5 border-b border-slate-100 dark:border-[#1e2a44] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#f4f7fc]">Recent Transactions</h2>
              <p className="text-xs text-slate-500 dark:text-[#8896b3] mt-0.5">Latest completed point-of-sale bills</p>
            </div>
            <Link
              href="/admin/pos"
              className="text-xs font-semibold text-[#1f5fff] hover:text-[#5b8cff] flex items-center gap-1 transition-colors duration-150"
            >
              Open POS <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Bill #</th>
                  <th className="py-2.5 px-4 font-semibold">Items</th>
                  <th className="py-2.5 px-4 font-semibold">Total</th>
                  <th className="py-2.5 px-4 font-semibold">Payment</th>
                  <th className="py-2.5 px-4 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.recentBills.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No transactions recorded yet today.
                    </td>
                  </tr>
                ) : (
                  data.recentBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {b.bill_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="truncate max-w-[180px] block">
                          {b.items?.map((it) => `${it.product_name_snapshot} (${it.quantity})`).join(", ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {formatCurrency(b.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 capitalize">
                          {b.payments?.[0]?.payment_method || b.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {formatDate(b.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Selling Products (1 Column) */}
        <div className="bg-white dark:bg-[#111a2e] rounded-[22px] border border-slate-200 dark:border-[#1e2a44] shadow-xs p-5 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#f4f7fc]">Top Sellers</h2>
              <p className="text-xs text-slate-500 dark:text-[#8896b3] mt-0.5">Most purchased slippers</p>
            </div>
            <Layers className="w-4 h-4 text-slate-400 dark:text-[#8896b3]" />
          </div>

          <div className="space-y-3">
            {data.bestSellers.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-[#8896b3] py-6 text-center">
                Sales rankings will appear here as bills are created.
              </p>
            ) : (
              data.bestSellers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#162036] border border-slate-100 dark:border-[#1e2a44] transition-colors duration-150"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-2xs text-slate-500">
                      {item.colour} • Size {item.size}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-blue-600 block">
                      {item.quantity} sold
                    </span>
                    <span className="text-2xs text-slate-400">
                      {formatCurrency(item.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
