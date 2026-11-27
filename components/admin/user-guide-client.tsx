"use client";

import { useState } from "react";
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
  Activity,
  RotateCcw,
  Package,
  Layers,
  Truck,
  MessageSquareQuote,
  Users,
  ReceiptText,
  UserCog,
  Settings,
  LogIn,
  Search,
  History,
  Info,
} from "lucide-react";

type GuideGroup = "all" | "sales" | "inventory" | "customers" | "finance";

interface GuideEntry {
  id: string;
  group: Exclude<GuideGroup, "all">;
  title: string;
  route: string;
  role: "All Staff" | "Owner Only";
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  steps: string[];
  tip: string;
  cta: string;
}

const GUIDE_ENTRIES: GuideEntry[] = [
  {
    id: "login",
    group: "finance",
    title: "1. Login & Role Access",
    route: "/login",
    role: "All Staff",
    summary: "Sign in securely to access the Safary Bags & Footwear management console.",
    icon: LogIn,
    color: "text-slate-700 bg-slate-100 border-slate-200",
    steps: [
      "Open the app or website and you will be routed to the Login screen if not already signed in.",
      "Enter your assigned Email and Password, then tap 'Sign In to Dashboard'.",
      "Owner accounts unlock full financial data (cost prices, profit reports, staff, settings). Counter Staff accounts see billing, stock, customers, and returns while wholesale cost prices stay hidden.",
    ],
    tip: "Your session stays active for 7 days unless you click Sign Out from the top-right profile menu.",
    cta: "Go to Overview",
  },
  {
    id: "overview",
    group: "sales",
    title: "2. Overview & Live Store Heartbeat",
    route: "/admin",
    role: "All Staff",
    summary: "Your daily shop command center showing real-time sales, profit, alerts, and live activity feed.",
    icon: Activity,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    steps: [
      "Top KPI Cards: View Today's Sales (amount + bill count), Total Revenue, Est. Gross Profit (Owner only), and Critical Low Stock Warnings.",
      "Live Store Heartbeat: Watch real-time events in chronological order — new POS counter bills, low-stock alerts, pending Khata overdrafts, and wholesale stock-ins.",
      "Quick Actions inside Feed: Click 'View Receipt' on any sale to reprint/inspect the bill, 'Restock Now' on low-stock alerts, or 'Send Due Reminder' to message a Khata customer on WhatsApp.",
      "Recent Transactions & Top Sellers: Check the last 6 bills and the top 5 fastest-selling slipper/bag variants.",
    ],
    tip: "Use the '+ New Bill (POS)' button in the top banner to jump straight into customer billing.",
    cta: "Open Overview",
  },
  {
    id: "pos",
    group: "sales",
    title: "3. Billing / POS & Dynamic GPay QR",
    route: "/admin/pos",
    role: "All Staff",
    summary: "Fast counter checkout terminal with variant selection, split/credit payments, Dynamic UPI QR, and 80mm receipt printing.",
    icon: CreditCard,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    steps: [
      "Find Products: Search by slipper/bag name, model code, or brand, or filter using the category pills at the top.",
      "Select Colour & Size: Tap a product card. If it has multiple variants, choose the exact Colour & Size in the popup to add it to the bill.",
      "Select Customer: Leave as 'Walk-in Customer' for normal cash/UPI sales, choose an existing customer, or tap '+ Add New Customer' right inside POS.",
      "Adjust Quantities & Discount: Use + / - buttons on cart items and enter any discount (₹) if applicable.",
      "Choose Payment Method: Select Cash (includes automatic Change Due calculator), UPI (automatically generates a live Dynamic GPay/PhonePe QR code with the exact bill amount locked in), Card, or Credit (adds to customer Khata).",
      "Complete Sale: Click 'Confirm & Print Bill'. Stock reduces automatically and the 80mm thermal receipt opens ready to print.",
    ],
    tip: "On mobile phones, use the top 'Products' and 'Cart & Bill' tabs to switch comfortably between picking items and checking out.",
    cta: "Open Billing / POS",
  },
  {
    id: "products",
    group: "inventory",
    title: "4. Products & Colour × Size Matrix",
    route: "/admin/products",
    role: "All Staff",
    summary: "Manage your full catalog of slippers, slides, sandals, and bags with colour and size combinations.",
    icon: Package,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    steps: [
      "Browse Catalog: Search by name, model code (e.g. SL-M01, SF-BG-501), or filter by category and status.",
      "Add New Product: Click '+ Add New Product', enter Model Code, Name, Brand, Category, Selling Price, and Cost Price (Owner only).",
      "Build Variants: Add Colour × Size combinations (e.g. Black Size 7, Black Size 8, Navy Free Size) with individual SKUs and opening stock.",
      "Edit or Archive: Click Edit on any product to update prices or add new sizes. Products with past sales are safely archived instead of deleted to protect accounting history.",
    ],
    tip: "Staff members can view selling prices and stock counts, while wholesale cost prices remain protected for Owners.",
    cta: "Open Products",
  },
  {
    id: "categories",
    group: "inventory",
    title: "5. Categories Management",
    route: "/admin/categories",
    role: "All Staff",
    summary: "Organize footwear and bags into clean shop sections (Men, Women, Kids, Orthopedic, Travel Bags).",
    icon: Layers,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    steps: [
      "Click '+ New Category' to create a new product group with name, URL slug, and description.",
      "Use Edit to rename categories or toggle Active/Hidden status.",
      "Categories that currently contain products are protected from accidental deletion.",
    ],
    tip: "Keep category names short (e.g. 'Men Slides', 'School Bags') so they display cleanly on mobile POS filter pills.",
    cta: "Open Categories",
  },
  {
    id: "inventory",
    group: "inventory",
    title: "6. Inventory & Stock Adjustments",
    route: "/admin/inventory",
    role: "All Staff",
    summary: "Monitor live rack quantities per SKU, spot low-stock sizes, and record manual stock adjustments.",
    icon: Boxes,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    steps: [
      "Filter & Spot Alerts: View every Colour × Size variant with its current stock and low-stock threshold. Critical variants highlight in amber/red.",
      "Adjust Stock: Click 'Adjust Stock' next to any variant to add or subtract pairs (e.g. physical audit count, damaged sole write-off, or display sample).",
      "Select Reason: Always pick an adjustment reason and note so every quantity change is auditable.",
    ],
    tip: "Never edit stock silently without a reason — all adjustments are permanently recorded in Stock Movements.",
    cta: "Open Inventory",
  },
  {
    id: "movements",
    group: "inventory",
    title: "7. Stock Movements Audit Log",
    route: "/admin/inventory/movements",
    role: "All Staff",
    summary: "Complete chronological ledger of every pair entering or leaving the shop.",
    icon: History,
    color: "text-slate-600 bg-slate-100 border-slate-200",
    steps: [
      "View every stock change tagged by type: Sale (-qty), Purchase (+qty), Return (+qty), or Manual Adjustment (+/-).",
      "Filter by movement type or search by product name/SKU to investigate any stock discrepancy.",
    ],
    tip: "If a size count on the shelf doesn't match the screen, check this log first to see the last bill or adjustment.",
    cta: "View Stock Log",
  },
  {
    id: "purchases",
    group: "inventory",
    title: "8. Purchases & Suppliers",
    route: "/admin/purchases",
    role: "All Staff",
    summary: "Track wholesale distributor invoices and manage your footwear & bag suppliers.",
    icon: Truck,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    steps: [
      "Add Suppliers: Click '+ Add Supplier' to save distributor name, phone, and address (e.g. VKC, Relaxo, Safari Bags).",
      "Review Invoices: View all past wholesale purchase bills, dates, and total stock-in amounts.",
      "Scan New Bills: Click 'AI Scan Wholesale Bill' to jump straight to the AI Invoice Agent for fast stock-in.",
    ],
    tip: "Confirming a purchase invoice automatically adds all item quantities into your live store inventory.",
    cta: "Open Purchases",
  },
  {
    id: "ai-agent",
    group: "inventory",
    title: "9. AI Invoice Agent (Smart Bill Scanner)",
    route: "/admin/purchases/new",
    role: "All Staff",
    summary: "Upload or photograph wholesale supplier invoices to auto-fill purchase entries and detect supplier price hikes.",
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    steps: [
      "Upload or Test: Click 'Upload Invoice Bill' to snap/upload a distributor bill (Image/PDF), or click a Quick Test Template ('VKC Footwear Bill' or 'Safari Backpacks Bill').",
      "Automatic Extraction: The AI reads Supplier Name, Invoice Number, Date, Line Items, Sizes, Box Quantities, and Wholesale Unit Costs, matching them to your catalog.",
      "Smart Margin Guard: If the supplier raised the cost price compared to your previous cost, an amber Margin Guard alert shows the margin drop and recommends a new retail selling price.",
      "Confirm Stock-In: Keep 'Auto-Adjust Retail Price on Save' checked (if desired), verify quantities, and click 'Save & Confirm Stock-In'.",
    ],
    tip: "To scan real paper invoices using Google Gemini Vision AI, add GEMINI_API_KEY in your environment settings.",
    cta: "Open AI Invoice Agent",
  },
  {
    id: "enquiries",
    group: "customers",
    title: "10. Orders & Enquiries",
    route: "/admin/enquiries",
    role: "All Staff",
    summary: "Log and follow up on customer phone or WhatsApp availability enquiries.",
    icon: MessageSquareQuote,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    steps: [
      "When a customer calls or messages on WhatsApp asking to hold a slipper/bag size, log it under '+ New Enquiry'.",
      "Update status as the order progresses: Pending → Confirmed → Converted (once billed in POS) or Cancelled.",
    ],
    tip: "Enquiries do NOT reduce physical stock automatically — only completing a bill in POS deducts stock.",
    cta: "Open Enquiries",
  },
  {
    id: "returns",
    group: "sales",
    title: "11. Returns & Exchanges",
    route: "/admin/returns",
    role: "All Staff",
    summary: "Process customer returns or size exchanges against original bills with condition-based restocking.",
    icon: RotateCcw,
    color: "text-orange-600 bg-orange-50 border-orange-200",
    steps: [
      "Look Up Bill: Enter the original Bill Number (e.g. SAFARY-1001) to load all items from that sale.",
      "Select Items & Quantity: Pick the returned slipper/bag and quantity (validated against original sold quantity).",
      "Choose Condition: Mark 'Resellable (Restock to Shelf)' to add the pair back into live inventory, or 'Damaged / Defective' so it is NOT put back for sale.",
      "Confirm Return: Submit to log the refund/exchange and update ledger records.",
    ],
    tip: "Always inspect the sole and strap condition before selecting 'Resellable' so damaged pairs don't re-enter inventory.",
    cta: "Open Returns",
  },
  {
    id: "customers",
    group: "customers",
    title: "12. Customer Directory",
    route: "/admin/customers",
    role: "All Staff",
    summary: "View registered shop customers, phone numbers, total bills, lifetime spend, and credit balances.",
    icon: Users,
    color: "text-teal-600 bg-teal-50 border-teal-200",
    steps: [
      "Search any customer by name or mobile number.",
      "Add regular customers with '+ Add Customer' so cashiers can quickly pick them during POS checkout.",
      "View each customer's lifetime purchase volume and current pending Khata balance.",
    ],
    tip: "Registering repeat customers makes size exchanges and Khata credit tracking effortless.",
    cta: "Open Customers",
  },
  {
    id: "credit",
    group: "customers",
    title: "13. Credit Management (Khata) & WhatsApp Dues",
    route: "/admin/credit",
    role: "All Staff",
    summary: "Track unpaid customer Khata balances, send 1-click WhatsApp payment reminders, and record settlements.",
    icon: WalletCards,
    color: "text-red-600 bg-red-50 border-red-200",
    steps: [
      "Review Dues: View total outstanding shop credit and every customer who currently owes money.",
      "Send WhatsApp Reminder: Click the green 'WhatsApp Due' button next to any customer to open WhatsApp with a polite, pre-filled reminder showing their exact ₹ balance.",
      "Record Settlement: When a customer pays back full or partial dues, click 'Record Payment', enter the amount received, choose Cash or UPI, and save.",
    ],
    tip: "Recording a settlement immediately updates the customer's Khata balance and records the cash/UPI inflow.",
    cta: "Open Credit Ledger",
  },
  {
    id: "expenses",
    group: "finance",
    title: "14. Daily Shop Expenses",
    route: "/admin/expenses",
    role: "All Staff",
    summary: "Log daily operating costs such as rent, electricity, transport/coolie charges, packaging, and staff tea.",
    icon: ReceiptText,
    color: "text-rose-600 bg-rose-50 border-rose-200",
    steps: [
      "Click '+ Add Expense', choose a category (Rent, Utilities, Transport, Salaries, Misc), enter the ₹ amount, date, and note.",
      "Review monthly expense totals to keep daily cash drawer payouts accounted for.",
    ],
    tip: "All recorded expenses are automatically deducted from Gross Profit to calculate true Net Profit in Owner Reports.",
    cta: "Open Expenses",
  },
  {
    id: "reports",
    group: "finance",
    title: "15. Financial Reports & CSV Export",
    route: "/admin/reports",
    role: "Owner Only",
    summary: "Analyze Gross Revenue, COGS, Gross Margin %, Operating Net Profit, and export accounting CSV files.",
    icon: BarChart3,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    steps: [
      "Review Gross Sales vs. Cost of Goods Sold (calculated accurately from cost snapshots at the time of each sale).",
      "Check Gross Profit, Total Expenses, and Net Operating Profit.",
      "Inspect product sales velocity rankings to see which models bring the highest profit.",
      "Click 'Export CSV' to download sales and profit reports for Excel or your CA/accountant.",
    ],
    tip: "This page is strictly restricted to Owner accounts and is hidden from Counter Staff.",
    cta: "Open Reports",
  },
  {
    id: "staff",
    group: "finance",
    title: "16. Staff Management (RBAC)",
    route: "/admin/staff",
    role: "Owner Only",
    summary: "Manage counter staff accounts, assign Owner or Staff roles, and toggle active access.",
    icon: UserCog,
    color: "text-violet-600 bg-violet-50 border-violet-200",
    steps: [
      "View all registered Owner and Staff profiles.",
      "Add new counter staff or toggle Active/Inactive status if someone leaves.",
    ],
    tip: "Always assign 'Staff' role to cashiers so wholesale cost prices and profit reports remain confidential.",
    cta: "Open Staff Management",
  },
  {
    id: "settings",
    group: "finance",
    title: "17. Shop Settings & Store GPay UPI ID",
    route: "/admin/settings",
    role: "Owner Only",
    summary: "Configure Shop Name, Address, Phone, WhatsApp Number, GPay/UPI ID for POS QR codes, and receipt prefixes.",
    icon: Settings,
    color: "text-slate-700 bg-slate-100 border-slate-200",
    steps: [
      "Update Store Name, Address, Phone, and Opening Hours (printed on all 80mm thermal receipts).",
      "Set Store GPay / UPI ID (e.g. yourname@okaxis): This exact UPI ID is encoded into every Dynamic QR Code generated at the POS counter.",
      "Set Bill Prefix (e.g. SAFARY-) and Default Low-Stock Threshold.",
    ],
    tip: "Test your Store GPay UPI ID with a ₹1 POS bill after updating to verify it scans directly to your bank account.",
    cta: "Open Settings",
  },
  {
    id: "assistant-pwa",
    group: "sales",
    title: "18. Safary AI Assistant, Dark Theme & Mobile App",
    route: "/admin",
    role: "All Staff",
    summary: "Use the built-in AI Copilot (Ctrl+K), switch Light/Dark themes, and install Safary Hub as a phone app.",
    icon: Bot,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    steps: [
      "Safary AI Assistant: Click '✨ Assistant' in the top header (or press Ctrl+K) to open the right side-panel. Ask 'How much sales today?', 'Show low stock alerts', or 'Who owes Khata credit?'.",
      "Light & Dark Theme: Click the Moon (🌙) / Sun (☀️) icon in the top header to switch between Light and Dark mode anytime.",
      "Install on Android (Chrome): Open the live link in Chrome → tap ⋮ (3 dots) → 'Install app' to add Safary Hub to your home screen.",
      "Install on iPhone (Safari): Open in Safari → tap Share (↑) → 'Add to Home Screen'.",
    ],
    tip: "On mobile, the POS and AI Assistant automatically adjust to full-screen mobile layouts for effortless one-hand operation.",
    cta: "Open Dashboard",
  },
];

