"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Category } from "@/lib/types/database";
import { quickAddSlipperAction } from "@/lib/actions/products";
import { PhotoPicker } from "@/components/admin/photo-picker";

const inputClass =
  "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500";
const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

export function QuickAddSlipperClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [sizes, setSizes] = useState("");
  const [price, setPrice] = useState("");
  // en-CA formats the local date as YYYY-MM-DD, which date inputs expect
  const [entryDate, setEntryDate] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [brand, setBrand] = useState("");
  const [colours, setColours] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photo) {
      setError("Please upload a photo of the slipper.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const res = await quickAddSlipperAction({
        photo,
        name,
        sizes,
        price: Number(price),
        entry_date: entryDate,
        brand,
        colours,
        stock_per_size: Number(stock || 0),
        category_id: categoryId,
      });
      if (res.error) {
        setError(res.error);
        setSaving(false);
      } else {
        router.push("/admin/products");
      }
    } catch {
      setError("Could not save the slipper. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product Catalog
        </Link>
        <Link
          href="/admin/products/new?mode=detailed"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Use detailed form
        </Link>
      </div>

      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h1 className="text-lg font-bold text-slate-900">Add Slipper Model</h1>

        <div>
          <span className={labelClass}>Photo *</span>
          <PhotoPicker photo={photo} onChange={setPhoto} onError={setError} onBusyChange={setProcessing} />
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>Slipper Name *</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="price" className={labelClass}>Rate (₹) *</label>
          <input id="price" type="number" min="0.01" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>Date *</label>
          <input id="date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="brand" className={labelClass}>Brand *</label>
          <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label htmlFor="colours" className={labelClass}>Colour *</label>
          <input id="colours" placeholder="e.g., Black, Brown" value={colours} onChange={(e) => setColours(e.target.value)} required className={inputClass} />
          <span className="text-[11px] text-slate-400">Separate colours with commas.</span>
        </div>

        <div>
          <label htmlFor="sizes" className={labelClass}>Available Sizes *</label>
          <input id="sizes" required placeholder="e.g., 6, 7, 8, 9" value={sizes} onChange={(e) => setSizes(e.target.value)} className={inputClass} />
          <span className="text-[11px] text-slate-400">Separate sizes with commas.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stock" className={labelClass}>Pairs in stock per colour &amp; size</label>
            <input id="stock" type="number" min="0" step="1" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
            <span className="text-[11px] text-slate-400">At 0 it shows as Out of Stock.</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || processing}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Slipper
        </button>
      </div>
    </form>
  );
}
