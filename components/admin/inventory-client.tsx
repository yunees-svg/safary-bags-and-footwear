"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductVariant, Product, Category, StockMovementType } from "@/lib/types/database";
import { adjustStockAction } from "@/lib/actions/inventory";
import {
  Boxes,
  History,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
} from "lucide-react";

interface VariantItem extends ProductVariant {
  product: Product;
  category?: Category;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

interface InventoryClientProps {
  items: VariantItem[];
  categories: Category[];
}

export function InventoryClient({ items, categories }: InventoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  // Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<VariantItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [movementType, setMovementType] = useState<StockMovementType>("adjustment_in");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.colour.toLowerCase().includes(search.toLowerCase()) ||
      item.size.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.product.category_id === selectedCategory;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.isLowStock) ||
      (stockFilter === "out" && item.isOutOfStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPairs = items.reduce((acc, i) => acc + i.stock_quantity, 0);
  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const outOfStockCount = items.filter((i) => i.isOutOfStock).length;

  function openAdjustmentModal(item: VariantItem) {
    setAdjustingItem(item);
    setNewQuantity(item.stock_quantity);
    setMovementType("adjustment_in");
    setReason("Physical stock audit & count correction");
  }

  async function handleSaveAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!adjustingItem) return;

    setFeedback(null);
    setLoading(true);

    const res = await adjustStockAction({
      variant_id: adjustingItem.id,
      new_quantity: Number(newQuantity),
      movement_type: movementType,
      reason,
    });

    if (res?.error) {
      setFeedback({ type: "error", message: res.error });
    } else {
      setFeedback({
        type: "success",
        message: `Stock for ${adjustingItem.product.name} (${adjustingItem.colour}, Size ${adjustingItem.size}) successfully updated to ${newQuantity} pairs.`,
      });
      setAdjustingItem(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time stock tracking by model, colour and size with low-stock alerts.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/inventory/movements"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <History className="w-4 h-4 text-slate-500" />
            Audit Movements Ledger
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Total Slipper Stock
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{totalPairs}</span>
            <span className="text-xs text-slate-400">pairs in store</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Low Stock Variants
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-semibold ${lowStockCount > 0 ? "text-amber-600" : "text-slate-900"}`}>
              {lowStockCount}
            </span>
            <span className="text-xs text-slate-400">below threshold</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-2xs font-medium text-slate-500">
            Out of Stock
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-semibold ${outOfStockCount > 0 ? "text-red-600" : "text-slate-900"}`}>
              {outOfStockCount}
            </span>
            <span className="text-xs text-slate-400">depleted</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 text-xs border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product, SKU, colour, size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Stock Status</option>
            <option value="low">Low Stock (≤ Threshold)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Slipper Model</th>
                <th className="py-3 px-4 font-semibold">Colour</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Available Stock</th>
                <th className="py-3 px-4 font-semibold">Threshold</th>
                <th className="py-3 px-4 font-semibold text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No inventory records match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{item.product.name}</div>
                      <div className="text-2xs font-normal text-slate-400">
                        {item.category?.name || "Uncategorized"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {item.colour}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Size {item.size}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-2xs text-slate-500">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold text-sm ${
                            item.isOutOfStock
                              ? "text-red-600"
                              : item.isLowStock
                              ? "text-amber-600"
                              : "text-slate-900"
                          }`}
                        >
                          {item.stock_quantity}
                        </span>
                        {item.isOutOfStock ? (
                          <span className="px-1.5 py-0.5 rounded text-2xs font-semibold bg-red-100 text-red-700">
                            Depleted
                          </span>
                        ) : item.isLowStock ? (
                          <span className="px-1.5 py-0.5 rounded text-2xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-2xs text-slate-400">in stock</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      ≤ {item.low_stock_threshold}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openAdjustmentModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-semibold rounded-lg text-xs transition"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Adjust Inventory Stock
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Updating: <span className="font-semibold text-slate-800">{adjustingItem.product.name}</span> ({adjustingItem.colour}, Size {adjustingItem.size})
            </p>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Recorded Stock:</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {adjustingItem.stock_quantity} pairs
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Actual Count *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="mt-1 flex items-center justify-between text-2xs">
                  <span className="text-slate-400">Adjustment delta:</span>
                  <span
                    className={`font-semibold ${
                      newQuantity - adjustingItem.stock_quantity > 0
                        ? "text-emerald-600"
                        : newQuantity - adjustingItem.stock_quantity < 0
                        ? "text-red-600"
                        : "text-slate-500"
                    }`}
                  >
                    {newQuantity - adjustingItem.stock_quantity > 0 && "+"}
                    {newQuantity - adjustingItem.stock_quantity} pairs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Movement Classification *
                </label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as StockMovementType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="adjustment_in">Stock Found / Physical Count Surplus (Adjustment In)</option>
                  <option value="adjustment_out">Count Shortage / Discrepancy (Adjustment Out)</option>
                  <option value="damage">Damaged in Store / Defective Sole</option>
                  <option value="theft">Shop Floor Shrinkage / Theft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Reason & Notes *
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Mandatory explanation for accounting and audit compliance..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Stock Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
