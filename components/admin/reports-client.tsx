"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { downloadReportPdf } from "@/lib/utils/pdf";
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  PieChart,
  Boxes,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

interface ReportsClientProps {
  data: {
    isOwner: boolean;
    totalGrossSales: number;
    totalDiscounts: number;
    totalCostOfGoodsSold: number | null;
    grossProfit: number | null;
    totalExpensesAmount: number;
    netOperatingProfit: number | null;
    totalCreditDue: number;
    paymentBreakdown: Record<string, number>;
    productPerformance: {
      name: string;
      code: string;
      soldQty: number;
      revenue: number;
      cost: number;
      margin: number;
    }[];
    billCount: number;
    expenseCount: number;
  };
}

export function ReportsClient({ data }: ReportsClientProps) {
  if (!data.isOwner) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-semibold text-slate-900">Restricted Access</h2>
        <p className="text-xs text-slate-500">
          Financial profitability reports, gross margins, and cost accounting data are restricted to the Shop Owner.
        </p>
      </div>
    );
  }

  function handleExportCSV() {
    const rows = [
      ["Slipper Model", "Quantity Sold", "Total Revenue", "Cost of Goods", "Gross Margin"],
      ...data.productPerformance.map((p) => [
        p.name,
        p.soldQty.toString(),
        p.revenue.toString(),
        p.cost.toString(),
        p.margin.toString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Safary_Bags_Footwear_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Financial & Sales Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive retail profit calculation, product velocity, and expense balance sheet.
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => downloadReportPdf(data)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Financial P&L Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Total Net Sales
          </span>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-slate-900">
              {formatCurrency(data.totalGrossSales)}
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">{data.billCount} completed POS transactions</p>
        </div>

        {/* Cost of Goods */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Cost of Goods Sold (COGS)
          </span>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-slate-600">
              {formatCurrency(data.totalCostOfGoodsSold || 0)}
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Based on exact unit cost snapshots</p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Gross Profit Margin
          </span>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-indigo-700">
              {formatCurrency(data.grossProfit || 0)}
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Sales minus wholesale cost</p>
        </div>

        {/* Net Operating Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Net Operating Profit
          </span>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-emerald-700">
              {formatCurrency(data.netOperatingProfit || 0)}
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">After deducting shop overheads</p>
        </div>
      </div>

      {/* Payment Modes & Overheads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-blue-600" /> Payment Mode Breakdown
            </h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-semibold text-slate-700">Cash Collections:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(data.paymentBreakdown.cash || 0)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-semibold text-slate-700">UPI / QR Transfers:</span>
              <span className="font-semibold text-blue-700">{formatCurrency(data.paymentBreakdown.upi || 0)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-semibold text-slate-700">Card Swipes:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(data.paymentBreakdown.card || 0)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-red-50 text-red-700">
              <span className="font-semibold">Credit Balance Outstanding:</span>
              <span className="font-semibold">{formatCurrency(data.totalCreditDue)}</span>
            </div>
          </div>
        </div>

        {/* Operating Expenses Summary */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-blue-600" /> Operational Overheads ({data.expenseCount} entries)
            </h2>
            <span className="text-xs font-semibold text-slate-900">
              Total Deducted: {formatCurrency(data.totalExpensesAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Deducted directly from gross margins to yield the net cash flow. Review the individual expense journal in the Expenses module.
          </p>
        </div>
      </div>

      {/* Slipper Model Sales Velocity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-800">
            Product Sales Velocity & Margins
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Slipper Model</th>
                <th className="py-3 px-4 font-semibold">Quantity Sold</th>
                <th className="py-3 px-4 font-semibold">Sales Revenue</th>
                <th className="py-3 px-4 font-semibold">Wholesale Cost</th>
                <th className="py-3 px-4 font-semibold text-right">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.productPerformance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No product sales logged yet.
                  </td>
                </tr>
              ) : (
                data.productPerformance.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-blue-700">
                      {item.soldQty} pairs
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatCurrency(item.margin)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
