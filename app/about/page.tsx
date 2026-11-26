import Link from "next/link";
import { mockStore } from "@/lib/data/mock-store";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { Footprints, ShieldCheck, Heart, Award, Clock } from "lucide-react";

export const instant = false;

export default async function AboutPage() {
  const settings = mockStore.getSettings();
  const categories = mockStore.getCategories().filter((c) => c.is_active);

  return (
    <CustomerLayout categories={categories} settings={settings}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Story Banner */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Footprints className="w-10 h-10" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-blue-600">
              Our Heritage & Philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              About {settings.shop_name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              Founded as a dedicated footwear retail outlet in the heart of the central market, {settings.shop_name} specializes in high-quality, durable, and orthopedic slippers. We believe that proper foot alignment, lightweight cushioning, and non-slip security shouldn't be luxury privileges—they should be affordable daily comforts for every member of your family.
            </p>
          </div>
        </section>

        {/* Pillars of Comfort */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Doctor Recommended Soles</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our orthopedic range features contouring arch supports, heel cup stabilization, and acupressure foam designed to ease plantar fasciitis and joint fatigue.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Tested Anti-Slip Tread</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every slide and flip-flop in our shop passes strict wet-surface grip inspection so toddlers, adults, and seniors can walk confidently anywhere.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Local Retail Care</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We know our customers by name. We welcome you to try on pairs in-store, or verify sizes directly via WhatsApp before picking them up.
            </p>
          </div>
        </section>

        {/* Physical Location Callout */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Experience the Comfort In Person</h3>
            <p className="text-xs text-slate-300">
              Visit our retail outlet: {settings.address}
            </p>
            <p className="text-xs text-slate-400">
              Open {settings.opening_hours}
            </p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-semibold shadow-xs transition"
          >
            Explore Catalog
          </Link>
        </section>
      </div>
    </CustomerLayout>
  );
}
