import { Suspense } from "react";
import { getSettingsAction } from "@/lib/actions/settings";
import { getCurrentUser } from "@/lib/actions/auth";
import { SettingsClient } from "@/components/admin/settings-client";

export const instant = false;

export default async function AdminSettingsPage() {
  const [settings, user] = await Promise.all([
    getSettingsAction(),
    getCurrentUser(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading shop configuration...</div>}>
      <SettingsClient settings={settings} isOwner={user?.role === "owner"} />
    </Suspense>
  );
}