export function UserGuideClient() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<GuideGroup>("all");

  const filtered = GUIDE_ENTRIES.filter((entry) => {
    const matchesGroup = group === "all" || entry.group === group;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      entry.title.toLowerCase().includes(q) ||
      entry.summary.toLowerCase().includes(q) ||
      entry.route.toLowerCase().includes(q) ||
      entry.steps.some((s) => s.toLowerCase().includes(q)) ||
      entry.tip.toLowerCase().includes(q);
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            Complete User Guide — Safary Bags & Footwear
          </h1>
          <p className="text-xs text-slate-500">
            Detailed page-by-page manual explaining how every screen, button, AI agent, POS checkout, and report works.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/pos"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <CreditCard className="w-4 h-4" /> Open POS
          </Link>
          <Link
            href="/admin/purchases/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-blue-600" /> AI Invoice Agent
          </Link>
        </div>
      </div>

      {/* Search & Section Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search any page or feature (e.g. GPay, Khata, Return, Margin)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {(
            [
              { id: "all", label: `All (${GUIDE_ENTRIES.length})` },
              { id: "sales", label: "POS & Daily Ops" },
              { id: "inventory", label: "Stock & AI" },
              { id: "customers", label: "Customers & Khata" },
              { id: "finance", label: "Finance & System" },
            ] as { id: GuideGroup; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setGroup(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition shrink-0 ${
                group === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page-by-Page Guide Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-800">No guide sections matched &ldquo;{search}&rdquo;</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setGroup("all");
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset search & filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((entry) => {
            const Icon = entry.icon;
            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${entry.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-slate-900 leading-snug">
                          {entry.title}
                        </h2>
                        <span className="text-2xs font-mono text-slate-400">
                          {entry.route}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-2xs font-semibold shrink-0 border ${
                        entry.role === "Owner Only"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {entry.role}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {entry.summary}
                  </p>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-2 pt-1">
                    <p className="text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      How to Use:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {entry.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-2xs text-slate-600">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Tip:</strong> {entry.tip}
                    </span>
                  </div>
                </div>

                {/* Footer Action Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-2xs text-slate-400">
                    Section {entry.id}
                  </span>
                  <Link
                    href={entry.route}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {entry.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
