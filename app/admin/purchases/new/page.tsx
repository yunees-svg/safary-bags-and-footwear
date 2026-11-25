import { Suspense } from "react";
import { getSuppliersAction } from "@/lib/actions/purchases";
import { getInventoryVariantsAction } from "@/lib/actions/inventory";
import { getCurrentUser } from "@/lib/actions/auth";
import { NewPurchaseClient } from "@/components/admin/new-purchase-client";

export const instant = false;

export default async function NewPurchasePage() {
  const [suppliers, variants] = await Promise.all([
    getSuppliersAction(),
    getInventoryVariantsAction(),
    getCurrentUser(),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading purchase form...</div>}>
      <NewPurchaseClient suppliers={suppliers} variants={variants} />
    </Suspense>
  );
}
