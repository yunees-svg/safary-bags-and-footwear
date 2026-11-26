"use client";

import { useState } from "react";
import { ShopSettings } from "@/lib/types/database";
import { updateSettingsAction } from "@/lib/actions/settings";
import {
  Settings,
  Store,
  Phone,
  Clock,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

interface SettingsClientProps {
  settings: ShopSettings;
  isOwner: boolean;
}

export function SettingsClient({ settings, isOwner }: SettingsClientProps) {
  const [shopName, setShopName] = useState(settings.shop_name);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp_number);
  const [upiId, setUpiId] = useState(settings.upi_id || "safarybags@okaxis");
  const [hours, setHours] = useState(settings.opening_hours);
  const [billPrefix, setBillPrefix] = useState(settings.bill_prefix);
  const [lowStockDefault, setLowStockDefault] = useState(settings.low_stock_default);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOwner) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-semibold text-slate-900">Restricted Access</h2>
        <p className="text-xs text-slate-500">
          Only the Shop Owner can configure store profile details, receipts, and billing parameters.
        </p>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const res = await updateSettingsAction({
      shop_name: shopName,
      address,
      phone,
      whatsapp_number: whatsapp,
      upi_id: upiId,
      opening_hours: hours,
      bill_prefix: billPrefix,
      low_stock_default: Number(lowStockDefault),
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("Shop profile and billing settings saved successfully!");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Shop Configuration & Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store identity, customer contact details, WhatsApp number, and POS receipt headers.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50 shrink-0"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Identity & Contact */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Store className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Store Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shop Name *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physical Shop Address *
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Ordering Number *
            </label>
            <input
              type="text"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-2xs text-slate-400">Target phone for website customer click-to-chat links</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store GPay / UPI ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. yourname@okaxis"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-2xs text-slate-400">Used for auto-generating dynamic QR codes at POS counter</span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Hours *
            </label>
            <input
              type="text"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Point of Sale & Receipt Rules */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Receipt className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">Point of Sale & Numbering Rules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bill Number Prefix
            </label>
            <input
              type="text"
              value={billPrefix}
              onChange={(e) => setBillPrefix(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-2xs text-slate-400">e.g., SLIP-20261125-0001</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Low Stock Warning Threshold
            </label>
            <input
              type="number"
              min="1"
              value={lowStockDefault}
              onChange={(e) => setLowStockDefault(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-2xs text-slate-400">Alert triggers when variant stock ≤ threshold</span>
          </div>
        </div>
      </div>
    </form>
  );
}
