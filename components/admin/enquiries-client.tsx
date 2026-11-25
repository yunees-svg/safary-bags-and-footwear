"use client";

import { useState } from "react";
import { Enquiry, ProductVariant, Product } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { createEnquiryAction, updateEnquiryStatusAction } from "@/lib/actions/enquiries";
import {
  MessageSquareQuote,
  Plus,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface EnquiryRecord extends Enquiry {
  productName?: string;
  colour?: string;
  size?: string;
}

interface EnquiriesClientProps {
  enquiries: EnquiryRecord[];
  variants: (ProductVariant & { product: Product })[];
}

export function EnquiriesClient({ enquiries, variants }: EnquiriesClientProps) {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [custName, setCustName] = useState("");
  const [phone, setPhone] = useState("");
  const [variantId, setVariantId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await createEnquiryAction({
      customer_name: custName,
      phone,
      variant_id: variantId || null,
      message,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("WhatsApp customer enquiry logged successfully!");
      setIsOpenAdd(false);
      setCustName("");
      setPhone("");
      setVariantId("");
      setMessage("");
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: Enquiry["status"]) {
    await updateEnquiryStatusAction(id, status);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-blue-600" />
            WhatsApp Orders & Enquiries Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log and follow up with customers ordering via WhatsApp from the public storefront.
          </p>
        </div>
        <button
          onClick={() => setIsOpenAdd(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Log Customer Enquiry
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Info notice about WhatsApp business flow */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
        <MessageSquareQuote className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">WhatsApp Workflow Policy:</span> Customers send availability enquiries from the storefront directly to the shop's WhatsApp. Staff manually record the enquiry below, verify inventory, confirm the sale via Point of Sale (POS), and update status to <span className="font-semibold text-emerald-700">Converted</span>. Enquiries never reduce stock automatically.
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Date Logged</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Interested Slipper Model</th>
                <th className="py-3 px-4 font-semibold">Customer Message</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No customer WhatsApp enquiries logged yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(e.created_at)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{e.customer_name}</div>
                      <div className="text-[11px] font-normal text-slate-500">{e.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {e.productName ? (
                        <div>
                          <span>{e.productName}</span>
                          <span className="text-[11px] text-slate-500 block">
                            {e.colour} • Size {e.size}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">General Catalog Enquiry</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {e.message || "Interested in checking availability."}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={e.status}
                        onChange={(evt) => handleStatusChange(e.id, evt.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200 capitalize focus:outline-none ${
                          e.status === "converted"
                            ? "bg-emerald-50 text-emerald-700"
                            : e.status === "contacted"
                            ? "bg-blue-50 text-blue-700"
                            : e.status === "cancelled"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <option value="new">New Enquiry</option>
                        <option value="contacted">Contacted Customer</option>
                        <option value="converted">Converted to Bill</option>
                        <option value="cancelled">Cancelled / Dropped</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${e.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        Reply on WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Enquiry Modal */}
      {isOpenAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Log Customer WhatsApp Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Record customer details and requested slipper model for counter follow-up.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g., Sunil Verma"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 9876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requested Slipper Variant (Optional)
                </label>
                <select
                  value={variantId}
                  onChange={(e) => setVariantId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">General Slipper Enquiry</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.product.name} — {v.colour}, Size {v.size} ({v.stock_quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Message / Request
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Checking if size 8 is available in black..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAdd(false)}
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
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
