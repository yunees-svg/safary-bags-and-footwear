"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Bill, Return, ReturnItem } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function findBillForReturnAction(billNumberOrPhone: string): Promise<Bill | null> {
  const query = billNumberOrPhone.trim().toLowerCase();
  const bills = mockStore.getBills();

  const found = bills.find(
    (b) =>
      b.bill_number.toLowerCase() === query ||
      (b.customer?.phone && b.customer.phone.replace(/\D/g, "") === query.replace(/\D/g, ""))
  );

  return found || null;
}

export async function getReturnsAction(): Promise<
  (Return & {
    bill_number: string;
    customer_name?: string;
  })[]
> {
  const snapshot = mockStore.getSnapshot();
  const returns = (snapshot as any).returns || [];
  const bills = mockStore.getBills();

  return returns.map((r: Return) => {
    const bill = bills.find((b) => b.id === r.bill_id);
    return {
      ...r,
      bill_number: bill ? bill.bill_number : "Unknown",
      customer_name: bill?.customer?.name || "Walk-in Customer",
    };
  });
}

export interface ReturnItemInput {
  bill_item_id: string;
  variant_id: string;
  quantity: number;
  restock: boolean; // Only restock if in sellable condition
  refund_amount: number;
}

export interface ProcessReturnPayload {
  bill_id: string;
  return_reason: string;
  items: ReturnItemInput[];
}

export async function processReturnAction(payload: ProcessReturnPayload) {
  const user = await getCurrentUser();
  const bills = mockStore.getBills();
  const bill = bills.find((b) => b.id === payload.bill_id);

  if (!bill) {
    return { error: "Original bill not found." };
  }

  if (!payload.items || payload.items.length === 0) {
    return { error: "Please select at least one item to return." };
  }

  // Validate quantities against sold quantities
  for (const item of payload.items) {
    const billItem = bill.items?.find((bi) => bi.id === item.bill_item_id);
    if (!billItem) {
      return { error: "Bill item reference is invalid." };
    }
    if (item.quantity > billItem.quantity) {
      return {
        error: `Cannot return ${item.quantity} pairs; only ${billItem.quantity} pairs were purchased on this bill.`,
      };
    }
  }

  const snapshot = mockStore.getSnapshot();
  const variants = snapshot.variants;
  let totalRefund = 0;

  const returnItems: ReturnItem[] = payload.items.map((item, idx) => {
    totalRefund += item.refund_amount;

    // Only restock items that are actually returned in sellable condition
    if (item.restock) {
      const v = variants.find((vr) => vr.id === item.variant_id);
      if (v) {
        v.stock_quantity += item.quantity;
        snapshot.stockMovements.unshift({
          id: `sm_${Date.now()}_ret_${idx}`,
          variant_id: item.variant_id,
          movement_type: "return_restock",
          quantity: item.quantity,
          reference_type: "return",
          reason: `Customer return restocked: ${payload.return_reason}`,
          created_by: user?.full_name || "Admin",
          created_at: new Date().toISOString(),
        });
      }
    }

    return {
      id: `ri_${Date.now()}_${idx}`,
      return_id: `ret_${Date.now()}`,
      bill_item_id: item.bill_item_id,
      quantity: item.quantity,
      restock_quantity: item.restock ? item.quantity : 0,
      refund_amount: item.refund_amount,
    };
  });

  const returns = (snapshot as any).returns || [];
  const newReturn: Return = {
    id: `ret_${Date.now()}`,
    bill_id: payload.bill_id,
    return_reason: payload.return_reason.trim(),
    refund_amount: totalRefund,
    return_status: "completed",
    created_by: user?.full_name || "Admin",
    created_at: new Date().toISOString(),
    items: returnItems,
  };
  returns.unshift(newReturn);
  (snapshot as any).returns = returns;

  // Mark bill status as returned or adjusted
  bill.bill_status = "returned";

  revalidatePath("/admin/returns");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return { success: true, returnRecord: newReturn };
}
