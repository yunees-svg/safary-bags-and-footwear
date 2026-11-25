"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Supplier, Product, ProductVariant } from "@/lib/types/database";
import { createPurchaseEntryAction } from "@/lib/actions/purchases";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
} from "lucide-react";

interface VariantOption extends ProductVariant {
  product: Product;
}

interface NewPurchaseClientProps {
  suppliers: Supplier[];
  variants: VariantOption[];
}

export function NewPurchaseClient({ suppliers, variants }: NewPurchaseClientProps) {
  const router = useRouter();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"confirmed" | "draft">("confirmed");

  const [items, setItems] = useState<{
    variant_id: string;
    quantity: number;
    unit_cost: number;
  }[]>([
    {
      variant_id: variants[0]?.id || "",
      quantity: 20,
      unit_cost: variants[0]?.product.cost_price || 200,
    },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addItemRow() {
    setItems([
      ...items,
      {
        variant_id: variants[0]?.id || "",
        quantity: 10,
        unit_cost: variants[0]?.product.cost_price || 200,
      },
    ]);
  }

  function removeItemRow(index: number) {
    setItems(items.filter((_, idx) => idx !== index));
  }

  function updateItem(index: number, field: string, val: any) {
    const updated = [...items];
    if (field === "variant_id") {
      const v = variants.find((vr) => vr.id === val);
      updated[index] = {
        ...updated[index],
        variant_id: val,
        unit_cost: v?.product.cost_price || updated[index].unit_cost,
      };
    } else {
      updated[index] = { ...updated[index], [field]: val };
    }
    setItems(updated);
  }

  const grandTotal = items.reduce((acc, i) => acc + (i.quantity || 0) * (i.unit_cost || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (items.length === 0) {
      setError("Please add at least one item to the invoice.");
      setLoading(false);
      return;
    }

    const res = await createPurchaseEntryAction({
      supplier_id: supplierId,
      invoice_number: invoiceNumber,
      purchase_date: purchaseDate,
      status,
      items: items.map((i) => ({
        variant_id: i.variant_id,
        quantity: Number(i.quantity),
        unit_cost: Number(i.unit_cost),
      })),
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/admin/purchases");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Purchases
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/purchases"
            className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save & Confirm Stock-In
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Invoice Meta Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Truck className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Purchase Invoice Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier *
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supplier Invoice # *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., INV-94812"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              required
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Stock In Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="confirmed">Confirmed (Add to Stock Now)</option>
              <option value="draft">Draft (Do Not Stock In Yet)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Slipper Items to Stock In */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Purchased Slipper Items</h2>
          </div>
          <span className="text-xs font-bold text-slate-800">
            Total Purchase Cost: {formatCurrency(grandTotal)}
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Slipper Variant</th>
                <th className="py-2.5 px-3 font-semibold w-28">Quantity</th>
                <th className="py-2.5 px-3 font-semibold w-32">Unit Cost (₹)</th>
                <th className="py-2.5 px-3 font-semibold w-32 text-right">Subtotal</th>
                <th className="py-2.5 px-3 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3">
                    <select
                      value={row.variant_id}
                      onChange={(e) => updateItem(idx, "variant_id", e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-900"
                    >
                      {variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.product.name} — {v.colour}, Size {v.size} ({v.sku})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="1"
                      required
                      value={row.quantity}
                      onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-900"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={row.unit_cost}
                      onChange={(e) => updateItem(idx, "unit_cost", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-900"
                    />
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900 text-right">
                    {formatCurrency(row.quantity * row.unit_cost)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={addItemRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Another Slipper Line
          </button>
        </div>
      </div>
    </form>
  );
}
