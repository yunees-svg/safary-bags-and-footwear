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
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Shop Operations Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sales, inventory alerts, and daily retail performance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            New Bill (POS)
          </Link>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            <Package className="w-4 h-4" />
            Check Stock
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-fade-up hover-lift"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Today&apos;s Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              <AnimatedNumber value={data.todaySales} />
            </span>
            <span className="text-2xs font-medium text-emerald-600">
              {data.todayBillCount} {data.todayBillCount === 1 ? "bill" : "bills"}
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Live confirmed counter sales</p>
        </div>

        {/* Total Revenue */}
        <div
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-fade-up hover-lift"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              <AnimatedNumber value={data.totalRevenue} />
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Accumulated completed transactions</p>
        </div>

        {/* Estimated Gross Profit (Owner only) */}
        {data.isOwner && (
          <div
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-fade-up hover-lift"
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Est. Gross Profit
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-indigo-900">
                <AnimatedNumber value={data.estimatedGrossProfit ?? 0} />
              </span>
            </div>
            <p className="text-2xs text-slate-400 mt-1">Cost vs selling price margin</p>
          </div>
        )}

        {/* Low Stock Alert Card */}
        <div
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-fade-up hover-lift"
          style={{ animationDelay: "180ms" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-semibold ${data.lowStockItems.length > 0 ? "text-amber-600" : "text-slate-900"}`}>
              <AnimatedNumber value={data.lowStockItems.length} isCurrency={false} />
            </span>
            <span className="text-2xs font-medium text-slate-500">
              variants critical
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Stock ≤ threshold quantity</p>
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
              <p className="text-2xs text-slate-400">Latest completed point-of-sale bills</p>
            </div>
            <Link
              href="/admin/pos"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Top Sellers</h2>
              <p className="text-2xs text-slate-400">Most purchased slippers</p>
            </div>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {data.bestSellers.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Sales rankings will appear here as bills are created.
              </p>
            ) : (
              data.bestSellers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
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
