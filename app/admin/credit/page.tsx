import { Suspense } from "react";
import { getCustomersAction } from "@/lib/actions/customers";
import { CreditClient } from "@/components/admin/credit-client";

export const instant = false;

export default async function AdminCreditPage() {
  const customers = await getCustomersAction();
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading credit ledger...</div>}>
      <CreditClient customers={customers} />
    </Suspense>
  );
}
