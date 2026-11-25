"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Profile, UserRole } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getStaffAction(): Promise<Profile[]> {
  return mockStore.getProfiles();
}

export async function addStaffAction(payload: {
  full_name: string;
  email: string;
  role: UserRole;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "owner") {
    return { error: "Access denied. Only the shop owner can manage staff accounts." };
  }

  if (!payload.full_name || !payload.email) {
    return { error: "Full name and email are required." };
  }

  const existing = mockStore.getProfiles().find((p) => p.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) {
    return { error: `A profile with email '${payload.email}' already exists.` };
  }

  const newStaff = mockStore.addStaff({
    full_name: payload.full_name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    is_active: true,
  });

  revalidatePath("/admin/staff");
  return { success: true, staff: newStaff };
}

export async function toggleStaffActiveAction(id: string, is_active: boolean) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "owner") {
    return { error: "Access denied. Only the shop owner can toggle staff access." };
  }

  const staff = mockStore.getProfiles().find((p) => p.id === id);
  if (!staff) {
    return { error: "Staff member not found." };
  }

  staff.is_active = is_active;
  revalidatePath("/admin/staff");
  return { success: true };
}
