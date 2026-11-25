"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { ShopSettings } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getSettingsAction(): Promise<ShopSettings> {
  return mockStore.getSettings();
}

export async function updateSettingsAction(payload: Partial<ShopSettings>) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "owner") {
    return { error: "Access denied. Only the shop owner can change shop configuration." };
  }

  const updated = mockStore.updateSettings(payload);

  revalidatePath("/admin/settings");
  revalidatePath("/admin/pos");
  revalidatePath("/");

  return { success: true, settings: updated };
}
