"use client";

import { Bill, ShopSettings } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Printer, Check, X, Footprints } from "lucide-react";

interface ReceiptModalProps {
  bill: Bill;
  settings: ShopSettings;
  onClose: () => void;
}

export function ReceiptModal({ bill, settings, onClose }: ReceiptModalProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Actions (Hidden on print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">Transaction Confirmed</p>
              <p className="text-2xs text-slate-400 font-mono">{bill.bill_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-800 bg-white" id="printable-receipt">
          {/* Shop Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 mb-2">
              <Footprints className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 uppercase">
              {settings.shop_name}
            </h2>
            <p className="text-2xs text-slate-500 mt-0.5 leading-snug">
              {settings.address}
            </p>
            <p className="text-2xs text-slate-500 font-medium">
              Phone / WhatsApp: {settings.phone}
            </p>
          </div>

          {/* Bill Meta */}
          <div className="py-3 text-2xs border-b border-dashed border-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Bill No:</span>
              <span className="font-mono font-semibold text-slate-900">{bill.bill_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{formatDate(bill.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span className="capitalize">{bill.created_by}</span>
            </div>
            {bill.customer && (
              <div className="flex justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-medium">{bill.customer.name} ({bill.customer.phone})</span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <table className="w-full text-2xs">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-2xs border-b border-slate-200">
                  <th className="text-left pb-1.5">Item</th>
                  <th className="text-center pb-1.5 w-10">Qty</th>
                  <th className="text-right pb-1.5 w-14">Rate</th>
                  <th className="text-right pb-1.5 w-16">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bill.items?.map((item) => (
                  <tr key={item.id} className="py-1.5">
                    <td className="py-1.5 pr-2">
                      <p className="font-semibold text-slate-900 leading-tight">
                        {item.product_name_snapshot}
                      </p>
                      <p className="text-2xs text-slate-500">
                        {item.colour_snapshot} • Size {item.size_snapshot}
                      </p>
                    </td>
                    <td className="py-1.5 text-center font-medium">{item.quantity}</td>
                    <td className="py-1.5 text-right text-slate-600">
                      ₹{item.unit_price}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">
                      ₹{item.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>-{formatCurrency(bill.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
              <span>Net Total:</span>
              <span>{formatCurrency(bill.total_amount)}</span>
            </div>

            {/* Payment Record */}
            {bill.payments && bill.payments.length > 0 && (
              <div className="pt-2 text-2xs text-slate-600">
                <div className="flex justify-between">
                  <span>Paid via {bill.payments[0].payment_method.toUpperCase()}:</span>
                  <span className="font-semibold">{formatCurrency(bill.payments[0].amount)}</span>
                </div>
                {bill.payments[0].reference_number && (
                  <div className="flex justify-between text-2xs text-slate-400 font-mono">
                    <span>Ref / UPI:</span>
                    <span>{bill.payments[0].reference_number}</span>
                  </div>
                )}
                {bill.total_amount > bill.payments[0].amount && (
                  <div className="flex justify-between text-red-600 font-semibold pt-1">
                    <span>Credit Balance Due:</span>
                    <span>{formatCurrency(bill.total_amount - bill.payments[0].amount)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Receipt Footer */}
          <div className="pt-4 text-center text-2xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600">Thank you for shopping with us!</p>
            <p>Exchange allowed within 7 days with original bill and unused slippers.</p>
            <p className="font-mono text-2xs pt-1">*** END OF RECEIPT ***</p>
          </div>
        </div>

        {/* Modal Bottom Buttons (Hidden on print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            Start Next Sale (POS)
          </button>
        </div>
      </div>
    </div>
  );
}
