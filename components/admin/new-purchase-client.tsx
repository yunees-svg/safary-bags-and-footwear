"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Supplier, Product, ProductVariant } from "@/lib/types/database";
import { createPurchaseEntryAction } from "@/lib/actions/purchases";
import { parseSupplierInvoiceAction, ParsedInvoiceResult } from "@/lib/actions/ai-document";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  Scan,
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

  // AI Invoice Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ParsedInvoiceResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleScanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await parseSupplierInvoiceAction({
        fileBase64: base64,
        fileName: file.name,
        fileType: file.type,
      });

      applyScanResult(res);
      setIsScanning(false);
    };
    reader.onerror = () => {
      setError("Failed to read invoice file.");
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleSampleScan(templateId: "vkc-wholesale" | "safary-bags") {
    setIsScanning(true);
    setError(null);
    const res = await parseSupplierInvoiceAction({ sampleTemplateId: templateId });
    applyScanResult(res);
    setIsScanning(false);
  }

  function applyScanResult(res: ParsedInvoiceResult) {
    if (!res.success) {
      setError(res.error || "Failed to parse invoice.");
      return;
    }

    setScanResult(res);

    if (res.matchedSupplierId) {
      setSupplierId(res.matchedSupplierId);
    }
    if (res.invoiceNumber) {
      setInvoiceNumber(res.invoiceNumber);
    }
    if (res.invoiceDate) {
      setPurchaseDate(res.invoiceDate);
    }

    if (res.items && res.items.length > 0) {
      const newItems = res.items.map((it) => ({
        variant_id: it.matchedVariantId || variants[0]?.id || "",
        quantity: it.quantity,
        unit_cost: it.unitCost,
      }));
      setItems(newItems);
    }
  }

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

      {/* AI Document Processing Card (Velom Concept) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 text-white p-5 rounded-2xl border border-indigo-500/30 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Document Processing <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">Velom Smart Ingest</span>
              </h2>
              <p className="text-2xs text-slate-300">
                Upload or photograph a wholesale supplier invoice. AI will extract supplier, bill number, line items, and quantities automatically.
              </p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleScanFile}
            accept="image/*,.pdf"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning Document...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Upload Invoice Bill
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Instant Demo Samples */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-2xs">
          <span className="text-slate-400">Quick Test Templates:</span>
          <button
            type="button"
            disabled={isScanning}
            onClick={() => handleSampleScan("vkc-wholesale")}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 border border-white/10 transition flex items-center gap-1"
          >
            <span>⚡</span> VKC Footwear Bill (60 pairs)
          </button>
          <button
            type="button"
            disabled={isScanning}
            onClick={() => handleSampleScan("safary-bags")}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 border border-white/10 transition flex items-center gap-1"
          >
            <span>⚡</span> Safari Backpacks & Ortho Bill (50 items)
          </button>
        </div>

        {/* Scan Confirmation Notice if scanned */}
        {scanResult && scanResult.success && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>AI Recognized:</strong> {scanResult.rawSummary} Extracted {scanResult.items.length} line items (Total {formatCurrency(scanResult.totalAmount)}).
              </span>
            </div>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
              Form Auto-Filled ✓
            </span>
          </div>
        )}
      </div>

      {/* Invoice Meta Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Truck className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Purchase Invoice Details</h2>
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
            <h2 className="text-sm font-semibold text-slate-900">Purchased Slipper Items</h2>
          </div>
          <span className="text-xs font-semibold text-slate-800">
            Total Purchase Cost: {formatCurrency(grandTotal)}
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-200">
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
                  <td className="py-2 px-3 font-semibold text-slate-900 text-right">
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
