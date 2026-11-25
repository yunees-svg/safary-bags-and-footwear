import { getInventoryVariantsAction } from "@/lib/actions/inventory";
import { getCategoriesAction } from "@/lib/actions/categories";
import { InventoryClient } from "@/components/admin/inventory-client";

export const instant = false;

export default async function AdminInventoryPage() {
  const [items, categories] = await Promise.all([
    getInventoryVariantsAction(),
    getCategoriesAction(),
  ]);

  return <InventoryClient items={items} categories={categories} />;
}
