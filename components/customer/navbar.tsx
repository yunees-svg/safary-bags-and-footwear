"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category, ShopSettings } from "@/lib/types/database";
import {
  Footprints,
  Search,
  Phone,
  Menu,
  X,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

interface CustomerNavbarProps {
  categories: Category[];
  settings: ShopSettings;
}

export function CustomerNavbar({ categories, settings }: CustomerNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
  }

  const cleanWhatsApp = settings.whatsapp_number.replace(/\D/g, "");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notification Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 text-center flex items-center justify-between">
        <div className="hidden sm:block">
          📍 {settings.address}
        </div>
        <div className="mx-auto sm:mx-0 font-medium text-slate-200">
          ✨ Premium Daily Slippers & Slides • Fast WhatsApp Order Confirmation
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>🕒 {settings.opening_hours.split("|")[0]}</span>
          <Link
            href="/login"
            className="text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-blue-400" /> Staff Portal
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-base tracking-tight block leading-tight">
              {settings.shop_name}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Footwear & Comfort
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search slippers by model, colour, size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </form>

        {/* Desktop Links & WhatsApp CTA */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-700">
          <Link
            href="/"
            className={pathname === "/" ? "text-blue-600 font-bold" : "hover:text-blue-600 transition"}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={pathname === "/products" ? "text-blue-600 font-bold" : "hover:text-blue-600 transition"}
          >
            All Slippers
          </Link>
          <Link
            href="/products?category=mens-slippers"
            className="hover:text-blue-600 transition"
          >
            Men
          </Link>
          <Link
            href="/products?category=womens-slippers"
            className="hover:text-blue-600 transition"
          >
            Women
          </Link>
          <Link
            href="/products?category=kids-slippers"
            className="hover:text-blue-600 transition"
          >
            Kids
          </Link>
          <Link
            href="/about"
            className={pathname === "/about" ? "text-blue-600 font-bold" : "hover:text-blue-600 transition"}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={pathname === "/contact" ? "text-blue-600 font-bold" : "hover:text-blue-600 transition"}
          >
            Contact
          </Link>
        </nav>

        {/* WhatsApp Direct Ordering Button */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent("Hello, I would like to enquire about slippers available at your store.")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-xs transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Order</span>
            <span className="sm:hidden">Chat</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search slippers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              🏠 Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              🩴 All Slippers
            </Link>
            <Link
              href="/products?category=mens-slippers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              👨 Men's Slippers
            </Link>
            <Link
              href="/products?category=womens-slippers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              👩 Women's Slippers
            </Link>
            <Link
              href="/products?category=kids-slippers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              🧒 Kids' Slippers
            </Link>
            <Link
              href="/products?category=ortho-comfort"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              🩺 Orthopedic Soles
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              ℹ️ About Store
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              📍 Location & Contact
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Staff or Owner?</span>
            <Link
              href="/login"
              className="font-bold text-blue-600 flex items-center gap-1"
            >
              Sign In to Dashboard →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
