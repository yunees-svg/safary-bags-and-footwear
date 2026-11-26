import Link from "next/link";
import { mockStore } from "@/lib/data/mock-store";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { MapPin, Phone, Clock, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export const instant = false;

export default async function ContactPage() {
  const settings = mockStore.getSettings();
  const categories = mockStore.getCategories().filter((c) => c.is_active);
  const cleanWhatsApp = settings.whatsapp_number.replace(/\D/g, "");

  return (
    <CustomerLayout categories={categories} settings={settings}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-blue-600">
            Reach Out to Us
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Contact & Shop Location
          </h1>
          <p className="text-xs text-slate-500">
            Have a question about sizes, special orthopedic requests, or want to place an order? Contact our retail counter directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Store Information
            </h2>

            <div className="space-y-5 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Shop Address</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Telephone & Mobile</p>
                  <p className="text-slate-600 mt-0.5">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Counter Operating Hours</p>
                  <p className="text-slate-600 mt-0.5">{settings.opening_hours}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Ordering Button */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent("Hello! I am contacting you from your shop website.")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2"
              >
                <MessageSquareQuote className="w-4 h-4" />
                Message Store on WhatsApp
              </a>
              <p className="text-2xs text-slate-400 text-center">
                Fastest response for real-time stock and size verification.
              </p>
            </div>
          </div>

          {/* Location Map View / Representation */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Google Maps & Directions
            </h2>
            <div className="aspect-4/3 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <MapPin className="w-10 h-10 text-red-500 animate-bounce" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{settings.shop_name}</p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs">{settings.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.shop_name} ${settings.address}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                Open in Google Maps ↗
              </a>
            </div>
            <div className="text-2xs text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Easy parking available in the central retail arcade.
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Wheelchair and stroller accessible ground-floor showroom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
