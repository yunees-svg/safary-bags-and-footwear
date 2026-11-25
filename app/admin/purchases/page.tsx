import { getPurchasesAction, getSuppliersAction } from "@/lib/actions/purchases";
import { PurchasesClient } from "@/components/admin/purchases-client";

export const instant = false;

export default async function AdminPurchasesPage() {
  const [purchases, suppliers] = await Promise.all([
    getPurchasesAction(),
    getSuppliersAction(),
  ]);

  return <PurchasesClient purchases={purchases} suppliers={suppliers} />;
}
