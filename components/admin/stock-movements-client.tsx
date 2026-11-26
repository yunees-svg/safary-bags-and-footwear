"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { StockMovement } from "@/lib/types/database";
import {
  History,
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
} from "lucide-react";

interface MovementRecord extends StockMovement {
  productName: string;
  colour: string;
  size: string;
  sku: string;
}

interface StockMovementsClientProps {
  movements: MovementRecord[];
}

export function StockMovementsClient({ movements }: StockMovementsClientProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = movements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase()) ||
      (m.reason && m.reason.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "all" || m.movement_type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Inventory
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Stock Movement History & Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all inventory additions, POS sales, adjustments, and supplier receipts.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product, SKU, or audit reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Movement Types</option>
            <option value="sale">Sale (POS Bill)</option>
            <option value="purchase">Purchase (Stock In)</option>
            <option value="adjustment_in">Adjustment In</option>
            <option value="adjustment_out">Adjustment Out</option>
            <option value="damage">Damaged</option>
            <option value="theft">Theft</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Product & Variant</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Classification</th>
                <th className="py-3 px-4 font-semibold">Quantity Delta</th>
                <th className="py-3 px-4 font-semibold">Reason / Reference</th>
                <th className="py-3 px-4 font-semibold">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No movement records found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-2xs">
                      {formatDate(m.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{m.productName}</div>
                      <div className="text-2xs text-slate-500">
                        {m.colour} • Size {m.size}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-2xs text-slate-500">
                      {m.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold capitalize ${
                          m.quantity > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {m.quantity > 0 ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-rose-600" />
                        )}
                        {m.movement_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-sm">
                      <span
                        className={
                          m.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                        }
                      >
                        {m.quantity > 0 && "+"}
                        {m.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {m.reason || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {m.created_by}
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
