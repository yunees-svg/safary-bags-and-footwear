"use client";

import Link from "next/link";
import { ShopSettings } from "@/lib/types/database";
import { Footprints, Phone, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  settings: ShopSettings;
}

export function CustomerFooter({ settings }: FooterProps) {
  const cleanWhatsApp = settings.whatsapp_number.replace(/\D/g, "");

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">
                {settings.shop_name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your neighborhood destination for comfortable, durable, orthopedic, and stylish slippers for the entire family.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Footwear
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Slipper Collections
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=mens-slippers" className="hover:text-white transition">
                  Men's Classic & Slides
                </Link>
              </li>
              <li>
                <Link href="/products?category=womens-slippers" className="hover:text-white transition">
                  Women's Pillow Slides
                </Link>
              </li>
              <li>
                <Link href="/products?category=kids-slippers" className="hover:text-white transition">
                  Kids' Soft Anti-Slip
                </Link>
              </li>
              <li>
                <Link href="/products?category=ortho-comfort" className="hover:text-white transition">
                  Orthopedic & Acupressure
                </Link>
              </li>
              <li>
                <Link href="/products?category=casual-slides" className="hover:text-white transition">
                  Casual Pool Slides
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info & Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Store Information
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.opening_hours}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Order Box */}
          <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Orders
            </h3>
            <p className="text-xs text-slate-400">
              Browse any slipper model on our site and tap "Order on WhatsApp" to verify stock with our shopkeeper.
            </p>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Chat on WhatsApp ({settings.whatsapp_number})
            </a>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {settings.shop_name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-slate-300 transition">About Us</Link>
            <Link href="/contact" className="hover:text-slate-300 transition">Shop Location</Link>
            <Link href="/login" className="hover:text-slate-300 transition">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
