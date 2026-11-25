import { getProductsAction } from "@/lib/actions/products";
import { getCategoriesAction } from "@/lib/actions/categories";
import { getCurrentUser } from "@/lib/actions/auth";
import { ProductsListClient } from "@/components/admin/products-list-client";

export const instant = false;

export default async function AdminProductsPage() {
  const [products, categories, user] = await Promise.all([
    getProductsAction(),
    getCategoriesAction(),
    getCurrentUser(),
  ]);

  return (
    <ProductsListClient
      products={products}
      categories={categories}
      isOwner={user?.role === "owner"}
    />
  );
}
