import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mockStore } from "@/lib/data/mock-store";
import { ProductDetailClient } from "@/components/customer/product-detail-client";

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = mockStore.getProductById(id);

  if (!product || !product.is_published) {
    notFound();
  }

  const settings = mockStore.getSettings();
  const categories = mockStore.getCategories().filter((c) => c.is_active);
  const relatedProducts = mockStore
    .getProducts()
    .filter((p) => p.is_published && p.id !== id && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading slipper details...</div>}>
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        settings={settings}
        categories={categories}
      />
    </Suspense>
  );
}
