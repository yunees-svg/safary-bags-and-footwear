import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  Sparkles,
  Boxes,
  WalletCards,
  BarChart3,
  Smartphone,
  Bot,
  ShieldCheck,
  ArrowRight,
  QrCode,
  Activity,
  RotateCcw,
} from "lucide-react";

const guideSections = [
  {
    id: "dashboard",
    title: "1. Overview & Live Store Heartbeat",
    badge: "Daily Control",
    icon: Activity,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    href: "/admin",
    cta: "Open Overview",
    steps: [
      "Check Today's Sales, Total Revenue, and Est. Gross Profit (Owner only) at a glance.",
      "Watch the Live Store Heartbeat feed for real-time counter bills, critical low-stock warnings, and pending Khata alerts.",
      "Click 'View Receipt' directly in the feed to inspect or reprint any recent bill.",
    ],
  },
  {
    id: "pos",
    title: "2. Billing / POS & Dynamic GPay QR",
    badge: "Counter Sales",
    icon: CreditCard,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    href: "/admin/pos",
    cta: "Open Billing POS",
    steps: [
      "Search slippers or bags by name, model code, or category and tap to select the colour & size.",
      "Select Walk-in Customer or pick an existing customer (required if selling on Credit / Khata).",
      "Choose Payment Method: Cash (includes change calculator), UPI (auto-generates a Dynamic GPay/PhonePe QR code with exact bill amount), Card, or Credit.",
      "Tap 'Confirm & Print Bill' to reduce stock automatically and open the 80mm thermal receipt.",
    ],
  },
  {
    id: "ai-invoice",
    title: "3. AI Invoice Agent (Wholesale Bill Scanner)",
    badge: "AI Smart Scan",
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    href: "/admin/purchases/new",
    cta: "Open AI Invoice Agent",
    steps: [
      "When new wholesale cartons arrive, open 'AI Invoice Agent' from the sidebar.",
      "Click 'Upload Invoice Bill' to upload a photo or PDF of your supplier invoice (or click a Quick Test Template).",
      "The AI reads supplier name, bill number, items, quantities, and wholesale cost and auto-fills the form.",
      "Smart Margin Guard alerts you if a supplier increased cost prices and offers to auto-adjust your retail selling price when you click 'Save & Confirm Stock-In'.",
    ],
  },
  {
    id: "assistant",
    title: "4. Safary AI Assistant (Ctrl + K)",
    badge: "Side Copilot",
    icon: Bot,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    href: "/admin",
    cta: "Try Ctrl + K",
    steps: [
      "Click '✨ Assistant' in the top header (or press Ctrl + K on keyboard) to open the docked right AI panel.",
      "Ask natural questions like: 'How much sales today?', 'Show low stock alerts', 'Who owes Khata credit?', or 'Check size 8 stock'.",
      "Use the quick action cards inside the assistant to jump straight to Billing POS, Inventory, or Credit Management.",
    ],
  },
  {
    id: "inventory",
    title: "5. Products, Variants & Inventory",
    badge: "Stock Matrix",
    icon: Boxes,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    href: "/admin/inventory",
    cta: "Manage Inventory",
    steps: [
      "Under Products, add new slipper or bag models with multiple Colour × Size combinations and individual SKUs.",
      "Under Inventory, adjust stock counts for damaged pairs, physical audit counts, or manual additions (every change is logged in Stock Movements).",
      "Set low-stock thresholds in Settings so the dashboard warns you before a popular size runs out.",
    ],
  },
  {
    id: "khata",
    title: "6. Credit Management (Khata) & WhatsApp Dues",
    badge: "Collections",
    icon: WalletCards,
    color: "text-red-600 bg-red-50 border-red-200",
    href: "/admin/credit",
    cta: "Open Credit Ledger",
    steps: [
      "Any POS bill paid via 'Credit' automatically adds to that customer's Khata balance.",
      "On the Credit Management page, tap 'WhatsApp Due' next to any customer to send a polite, pre-filled payment reminder on WhatsApp.",
      "Tap 'Record Payment' when the customer settles full or partial dues via Cash or GPay.",
    ],
  },
  {
    id: "returns",
    title: "7. Returns, Exchanges & Reports",
    badge: "Audit & Profit",
    icon: RotateCcw,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    href: "/admin/returns",
    cta: "Open Returns",
    steps: [
      "In Returns & Exchanges, look up any past bill number, select returned pairs, and choose whether the condition is resellable (restocks automatically) or damaged.",
      "In Reports (Owner only), view Gross Margin, Operating Net Profit after expenses, and export CSV files.",
    ],
  },
  {
    id: "mobile-pwa",
    title: "8. Install as Mobile App & Dark Theme",
    badge: "Mobile & UI",
    icon: Smartphone,
    color: "text-slate-700 bg-slate-100 border-slate-200",
    href: "/admin/settings",
    cta: "Shop Settings",
    steps: [
      "Android (Chrome): Open the live link, tap the 3-dot menu (⋮), and select 'Install app' to add Safary Hub to your home screen.",
      "iPhone (Safari): Tap the Share icon (↑) and select 'Add to Home Screen'.",
      "Theme & UPI Setup: Tap the Moon/Sun icon in the top header to toggle Dark Mode, and update your store's GPay/UPI ID under Settings.",
    ],
  },
];

export default function UserGuidePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            Safary Bags & Footwear — User Guide
          </h1>
          <p className="text-xs text-slate-500">
            Step-by-step instructions for Owner and Counter Staff to operate POS billing, AI invoice scanning, inventory, and Khata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <CreditCard className="w-4 h-4" /> Go to POS
          </Link>
        </div>
      </div>

      {/* Role Permissions Quick Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Owner Role Access</h2>
            <p className="text-2xs text-slate-500 mt-0.5 leading-relaxed">
              Full access to wholesale cost prices, profit margins, Financial Reports, Staff Management, Shop Settings (UPI ID), and all counter operations.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Counter Staff Role Access</h2>
            <p className="text-2xs text-slate-500 mt-0.5 leading-relaxed">
              Focused on fast POS billing, Dynamic GPay QR checkout, stock lookups, returns, and Khata collections — wholesale cost prices and profit reports remain hidden.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guideSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${sec.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {sec.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-600 shrink-0">
                    {sec.badge}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600">
                  {sec.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Link
                  href={sec.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {sec.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
