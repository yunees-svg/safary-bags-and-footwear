"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Profile, UserRole } from "@/lib/types/database";
import { mockStore } from "@/lib/data/mock-store";
import { createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, isValidSessionToken } from "@/lib/session";

export async function getCurrentUser(): Promise<Profile | null> {
  const cookieStore = await cookies();
  if (await isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    const owner = mockStore.getProfiles().find((p) => p.role === "owner");
    if (owner) return { ...owner, email: process.env.ADMIN_EMAIL || owner.email };
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

  // Owner login configured in .env.local
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (
    adminEmail &&
    adminPassword &&
    email.trim().toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  ) {
    const token = await createSessionToken();
    if (!token) return { error: "Login is not set up. Add SESSION_SECRET to .env.local." };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
    });
    redirect("/admin");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    return { error: "Wrong email or password." };
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

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  redirect("/login");
}
