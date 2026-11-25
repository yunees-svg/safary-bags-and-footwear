import { Suspense } from "react";
import { getCustomersAction } from "@/lib/actions/customers";
import { CustomersClient } from "@/components/admin/customers-client";

export const instant = false;

export default async function AdminCustomersPage() {
  const customers = await getCustomersAction();
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading customer directory...</div>}>
      <CustomersClient customers={customers} />
    </Suspense>
  );
}
