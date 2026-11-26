"use client";

import { useState, useMemo } from "react";
import { Product, Category, ProductVariant, ShopSettings } from "@/lib/types/database";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { ProductCard } from "@/components/customer/product-card";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Package,
  Footprints,
} from "lucide-react";

interface CatalogClientProps {
  products: (Product & { variants: ProductVariant[]; category?: Category })[];
  categories: Category[];
  settings: ShopSettings;
  initialCategory?: string;
  initialSearch?: string;
}

export function CatalogClient({
  products,
  categories,
  settings,
  initialCategory,
  initialSearch,
}: CatalogClientProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategory || "all");
  const [selectedColour, setSelectedColour] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all distinct colours and sizes from products
  const allColours = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.colour)));
    return Array.from(set);
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.size)));
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.product_code.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase());

        // Category
        const matchesCategory =
          selectedCategorySlug === "all" || p.category?.slug === selectedCategorySlug;

        // Colour
        const matchesColour =
          selectedColour === "all" ||
          p.variants.some((v) => v.colour.toLowerCase() === selectedColour.toLowerCase());

        // Size
        const matchesSize =
          selectedSize === "all" ||
          p.variants.some((v) => v.size.toLowerCase() === selectedSize.toLowerCase());

        // In Stock
        const totalStock = p.variants.reduce((acc, v) => acc + v.stock_quantity, 0);
        const matchesStock = !inStockOnly || totalStock > 0;

        return matchesSearch && matchesCategory && matchesColour && matchesSize && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.selling_price - b.selling_price;
        if (sortBy === "price-desc") return b.selling_price - a.selling_price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    products,
    search,
    selectedCategorySlug,
    selectedColour,
    selectedSize,
    sortBy,
    inStockOnly,
  ]);

  function resetFilters() {
    setSearch("");
    setSelectedCategorySlug("all");
    setSelectedColour("all");
    setSelectedSize("all");
    setInStockOnly(false);
    setSortBy("newest");
  }

  return (
    <CustomerLayout categories={categories} settings={settings}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Title & Mobile Filter Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Slipper Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredProducts.length} of {products.length} footwear models
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Filter Catalog
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Layout: Filters Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside
            className={`w-full lg:w-64 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Filters
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-2xs font-semibold text-blue-600 hover:underline"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  aria-label="Close Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Code, name, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategorySlug("all")}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedCategorySlug === "all"
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategorySlug(c.slug)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategorySlug === c.slug
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Available Size</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedSize("all")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                    selectedSize === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>
                {allSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                      selectedSize === s
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Colour</label>
              <select
                value={selectedColour}
                onChange={(e) => setSelectedColour(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="all">All Colours</option>
                {allColours.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Mobile Done Button */}
            <div className="pt-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Apply & View {filteredProducts.length} Results
              </button>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                <Package className="w-12 h-12 mx-auto text-slate-300" />
                <h3 className="text-base font-semibold text-slate-800">No Slippers Match Your Filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for another slipper code or name.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
