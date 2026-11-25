import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/lib/actions/products";
import { getCategoriesAction } from "@/lib/actions/categories";
import { getCurrentUser } from "@/lib/actions/auth";
import { ProductFormClient } from "@/components/admin/product-form-client";

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories, user] = await Promise.all([
    getProductByIdAction(id),
    getCategoriesAction(),
    getCurrentUser(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductFormClient
      initialProduct={product}
      categories={categories}
      isOwner={user?.role === "owner"}
    />
  );
}
