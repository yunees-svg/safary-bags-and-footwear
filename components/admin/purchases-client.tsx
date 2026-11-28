"use client";

import { useState } from "react";
import Link from "next/link";
import { Purchase, PurchaseStatus, Supplier } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { downloadPurchasePdf } from "@/lib/utils/pdf";
import { createSupplierAction, updatePurchaseAction, deletePurchaseAction } from "@/lib/actions/purchases";
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  UserPlus,
  AlertCircle,
  Loader2,
  Sparkles,
  Pencil,
  Trash2,
  FileDown,
} from "lucide-react";

interface PurchasesClientProps {
  purchases: Purchase[];
  suppliers: Supplier[];
}

export function PurchasesClient({ purchases, suppliers }: PurchasesClientProps) {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>(purchases);
  const [search, setSearch] = useState("");
  const [isOpenAddSupplier, setIsOpenAddSupplier] = useState(false);
  const [supName, setSupName] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supAddress, setSupAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit / Delete Purchase state
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [editInvNo, setEditInvNo] = useState("");
  const [editSupId, setEditSupId] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTotal, setEditTotal] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<PurchaseStatus>("confirmed");
  const [savingEdit, setSavingEdit] = useState(false);

  const filtered = purchaseList.filter((p) => {
    return (
      p.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.supplier?.name && p.supplier.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  function openEditPurchase(p: Purchase) {
    setEditingPurchase(p);
    setEditInvNo(p.invoice_number);
    setEditSupId(p.supplier_id);
    setEditDate(p.purchase_date);
    setEditTotal(p.total_amount);
    setEditStatus(p.status);
    setError(null);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPurchase) return;
    setSavingEdit(true);
    setError(null);

    const res = await updatePurchaseAction(editingPurchase.id, {
      invoice_number: editInvNo,
      supplier_id: editSupId,
      purchase_date: editDate,
      total_amount: editTotal,
      status: editStatus,
    });

    if (res?.error) {
      setError(res.error);
    } else if (res?.purchase) {
      setPurchaseList((prev) =>
        prev.map((item) => (item.id === editingPurchase.id ? res.purchase! : item))
      );
      setSuccess(`Updated invoice #${res.purchase.invoice_number}.`);
      setEditingPurchase(null);
    }
    setSavingEdit(false);
  }

  async function handleDeletePurchase(p: Purchase) {
    if (!window.confirm(`Delete purchase invoice #${p.invoice_number}?`)) return;
    setError(null);
    const res = await deletePurchaseAction(p.id);
    if (res?.error) {
      setError(res.error);
    } else {
      setPurchaseList((prev) => prev.filter((item) => item.id !== p.id));
      setSuccess(`Deleted invoice #${p.invoice_number}.`);
    }
  }

  function handleDownloadPdf(p: Purchase) {
    downloadPurchasePdf(p);
  }

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await createSupplierAction({
      name: supName,
      phone: supPhone,
      address: supAddress,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("Supplier registered successfully!");
      setIsOpenAddSupplier(false);
      setSupName("");
      setSupPhone("");
      setSupAddress("");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Purchases & Supplier Stock-In
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log supplier purchases and automatically increase slipper inventory upon confirmation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsOpenAddSupplier(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            Add Supplier
          </button>
          <Link
            href="/admin/purchases/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1f5fff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-[0_4px_14px_rgba(31,95,255,0.35)] transition"
          >
            <Sparkles className="w-4 h-4" />
            AI Scan Wholesale Bill
          </Link>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Supplier Directory Quick Glance */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-semibold text-slate-800 mb-2.5 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-blue-600" /> Active Slipper Suppliers ({suppliers.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {suppliers.map((s) => (
            <div key={s.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <p className="font-semibold text-slate-900">{s.name}</p>
              <p className="text-2xs text-slate-500">{s.phone}</p>
              {s.address && <p className="text-2xs text-slate-400 truncate mt-0.5">{s.address}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by invoice number or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice No.</th>
                <th className="py-3 px-4 font-semibold">Supplier</th>
                <th className="py-3 px-4 font-semibold">Purchase Date</th>
                <th className="py-3 px-4 font-semibold">Total Cost</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No purchase invoices recorded yet. Click &quot;AI Scan Wholesale Bill&quot; to stock in.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {p.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {p.supplier?.name || "Direct Vendor"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {p.purchase_date}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatCurrency(p.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold capitalize ${
                          p.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "draft"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.status === "confirmed" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : p.status === "draft" ? (
                          <Clock className="w-3 h-3 text-amber-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-600" />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-[#f4f7fc]">
                      {(() => {
                        const items = (p.items || []) as any[];
                        const totalPairs = items.reduce((a, b) => a + (b.quantity || 0), 0);
                        const firstName = items[0]?.item_name;
                        return (
                          <div className="min-w-0">
                            {firstName && (
                              <p className="text-xs font-medium text-slate-800 dark:text-[#f4f7fc] truncate max-w-[200px]">
                                {firstName}
                                {items.length > 1 ? ` (+${items.length - 1} more)` : ""}
                              </p>
                            )}
                            <p className="text-2xs text-slate-400 dark:text-[#8896b3]">
                              {totalPairs} pairs
                            </p>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                          title="Download / Print PDF"
                          aria-label={`Download PDF for invoice ${p.invoice_number}`}
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditPurchase(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#5b8cff] hover:bg-blue-500/10 transition"
                          title="Edit invoice"
                          aria-label={`Edit invoice ${p.invoice_number}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePurchase(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete invoice"
                          aria-label={`Delete invoice ${p.invoice_number}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isOpenAddSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Add Footwear Supplier</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter wholesaler or distributor details for purchasing stock.
            </p>

            <form onSubmit={handleAddSupplier} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="e.g., Metro Footwear Wholesalers"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  placeholder="+91 98111 22233"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Factory / Office Address
                </label>
                <textarea
                  rows={2}
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  placeholder="Industrial Area, City..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAddSupplier(false)}
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Purchase Modal */}
      {editingPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111a2e] rounded-[20px] max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-[#1e2a44]">
            <h2 className="text-base font-semibold text-slate-900 dark:text-[#f4f7fc] mb-1">Edit Purchase Invoice</h2>
            <p className="text-xs text-slate-500 dark:text-[#8896b3] mb-4">
              Update invoice number, supplier, date, total cost, or status.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8896b3] mb-1">
                  Invoice No. *
                </label>
                <input
                  type="text"
                  required
                  value={editInvNo}
                  onChange={(e) => setEditInvNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#1e2a44] bg-white dark:bg-[#162036] rounded-lg text-xs text-slate-900 dark:text-[#f4f7fc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8896b3] mb-1">
                  Supplier
                </label>
                <select
                  value={editSupId}
                  onChange={(e) => setEditSupId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#1e2a44] bg-white dark:bg-[#162036] rounded-lg text-xs text-slate-900 dark:text-[#f4f7fc]"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8896b3] mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1e2a44] bg-white dark:bg-[#162036] rounded-lg text-xs text-slate-900 dark:text-[#f4f7fc]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8896b3] mb-1">
                    Total Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editTotal}
                    onChange={(e) => setEditTotal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#1e2a44] bg-white dark:bg-[#162036] rounded-lg text-xs text-slate-900 dark:text-[#f4f7fc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8896b3] mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PurchaseStatus)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#1e2a44] bg-white dark:bg-[#162036] rounded-lg text-xs text-slate-900 dark:text-[#f4f7fc]"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPurchase(null)}
                  className="px-3.5 py-2 border border-slate-200 dark:border-[#1e2a44] text-slate-700 dark:text-[#8896b3] hover:bg-slate-50 dark:hover:bg-[#162036] text-xs font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1f5fff] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
