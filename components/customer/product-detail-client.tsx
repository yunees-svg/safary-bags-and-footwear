"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant, ShopSettings, Category } from "@/lib/types/database";
import { formatCurrency, generateOrderWhatsAppUrl } from "@/lib/utils";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { ProductCard } from "@/components/customer/product-card";
import {
  Footprints,
  Phone,
  ShieldCheck,
  Check,
  AlertTriangle,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product & { variants: ProductVariant[]; category?: Category };
  relatedProducts: (Product & { variants: ProductVariant[] })[];
  settings: ShopSettings;
  categories: Category[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
  settings,
  categories,
}: ProductDetailClientProps) {
  const variants = product.variants || [];

  // Distinct colours and sizes
  const availableColours = Array.from(new Set(variants.map((v) => v.colour)));
  const availableSizes = Array.from(new Set(variants.map((v) => v.size)));

  // Selected state
  const [selectedColour, setSelectedColour] = useState(availableColours[0] || "");
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");

  // Find exact matching variant
  const activeVariant = variants.find(
    (v) =>
      v.colour.toLowerCase() === selectedColour.toLowerCase() &&
      v.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const isInStock = activeVariant ? activeVariant.stock_quantity > 0 : false;
  const isLowStock = activeVariant ? activeVariant.stock_quantity <= activeVariant.low_stock_threshold && isInStock : false;

  // Format WhatsApp Link
  const whatsAppMessage = `Hello, I am interested in Model ${product.product_code}, ${selectedColour} colour, Size ${selectedSize}. Please confirm availability.`;
  const cleanPhone = settings.whatsapp_number.replace(/\D/g, "");
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <CustomerLayout categories={categories} settings={settings}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Slippers</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="font-semibold text-slate-900 truncate">{product.name}</span>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          {/* Left: Product Image Showcase */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center p-8 overflow-hidden">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0].image_url}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-contain bg-white"
                />
              ) : (
                <Footprints className="w-36 h-36 text-slate-300" />
              )}
              <span className="absolute top-4 left-4 text-xs font-mono font-bold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-slate-700 shadow-xs">
                {product.product_code}
              </span>
              <span className="absolute bottom-4 right-4 text-xs font-semibold bg-blue-600/10 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                {selectedColour}
              </span>
            </div>

            {/* Colour Variant Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availableColours.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColour(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedColour === c
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & WhatsApp Ordering */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-black text-slate-900">
                  {formatCurrency(product.selling_price)}
                </span>
                <span className="text-xs text-slate-400">Inclusive of all local shop taxes</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {product.description ||
                "Engineered for daily resilience and therapeutic foot support. Features deep textured anti-slip sole and water-resistant cushioned strap."}
            </p>

            {/* Select Colour */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Select Colour: <span className="text-blue-600 font-semibold">{selectedColour}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColours.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColour(col)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selectedColour === col
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Size */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Select Footwear Size: <span className="text-blue-600 font-semibold">Size {selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const checkVariant = variants.find(
                    (v) =>
                      v.colour.toLowerCase() === selectedColour.toLowerCase() &&
                      v.size.toLowerCase() === sz.toLowerCase()
                  );
                  const isSzInStock = checkVariant ? checkVariant.stock_quantity > 0 : false;

                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-12 h-10 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center ${
                        selectedSize === sz
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : isSzInStock
                          ? "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                          : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Stock Availability Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-700 block">
                  Status for {selectedColour} (Size {selectedSize}):
                </span>
                <span className="text-[11px] text-slate-500">
                  SKU: {activeVariant?.sku || "Pending Selection"}
                </span>
              </div>
              <div>
                {isInStock ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <Check className="w-3.5 h-3.5" /> In Stock ({activeVariant?.stock_quantity} left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> Depleted / Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* WhatsApp Ordering Button (Direct Link) */}
            <div className="space-y-2 pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-4 h-4" />
                Order via WhatsApp ({selectedColour}, Size {selectedSize})
              </a>
              <p className="text-[11px] text-slate-400 text-center">
                Tapping opens WhatsApp with your prefilled model & size details. Our counter staff confirms availability before reserving.
              </p>
            </div>

            {/* Shop Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>7-Day In-Store Size Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Guaranteed Sole Grip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Customers Also Liked
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}
