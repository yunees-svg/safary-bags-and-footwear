"use client";

import { useState } from "react";
import { Customer, PaymentMethod } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { recordCreditPaymentAction } from "@/lib/actions/customers";
import {
  WalletCards,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowDownCircle,
  Phone,
} from "lucide-react";

interface CustomerWithCredit extends Customer {
  totalBills: number;
  totalPurchased: number;
}

interface CreditClientProps {
  customers: CustomerWithCredit[];
}

export function CreditClient({ customers }: CreditClientProps) {
  const [search, setSearch] = useState("");
  const [settlingCustomer, setSettlingCustomer] = useState<CustomerWithCredit | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter customers with outstanding credit
  const creditCustomers = customers.filter(
    (c) =>
      (c.outstanding_balance || 0) > 0 &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase()))
  );

  const totalOutstanding = customers.reduce(
    (acc, c) => acc + (c.outstanding_balance || 0),
    0
  );

  function openSettlementModal(c: CustomerWithCredit) {
    setSettlingCustomer(c);
    setAmount(c.outstanding_balance?.toString() || "");
    setPaymentMethod("cash");
    setNotes("Credit balance settlement");
    setError(null);
  }

  async function handleSettle(e: React.FormEvent) {
    e.preventDefault();
    if (!settlingCustomer) return;

    setError(null);
    setLoading(true);

    const payAmount = parseFloat(amount) || 0;
    const res = await recordCreditPaymentAction({
      customer_id: settlingCustomer.id,
      amount: payAmount,
      payment_method: paymentMethod,
      notes,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(`Payment of ₹${payAmount} recorded for ${settlingCustomer.name}. Outstanding balance updated.`);
      setSettlingCustomer(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <WalletCards className="w-5 h-5 text-blue-600" />
            Credit Management & Khata Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer credit purchases, collect payments, and settle outstanding balances.
          </p>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-right">
          <p className="text-2xs font-semibold text-red-600">
            Total Outstanding Credit
          </p>
          <p className="text-xl font-bold text-red-700">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Credit Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customers with due credit..."
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
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Lifetime Purchases</th>
                <th className="py-3 px-4 font-semibold">Outstanding Due</th>
                <th className="py-3 px-4 font-semibold text-right">Actions & Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {creditCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-1.5 text-emerald-400" />
                    All customer credit balances are fully clear! No pending payments.
                  </td>
                </tr>
              ) : (
                creditCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {formatCurrency(c.totalPurchased)} ({c.totalBills} bills)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm text-red-600">
                      {formatCurrency(c.outstanding_balance || 0)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/91${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${c.name}, this is a gentle reminder from Safary Bags and Footwear. Your pending credit (Khata) balance is ${formatCurrency(
                              c.outstanding_balance || 0
                            )}. Kindly clear via GPay or visit our shop counter. Thank you!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition"
                          title="Send Due Reminder on WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Due</span>
                        </a>

                        <button
                          onClick={() => openSettlementModal(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                          Record Payment
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

      {/* Collect Payment Modal */}
      {settlingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Record Credit Settlement
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Receiving payment from <span className="font-semibold text-slate-900">{settlingCustomer.name}</span> (Current Balance: {formatCurrency(settlingCustomer.outstanding_balance || 0)})
            </p>

            <form onSubmit={handleSettle} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="cash">Cash Tender</option>
                  <option value="upi">UPI / GPay / PhonePe</option>
                  <option value="card">Card Swipe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Receipt Note
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Cash received at counter"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettlingCustomer(null)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Payment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
