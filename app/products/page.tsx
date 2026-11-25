import { Suspense } from "react";
import { mockStore } from "@/lib/data/mock-store";
import { CatalogClient } from "@/components/customer/catalog-client";

export const instant = false;

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const settings = mockStore.getSettings();
  const categories = mockStore.getCategories().filter((c) => c.is_active);
  const products = mockStore
    .getProducts()
    .filter((p) => p.is_published);

  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>}>
      <CatalogClient
        products={products}
        categories={categories}
        settings={settings}
        initialCategory={resolvedParams?.category}
        initialSearch={resolvedParams?.search}
      />
    </Suspense>
  );
}
