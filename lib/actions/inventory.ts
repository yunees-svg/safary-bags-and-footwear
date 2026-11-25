"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { StockMovement, StockMovementType } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getInventoryVariantsAction() {
  const variants = mockStore.getVariantsWithProduct();
  const categories = mockStore.getCategories();

  return variants.map((v) => {
    const category = categories.find((c) => c.id === v.product.category_id);
    return {
      ...v,
      category,
      isLowStock: v.stock_quantity <= v.low_stock_threshold,
      isOutOfStock: v.stock_quantity === 0,
    };
  });
}

export async function adjustStockAction(payload: {
  variant_id: string;
  new_quantity: number;
  movement_type: StockMovementType;
  reason: string;
}) {
  const user = await getCurrentUser();

  if (payload.new_quantity < 0) {
    return { error: "Stock quantity cannot be negative." };
  }

  if (!payload.reason || payload.reason.trim().length === 0) {
    return { error: "A valid audit reason is required for any manual stock adjustment." };
  }

  const success = mockStore.adjustStock({
    variant_id: payload.variant_id,
    new_quantity: payload.new_quantity,
    movement_type: payload.movement_type,
    reason: payload.reason.trim(),
    created_by: user?.full_name || "Admin",
  });

  if (!success) {
    return { error: "Variant not found or adjustment failed." };
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/inventory/movements");
  revalidatePath("/admin/products");
  revalidatePath("/admin/pos");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function getStockMovementsAction(): Promise<
  (StockMovement & {
    productName: string;
    colour: string;
    size: string;
    sku: string;
  })[]
> {
  const movements = mockStore.getSnapshot().stockMovements;
  const variants = mockStore.getSnapshot().variants;
  const products = mockStore.getSnapshot().products;

  return movements.map((m) => {
    const variant = variants.find((v) => v.id === m.variant_id);
    const product = variant ? products.find((p) => p.id === variant.product_id) : null;

    return {
      ...m,
      productName: product ? product.name : "Unknown Slipper",
      colour: variant ? variant.colour : "-",
      size: variant ? variant.size : "-",
      sku: variant ? variant.sku : "-",
    };
  });
}
