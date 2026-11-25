import { mockStore } from "@/lib/data/mock-store";
import { CategoriesClient } from "@/components/admin/categories-client";

export const instant = false;

export default async function AdminCategoriesPage() {
  const categories = mockStore.getCategories();
  const products = mockStore.getProducts();

  const productCounts: Record<string, number> = {};
  products.forEach((p) => {
    productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
  });

  return (
    <CategoriesClient
      categories={categories}
      productCounts={productCounts}
    />
  );
}
