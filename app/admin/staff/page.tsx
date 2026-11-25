import { Suspense } from "react";
import { getStaffAction } from "@/lib/actions/staff";
import { getCurrentUser } from "@/lib/actions/auth";
import { StaffClient } from "@/components/admin/staff-client";

export const instant = false;

export default async function AdminStaffPage() {
  const [staffList, user] = await Promise.all([
    getStaffAction(),
    getCurrentUser(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading staff directory...</div>}>
      <StaffClient staffList={staffList} isOwner={user?.role === "owner"} />
    </Suspense>
  );
}
