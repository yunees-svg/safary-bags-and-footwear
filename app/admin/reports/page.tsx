import { Suspense } from "react";
import { getReportsDataAction } from "@/lib/actions/reports";
import { ReportsClient } from "@/components/admin/reports-client";

export const instant = false;

export default async function AdminReportsPage() {
  const data = await getReportsDataAction();
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading financial reports...</div>}>
      <ReportsClient data={data} />
    </Suspense>
  );
}
