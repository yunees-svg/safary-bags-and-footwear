"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, Category, ProductVariant } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";
import {
  toggleProductPublishAction,
  deleteOrArchiveProductAction,
} from "@/lib/actions/products";
import {
  Plus,
  Package,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Tag,
} from "lucide-react";

interface ProductWithRelations extends Product {
  category?: Category;
  variants: ProductVariant[];
}

interface ProductsListClientProps {
  products: ProductWithRelations[];
  categories: Category[];
  isOwner: boolean;
}

export function ProductsListClient({
  products,
  categories,
  isOwner,
}: ProductsListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && p.is_published) ||
      (statusFilter === "archived" && !p.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  async function handleTogglePublish(product: ProductWithRelations) {
    const res = await toggleProductPublishAction(product.id, !product.is_published);
    if (res.error) {
      setFeedback({ type: "error", message: res.error });
    } else {
      setFeedback({
        type: "success",
        message: `Product ${product.is_published ? "hidden from" : "published to"} customer website.`,
      });
    }
  }

  async function handleDeleteOrArchive(product: ProductWithRelations) {
    if (
      !confirm(
        `Are you sure you want to delete or archive product "${product.name}"? If it has past transactions, it will be safely archived to protect accounting history.`
      )
    ) {
      return;
    }

    const res = await deleteOrArchiveProductAction(product.id);
    if (!res.success) {
      setFeedback({ type: "error", message: res.message || "Action failed." });
    } else {
      setFeedback({ type: "success", message: res.message });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Product Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your footwear inventory, selling prices, colour & size matrices.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Slipper Model
        </Link>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`p-3 rounded-lg flex items-center gap-2 text-xs border ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, code, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="archived">Archived / Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Product & Code</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Colours & Sizes (Total Stock)</th>
                <th className="py-3 px-4 font-semibold">Selling Price</th>
                {isOwner && <th className="py-3 px-4 font-semibold">Cost Price</th>}
                <th className="py-3 px-4 font-semibold">Storefront</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isOwner ? 7 : 6}
                    className="py-12 text-center text-slate-400"
                  >
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No products matched your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const totalStock = product.variants.reduce(
                    (acc, v) => acc + v.stock_quantity,
                    0
                  );
                  const hasLowStock = product.variants.some(
                    (v) => v.stock_quantity <= v.low_stock_threshold
                  );

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition">
                      {/* Product Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0].image_url}
                              alt=""
                              className="w-10 h-10 shrink-0 rounded-md border border-slate-200 object-cover"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {product.name}
                            </div>
                            <div className="text-2xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <span className="font-mono text-slate-600 bg-slate-100 px-1 rounded">
                                {product.product_code}
                              </span>
                              <span>• {product.brand}</span>
                              {product.entry_date && (
                                <span>• {product.entry_date.split("-").reverse().join("/")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Variants & Stock */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1 items-center">
                          {product.variants.slice(0, 3).map((v) => (
                            <span
                              key={v.id}
                              className={`px-1.5 py-0.5 rounded text-2xs font-medium border ${
                                v.stock_quantity <= v.low_stock_threshold
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              {v.colour} S-{v.size} ({v.stock_quantity})
                            </span>
                          ))}
                          {product.variants.length > 3 && (
                            <span className="text-2xs text-slate-400">
                              +{product.variants.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`text-2xs font-semibold ${
                              totalStock === 0
                                ? "text-red-600"
                                : hasLowStock
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            Total: {totalStock} pairs
                          </span>
                        </div>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {formatCurrency(product.selling_price)}
                      </td>

                      {/* Cost Price (Owner Only) */}
                      {isOwner && (
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {formatCurrency(product.cost_price)}
                        </td>
                      )}

                      {/* Storefront visibility */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(product)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold transition ${
                            product.is_published
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {product.is_published ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              Archived
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Product & Variants"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteOrArchive(product)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete or Archive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
