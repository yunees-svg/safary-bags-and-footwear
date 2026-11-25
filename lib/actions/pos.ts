"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Bill, PaymentMethod } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getPosDataAction() {
  const products = mockStore.getProducts().filter((p) => p.is_published);
  const categories = mockStore.getCategories().filter((c) => c.is_active);
  const customers = mockStore.getCustomers();
  const settings = mockStore.getSettings();

  return {
    products,
    categories,
    customers,
    settings,
  };
}

export interface PosBillItemInput {
  variant_id: string;
  quantity: number;
}

export interface CreatePosBillPayload {
  customer_id?: string | null;
  customer_name?: string;
  customer_phone?: string;
  items: PosBillItemInput[];
  discount: number;
  payment_method: PaymentMethod;
  paid_amount: number;
  reference_number?: string;
}

export async function createPosBillAction(payload: CreatePosBillPayload): Promise<{
  success?: boolean;
  bill?: Bill;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!payload.items || payload.items.length === 0) {
    return { error: "Cart is empty. Please select slippers to bill." };
  }

  // Handle quick customer creation if name & phone provided
  let customerId = payload.customer_id;
  if (!customerId && payload.customer_phone && payload.customer_name) {
    const existing = mockStore.getCustomers().find(
      (c) => c.phone.replace(/\D/g, "") === payload.customer_phone?.replace(/\D/g, "")
    );
    if (existing) {
      customerId = existing.id;
    } else {
      const newCust = mockStore.addCustomer({
        name: payload.customer_name.trim(),
        phone: payload.customer_phone.trim(),
      });
      customerId = newCust.id;
    }
  }

  // Validate stock sufficiency for every item
  const variants = mockStore.getSnapshot().variants;
  const products = mockStore.getSnapshot().products;

  const itemDetails: {
    variant_id: string;
    quantity: number;
    unit_price: number;
    unit_cost: number;
  }[] = [];

  for (const item of payload.items) {
    const variant = variants.find((v) => v.id === item.variant_id);
    if (!variant) {
      return { error: `Variant ID ${item.variant_id} was not found.` };
    }

    if (variant.stock_quantity < item.quantity) {
      const product = products.find((p) => p.id === variant.product_id);
      return {
        error: `Insufficient stock for ${product?.name || "Slipper"} (${variant.colour}, Size ${variant.size}). Requested: ${item.quantity}, In Stock: ${variant.stock_quantity}.`,
      };
    }

    const product = products.find((p) => p.id === variant.product_id);
    const unitPrice = product ? product.selling_price : 0;
    const unitCost = product ? product.cost_price : 0;

    itemDetails.push({
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      unit_cost: unitCost,
    });
  }

  try {
    const newBill = mockStore.createBill({
      customer_id: customerId,
      items: itemDetails,
      discount: payload.discount || 0,
      payment_method: payload.payment_method,
      paid_amount: payload.paid_amount,
      created_by: user?.full_name || "Cashier",
      reference_number: payload.reference_number,
    });

    revalidatePath("/admin/pos");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/admin/credit");
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, bill: newBill };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to record transaction.";
    return { error: msg };
  }
}
