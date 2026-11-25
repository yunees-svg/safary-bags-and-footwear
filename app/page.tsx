import Link from "next/link";
import { mockStore } from "@/lib/data/mock-store";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { ProductCard } from "@/components/customer/product-card";
import { formatCurrency } from "@/lib/utils";
import {
  Footprints,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
} from "lucide-react";

export const instant = false;

export default async function StorefrontHomePage() {
  const settings = mockStore.getSettings();
  const categories = mockStore.getCategories().filter((c) => c.is_active);
  const products = mockStore
    .getProducts()
    .filter((p) => p.is_published);

  const newArrivals = products.slice(0, 4);
  const popularSlippers = products.slice(0, 4);

  return (
    <CustomerLayout categories={categories} settings={settings}>
      <div className="space-y-16 pb-16">
        {/* Hero Section / Promotional Banner */}
        <section className="bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Premium Footwear Collection
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Step Into Everyday Comfort.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Discover ergonomic slippers, cloud-soft pillow slides, and doctor-recommended orthopedic footwear crafted for all-day relief.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  Browse Slipper Catalog <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=ortho-comfort"
                  className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-semibold border border-slate-700 transition"
                >
                  Orthopedic Comfort Series
                </Link>
              </div>
            </div>

            {/* Featured Highlight Card */}
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-600/30 text-blue-300 flex items-center justify-center">
                <Footprints className="w-12 h-12" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Instant WhatsApp Ordering</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Choose your colour and size, tap Order, and confirm availability directly with our retail shop counter.
                </p>
              </div>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Ready for Shop Pickup or Delivery
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Explore Collections
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition text-center space-y-2 group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Footprints className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {c.name}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Just Unboxed
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Popular / Best-Selling Slippers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Customer Favorites
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Popular Daily Slippers
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSlippers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Physical Shop Visit Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg text-center md:text-left">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Visit Our Retail Counter
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {settings.shop_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {settings.address}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" /> {settings.opening_hours}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" /> {settings.phone}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-xs font-bold shadow-xs transition"
              >
                View Directions & Map
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow-xs transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}
