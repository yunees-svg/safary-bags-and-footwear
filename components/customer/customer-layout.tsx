import { Suspense } from "react";
import { CustomerNavbar } from "@/components/customer/navbar";
import { CustomerFooter } from "@/components/customer/footer";
import { Category, ShopSettings } from "@/lib/types/database";

export function CustomerLayout({
  categories,
  settings,
  children,
}: {
  categories: Category[];
  settings: ShopSettings;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
        <CustomerNavbar categories={categories} settings={settings} />
      </Suspense>
      <div className="flex-1">{children}</div>
      <Suspense fallback={null}>
        <CustomerFooter settings={settings} />
      </Suspense>
    </div>
  );
}
