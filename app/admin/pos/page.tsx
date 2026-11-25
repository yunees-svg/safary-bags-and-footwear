import { getPosDataAction } from "@/lib/actions/pos";
import { PosClient } from "@/components/admin/pos-client";

export const instant = false;

export default async function AdminPosPage() {
  const data = await getPosDataAction();

  return (
    <PosClient
      products={data.products}
      categories={data.categories}
      customers={data.customers}
      settings={data.settings}
    />
  );
}
