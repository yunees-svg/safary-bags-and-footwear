import { getCategoriesAction } from "@/lib/actions/categories";
import { getCurrentUser } from "@/lib/actions/auth";
import { ProductFormClient } from "@/components/admin/product-form-client";
import { QuickAddSlipperClient } from "@/components/admin/quick-add-slipper-client";

export const instant = false;

interface PageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function NewProductPage({ searchParams }: PageProps) {
  const [{ mode }, categories, user] = await Promise.all([
    searchParams,
    getCategoriesAction(),
    getCurrentUser(),
  ]);

  if (mode === "detailed") {
    return (
      <ProductFormClient
        categories={categories}
        isOwner={user?.role === "owner"}
      />
    );
  }

  return <QuickAddSlipperClient categories={categories.filter((c) => c.is_active)} />;
}
