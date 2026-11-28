"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Purchase, Supplier, PurchaseStatus } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getSuppliersAction(): Promise<Supplier[]> {
  return mockStore.getSnapshot().suppliers;
}

export async function createSupplierAction(payload: { name: string; phone: string; address?: string }) {
  if (!payload.name || !payload.phone) {
    return { error: "Supplier name and phone are required." };
  }

  const newSupplier: Supplier = {
    id: `sup_${Date.now()}`,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    address: payload.address?.trim() || null,
    created_at: new Date().toISOString(),
  };

  mockStore.getSnapshot().suppliers.push(newSupplier);
  revalidatePath("/admin/purchases");
  revalidatePath("/admin/purchases/new");
  return { success: true, supplier: newSupplier };
}

export async function getPurchasesAction() {
  const snapshot = mockStore.getSnapshot();
  return (snapshot as any).purchases || [];
}

export interface PurchaseItemInput {
  variant_id: string;
  quantity: number;
  unit_cost: number;
}

export interface CreatePurchasePayload {
  supplier_id: string;
  invoice_number: string;
  purchase_date: string;
  status: PurchaseStatus;
  items: PurchaseItemInput[];
}

export async function createPurchaseEntryAction(payload: CreatePurchasePayload) {
  const user = await getCurrentUser();

  if (!payload.supplier_id || !payload.invoice_number) {
    return { error: "Supplier and invoice number are required." };
  }

  if (!payload.items || payload.items.length === 0) {
    return { error: "Please add at least one slipper product variant to the purchase invoice." };
  }

  const snapshot = mockStore.getSnapshot();
  const variants = snapshot.variants;
  const purchases = (snapshot as any).purchases || [];

  let totalAmount = 0;
  const purchaseItems = payload.items.map((item, idx) => {
    const subtotal = item.quantity * item.unit_cost;
    totalAmount += subtotal;

    // If confirmed, automatically increase stock!
    if (payload.status === "confirmed") {
      const v = variants.find((vr) => vr.id === item.variant_id);
      if (v) {
        v.stock_quantity += item.quantity;
        snapshot.stockMovements.unshift({
          id: `sm_${Date.now()}_${idx}`,
          variant_id: item.variant_id,
          movement_type: "purchase",
          quantity: item.quantity,
          reference_type: "purchase_invoice",
          reason: `Supplier Invoice #${payload.invoice_number}`,
          created_by: user?.full_name || "Admin",
          created_at: new Date().toISOString(),
        });
      }
    }

    return {
      id: `pi_${Date.now()}_${idx}`,
      purchase_id: `pur_${Date.now()}`,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      subtotal,
    };
  });

  const supplier = snapshot.suppliers.find((s) => s.id === payload.supplier_id);
  const newPurchase: Purchase = {
    id: `pur_${Date.now()}`,
    supplier_id: payload.supplier_id,
    invoice_number: payload.invoice_number.trim(),
    purchase_date: payload.purchase_date || new Date().toISOString().slice(0, 10),
    total_amount: totalAmount,
    status: payload.status,
    created_at: new Date().toISOString(),
    supplier,
    items: purchaseItems,
  };

  purchases.unshift(newPurchase);
  (snapshot as any).purchases = purchases;

  revalidatePath("/admin/purchases");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return { success: true, purchase: newPurchase };
}

export async function updatePurchaseAction(
  id: string,
  payload: {
    invoice_number: string;
    supplier_id: string;
    purchase_date: string;
    total_amount: number;
    status: PurchaseStatus;
  }
) {
  const snapshot = mockStore.getSnapshot();
  const purchases: Purchase[] = (snapshot as any).purchases || [];
  const idx = purchases.findIndex((p) => p.id === id);

  if (idx === -1) {
    return { error: "Purchase invoice not found." };
  }

  const supplier = snapshot.suppliers.find((s) => s.id === payload.supplier_id);
  purchases[idx] = {
    ...purchases[idx],
    invoice_number: payload.invoice_number.trim() || purchases[idx].invoice_number,
    supplier_id: payload.supplier_id || purchases[idx].supplier_id,
    supplier: supplier || purchases[idx].supplier,
    purchase_date: payload.purchase_date || purchases[idx].purchase_date,
    total_amount: Math.max(0, Number(payload.total_amount) || 0),
    status: payload.status || purchases[idx].status,
  };

  (snapshot as any).purchases = purchases;
  revalidatePath("/admin/purchases");
  revalidatePath("/admin");
  return { success: true, purchase: purchases[idx] };
}

export async function deletePurchaseAction(id: string) {
  const snapshot = mockStore.getSnapshot();
  const purchases: Purchase[] = (snapshot as any).purchases || [];
  const target = purchases.find((p) => p.id === id);

  if (!target) {
    return { error: "Purchase invoice not found." };
  }

  // Reverse stock quantities if this purchase had already been confirmed
  if (target.status === "confirmed" && target.items) {
    for (const item of target.items) {
      const v = snapshot.variants.find((vr) => vr.id === item.variant_id);
      if (v) {
        v.stock_quantity = Math.max(0, v.stock_quantity - item.quantity);
      }
    }
  }

  (snapshot as any).purchases = purchases.filter((p) => p.id !== id);

  revalidatePath("/admin/purchases");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin/pos");
  revalidatePath("/admin");

  return { success: true };
}
