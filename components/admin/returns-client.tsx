"use client";

import { useState } from "react";
import { Bill, Return } from "@/lib/types/database";
import { findBillForReturnAction, processReturnAction } from "@/lib/actions/returns";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PackageCheck,
  CheckSquare,
  Square,
  Receipt,
} from "lucide-react";

interface ReturnsClientProps {
  returns: (Return & { bill_number: string; customer_name?: string })[];
}

export function ReturnsClient({ returns }: ReturnsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundBill, setFoundBill] = useState<Bill | null>(null);

  // Return process form
  const [selectedItems, setSelectedItems] = useState<{
    [billItemId: string]: {
      selected: boolean;
      returnQty: number;
      restock: boolean;
    };
  }>({});
  const [returnReason, setReturnReason] = useState("Wrong size requested by customer");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSearchBill(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setError(null);
    setSuccess(null);
    setSearching(true);

    const bill = await findBillForReturnAction(searchQuery);
    if (!bill) {
      setError(`No completed bill found matching "${searchQuery}". Please check the bill number or customer phone.`);
      setFoundBill(null);
    } else {
      setFoundBill(bill);
      // Initialize selected items state
      const initialMap: typeof selectedItems = {};
      bill.items?.forEach((item) => {
        initialMap[item.id] = {
          selected: false,
          returnQty: 1,
          restock: true,
        };
      });
      setSelectedItems(initialMap);
    }
    setSearching(false);
  }

  function toggleItemSelection(billItemId: string) {
    setSelectedItems((prev) => ({
      ...prev,
      [billItemId]: {
        ...prev[billItemId],
        selected: !prev[billItemId]?.selected,
      },
    }));
  }

  function updateItemField(billItemId: string, field: "returnQty" | "restock", val: any) {
    setSelectedItems((prev) => ({
      ...prev,
      [billItemId]: {
        ...prev[billItemId],
        [field]: val,
      },
    }));
  }

  async function handleConfirmReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!foundBill) return;

    setError(null);
    setSuccess(null);

    const itemsToReturn = Object.entries(selectedItems)
      .filter(([_, state]) => state.selected)
      .map(([billItemId, state]) => {
        const billItem = foundBill.items?.find((bi) => bi.id === billItemId)!;
        return {
          bill_item_id: billItemId,
          variant_id: billItem.variant_id,
          quantity: state.returnQty,
          restock: state.restock,
          refund_amount: state.returnQty * billItem.unit_price,
        };
      });

    if (itemsToReturn.length === 0) {
      setError("Please check at least one item from the bill to return or exchange.");
      return;
    }

    setProcessing(true);
    const res = await processReturnAction({
      bill_id: foundBill.id,
      return_reason: returnReason,
      items: itemsToReturn,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess("Return processed successfully. Stock has been adjusted appropriately.");
      setFoundBill(null);
      setSelectedItems({});
    }
    setProcessing(false);
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            Returns & Exchanges
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process slipper returns against original bills and manage restock condition checks.
          </p>
        </div>
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

      {/* Bill Search Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-blue-600" /> Step 1: Find Original Bill
        </h2>
        <form onSubmit={handleSearchBill} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Enter Bill # (e.g., SLIP-20261125-0001) or Customer Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Lookup Bill"}
          </button>
        </form>
      </div>

      {/* Return Processing Box if bill found */}
      {foundBill && (
        <form onSubmit={handleConfirmReturn} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-900">
                Found Bill: {foundBill.bill_number}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                (Issued on {formatDate(foundBill.created_at)})
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900">
              Original Bill Total: {formatCurrency(foundBill.total_amount)}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-8">Select</th>
                  <th className="py-2.5 px-3">Item Snapshot</th>
                  <th className="py-2.5 px-3">Sold Qty</th>
                  <th className="py-2.5 px-3 w-28">Return Qty</th>
                  <th className="py-2.5 px-3">Restock?</th>
                  <th className="py-2.5 px-3 text-right">Refund / Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {foundBill.items?.map((item) => {
                  const state = selectedItems[item.id] || { selected: false, returnQty: 1, restock: true };
                  return (
                    <tr key={item.id} className={state.selected ? "bg-blue-50/40" : ""}>
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={state.selected}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{item.product_name_snapshot}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.colour_snapshot} • Size {item.size_snapshot} (₹{item.unit_price}/pair)
                        </p>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{item.quantity} pairs</td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          disabled={!state.selected}
                          value={state.returnQty}
                          onChange={(e) =>
                            updateItemField(item.id, "returnQty", parseInt(e.target.value) || 1)
                          }
                          className="w-16 px-2 py-1 border border-slate-200 rounded text-xs text-center font-bold disabled:bg-slate-100"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!state.selected}
                            checked={state.restock}
                            onChange={(e) => updateItemField(item.id, "restock", e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[11px]">
                            {state.restock ? "Sellable (Restock)" : "Damaged (Do Not Restock)"}
                          </span>
                        </label>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {state.selected ? formatCurrency(state.returnQty * item.unit_price) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Return Reason *
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Wrong size requested by customer">Wrong size / Fit issue</option>
                <option value="Customer changed mind on colour">Customer changed mind on colour</option>
                <option value="Defective strap or sole">Defective strap or sole (Damaged)</option>
                <option value="Exchange for another model">Exchange for another model</option>
                <option value="Other">Other Reason</option>
              </select>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                disabled={processing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50 flex items-center gap-2"
              >
                {processing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Return & Issue Refund
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Return History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Past Returns & Exchanges History ({returns.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Original Bill</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Refund Amount</th>
                <th className="py-3 px-4 font-semibold">Processed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No returns logged yet.
                  </td>
                </tr>
              ) : (
                returns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {r.bill_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{r.return_reason}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(r.refund_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{r.created_by}</td>
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
