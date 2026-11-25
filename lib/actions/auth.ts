"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Profile, UserRole } from "@/lib/types/database";
import { mockStore } from "@/lib/data/mock-store";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("demo_user")?.value;

  if (demoCookie) {
    try {
      const parsed = JSON.parse(demoCookie) as Profile;
      return parsed;
    } catch {
      // ignore
    }
  }

  // Attempt Supabase live user
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) return profile as Profile;

      return {
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || "Staff Member",
        role: (user.user_metadata?.role as UserRole) || "staff",
        is_active: true,
        created_at: user.created_at,
      };
    }
  } catch {
    // offline / fallback
  }

  return null;
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  // Check demo credentials first
  if (
    (email === "owner@safary.com" || email === "owner@solemate.com") &&
    password === "owner123"
  ) {
    return await loginAsDemo("owner");
  }
  if (
    (email === "staff@safary.com" || email === "staff@solemate.com") &&
    password === "staff123"
  ) {
    return await loginAsDemo("staff");
  }

  // Try Supabase auth
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication service unavailable";
    return { error: msg };
  }

  redirect("/admin");
}

export async function loginAsDemo(role: UserRole) {
  const cookieStore = await cookies();
  const profiles = mockStore.getProfiles();
  const user = profiles.find((p) => p.role === role) || {
    id: role === "owner" ? "usr_owner_01" : "usr_staff_01",
    full_name: role === "owner" ? "Shop Owner" : "Shop Staff",
    email: role === "owner" ? "owner@safary.com" : "staff@safary.com",
    role,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  cookieStore.set("demo_user", JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("demo_user");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  redirect("/login");
}
