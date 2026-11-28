"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Product, ProductVariant } from "@/lib/types/database";
import {
  createProductWithVariantsAction,
  updateProductAction,
} from "@/lib/actions/products";
import { PhotoPicker } from "@/components/admin/photo-picker";
import {
  ArrowLeft,
  Package,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface VariantRow {
  id?: string;
  colour: string;
  size: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
}

interface ProductFormClientProps {
  categories: Category[];
  isOwner: boolean;
  initialProduct?: Product & { category?: Category; variants: ProductVariant[] };
}

export function ProductFormClient({
  categories,
  isOwner,
  initialProduct,
}: ProductFormClientProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [category_id, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || "");
  const [product_code, setProductCode] = useState(initialProduct?.product_code || "");
  const [name, setName] = useState(initialProduct?.name || "");
  const [brand, setBrand] = useState(initialProduct?.brand || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [selling_price, setSellingPrice] = useState(initialProduct?.selling_price?.toString() || "");
  const [cost_price, setCostPrice] = useState(initialProduct?.cost_price?.toString() || "");
  const [is_published, setIsPublished] = useState(initialProduct ? initialProduct.is_published : true);

  // Only set when a new photo is picked, so saving keeps the current one otherwise
  const [newPhoto, setNewPhoto] = useState("");
  const [processingPhoto, setProcessingPhoto] = useState(false);

  // Variant generator state
  const [colourInput, setColourInput] = useState("Black, Navy Blue");
  const [sizeInput, setSizeInput] = useState("7, 8, 9, 10");

  const [variants, setVariants] = useState<VariantRow[]>(
    initialProduct?.variants?.map((v) => ({
      id: v.id,
      colour: v.colour,
      size: v.size,
      sku: v.sku,
      stock_quantity: v.stock_quantity,
      low_stock_threshold: v.low_stock_threshold,
    })) || []
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick Matrix Generator: Cartesion product of colours x sizes
  function handleGenerateMatrix() {
    if (!product_code.trim()) {
      setError("Please specify a Product Code before generating variants.");
      return;
    }

    const colours = colourInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const sizes = sizeInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (colours.length === 0 || sizes.length === 0) {
      setError("Please provide at least one colour and size for the matrix generator.");
      return;
    }

    setError(null);
    const newVariants: VariantRow[] = [];

    colours.forEach((c) => {
      sizes.forEach((s) => {
        // Prevent duplicate combinations
        const existing = variants.find(
          (v) => v.colour.toLowerCase() === c.toLowerCase() && v.size.toLowerCase() === s.toLowerCase()
        );
        if (!existing) {
          const colorCode = c.slice(0, 3).toUpperCase();
          newVariants.push({
            colour: c,
            size: s,
            sku: `${product_code.trim().toUpperCase()}-${colorCode}-${s}`,
            stock_quantity: 10,
            low_stock_threshold: 4,
          });
        }
      });
    });

    setVariants([...variants, ...newVariants]);
  }

  function handleAddSingleVariant() {
    setVariants([
      ...variants,
      {
        colour: "Black",
        size: "8",
        sku: product_code ? `${product_code.trim().toUpperCase()}-BLK-8` : "",
        stock_quantity: 5,
        low_stock_threshold: 3,
      },
    ]);
  }

  function handleRemoveVariant(index: number) {
    setVariants(variants.filter((_, idx) => idx !== index));
  }

  function handleUpdateVariantField(index: number, field: keyof VariantRow, value: any) {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (variants.length === 0) {
      setError("Every slipper product must have at least one colour & size variant.");
      setLoading(false);
      return;
    }

    if (isEditing && initialProduct) {
      const res = await updateProductAction(initialProduct.id, {
        category_id,
        name,
        brand,
        description,
        selling_price: parseFloat(selling_price) || 0,
        cost_price: parseFloat(cost_price) || 0,
        is_published,
        variants,
        photo: newPhoto || undefined,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin/products");
      }
    } else {
      const res = await createProductWithVariantsAction({
        category_id,
        product_code,
        name,
        brand,
        description,
        selling_price: parseFloat(selling_price) || 0,
        cost_price: parseFloat(cost_price) || 0,
        is_published,
        variants,
        photo: newPhoto || undefined,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin/products");
      }
    }
  }

  const totalStockUnits = variants.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Catalog
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || processingPhoto}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEditing ? "Update Product" : "Save Slipper & Variants"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Basic Product Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Package className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900">
            {isEditing ? "Edit Product Details" : "Product & Model Specifications"}
          </h2>
        </div>

        <div className="max-w-xs">
          <span className="block text-xs font-semibold text-slate-700 mb-1">Slipper Photo</span>
          <PhotoPicker
            photo={newPhoto || initialProduct?.images?.[0]?.image_url || ""}
            onChange={setNewPhoto}
            onError={setError}
            onBusyChange={setProcessingPhoto}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Code *
            </label>
            <input
              type="text"
              required
              disabled={isEditing}
              placeholder="e.g., MS-CL-101"
              value={product_code}
              onChange={(e) => setProductCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
            />
            <span className="text-2xs text-slate-400">Unique identifier for SKU generation</span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slipper Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Apex Men Classic Grip Slide"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              placeholder="e.g., Apex Soles, SoftWalk"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Storefront Visibility
            </label>
            <select
              value={is_published ? "true" : "false"}
              onChange={(e) => setIsPublished(e.target.value === "true")}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="true">Published (Visible to customers)</option>
              <option value="false">Archived / Hidden</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g., 399.00"
              value={selling_price}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {isOwner && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cost Price (₹) [Owner Only]
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 220.00"
                value={cost_price}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Customer Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Ergonomic slip-on with water-resistant strap and memory foam sole..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Dynamic Colour & Size Variant Matrix */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Colour & Size Matrix
              </h2>
              <p className="text-2xs text-slate-500">
                Footwear inventory is tracked strictly per colour and size variation.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            {variants.length} Variants • {totalStockUnits} Pairs Total
          </div>
        </div>

        {/* Quick Matrix Generator Box */}
        {!isEditing && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Quick Multi-Variant Matrix Generator
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-2xs font-medium text-blue-800 mb-1">
                  Colours (comma separated)
                </label>
                <input
                  type="text"
                  value={colourInput}
                  onChange={(e) => setColourInput(e.target.value)}
                  placeholder="e.g., Black, Navy Blue, Tan"
                  className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-2xs font-medium text-blue-800 mb-1">
                  Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g., 6, 7, 8, 9, 10"
                  className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerateMatrix}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Generate Combinations
              </button>
            </div>
          </div>
        )}

        {/* Variant Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-2xs border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Colour</th>
                <th className="py-2.5 px-3 font-semibold">Size</th>
                <th className="py-2.5 px-3 font-semibold">SKU</th>
                <th className="py-2.5 px-3 font-semibold w-24">Initial Stock</th>
                <th className="py-2.5 px-3 font-semibold w-24">Low Alert</th>
                <th className="py-2.5 px-3 font-semibold text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No variants generated yet. Use the quick generator above or click "+ Add Single Variant".
                  </td>
                </tr>
              ) : (
                variants.map((variant, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        required
                        value={variant.colour}
                        onChange={(e) => handleUpdateVariantField(idx, "colour", e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        required
                        value={variant.size}
                        onChange={(e) => handleUpdateVariantField(idx, "size", e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900"
                      />
                    </td>
                    <td className="py-2 px-3 font-mono">
                      <input
                        type="text"
                        required
                        value={variant.sku}
                        onChange={(e) => handleUpdateVariantField(idx, "sku", e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900 font-mono"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        required
                        value={variant.stock_quantity}
                        onChange={(e) => handleUpdateVariantField(idx, "stock_quantity", parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900 font-semibold"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        required
                        value={variant.low_stock_threshold}
                        onChange={(e) => handleUpdateVariantField(idx, "low_stock_threshold", parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-900"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAddSingleVariant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Single Variant Row
          </button>
        </div>
      </div>
    </form>
  );
}
