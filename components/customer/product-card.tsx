import Link from "next/link";
import { Product, ProductVariant } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import { Footprints, ArrowRight, Check } from "lucide-react";

interface ProductCardProps {
  product: Product & { variants?: ProductVariant[] };
}

export function ProductCard({ product }: ProductCardProps) {
  const variants = product.variants || [];
  const colours = Array.from(new Set(variants.map((v) => v.colour)));
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const totalStock = variants.reduce((acc, v) => acc + v.stock_quantity, 0);
  const isOutOfStock = totalStock === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between group">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 overflow-hidden">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].image_url}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain bg-white"
          />
        ) : (
          <Footprints className="w-16 h-16 text-slate-300 group-hover:scale-110 transition duration-300" />
        )}
        <span className="absolute top-3 left-3 text-2xs font-mono font-semibold bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-slate-700 shadow-xs">
          {product.product_code}
        </span>
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 text-2xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Out of Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 text-2xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-2xs font-semibold text-blue-600 block">
            {product.brand}
          </span>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {product.description || "Ergonomic comfortable daily slippers with anti-slip grip."}
          </p>
        </div>

        {/* Colours & Sizes summary */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Colours:</span>
            <span className="font-medium text-slate-700">{colours.join(", ") || "Standard"}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Sizes:</span>
            <span className="font-medium text-slate-700">{sizes.join(", ") || "All"}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-slate-900 block leading-tight">
              {formatCurrency(product.selling_price)}
            </span>
            <span className="text-2xs text-slate-400">Fixed Retail Price</span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
