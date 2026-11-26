"use server";

import { mockStore } from "@/lib/data/mock-store";
import { getCurrentUser } from "@/lib/actions/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export interface PulseFeedItem {
  id: string;
  type: "sale" | "stock_alert" | "credit_warning" | "purchase" | "enquiry";
  title: string;
  description: string;
  timestamp: string;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "red" | "blue" | "purple";
  actionLabel?: string;
  actionHref?: string;
  whatsAppUrl?: string;
  billId?: string;
}

export async function getDashboardMetrics() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";

  const bills = mockStore.getBills();
  const variants = mockStore.getVariantsWithProduct();
  const expenses = mockStore.getExpenses();
  const snapshot = mockStore.getSnapshot();
  const customers = mockStore.getCustomers();
  const purchases = (snapshot as any).purchases || [];
  const enquiries = snapshot.enquiries || [];

  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's completed bills
  const todayBills = bills.filter(
    (b) =>
      b.bill_status === "completed" &&
      b.created_at.slice(0, 10) === todayStr
  );

  const todaySales = todayBills.reduce((acc, b) => acc + b.total_amount, 0);
  const todayBillCount = todayBills.length;

  // All-time revenue
  const totalRevenue = bills
    .filter((b) => b.bill_status === "completed")
    .reduce((acc, b) => acc + b.total_amount, 0);

  // Gross profit calculation (Snapshot Selling Price - Snapshot Cost Price)
  let estimatedGrossProfit = 0;
  bills
    .filter((b) => b.bill_status === "completed")
    .forEach((b) => {
      b.items?.forEach((item) => {
        const itemProfit = (item.unit_price - item.unit_cost_snapshot) * item.quantity;
        estimatedGrossProfit += itemProfit;
      });
      // Deduct discount
      estimatedGrossProfit -= b.discount || 0;
    });

  // Today's expenses
  const todayExpenses = expenses
    .filter((e) => e.expense_date === todayStr)
    .reduce((acc, e) => acc + e.amount, 0);

  // Low stock products
  const lowStockItems = variants.filter(
    (v) => v.stock_quantity <= v.low_stock_threshold
  );

  // Recent transactions (last 6 bills)
  const recentBills = bills.slice(0, 6);

  // Best-selling variants (aggregated from bill items)
  const productSalesMap = new Map<string, { name: string; colour: string; size: string; quantity: number; totalRevenue: number }>();
  bills.forEach((b) => {
    b.items?.forEach((item) => {
      const key = `${item.product_name_snapshot}-${item.colour_snapshot}-${item.size_snapshot}`;
      const existing = productSalesMap.get(key) || {
        name: item.product_name_snapshot,
        colour: item.colour_snapshot,
        size: item.size_snapshot,
        quantity: 0,
        totalRevenue: 0,
      };
      existing.quantity += item.quantity;
      existing.totalRevenue += item.subtotal;
      productSalesMap.set(key, existing);
    });
  });

  const bestSellers = Array.from(productSalesMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Synthesize Live Pulse Feed (Velom Activity Stream)
  const pulseFeed: PulseFeedItem[] = [];

  // 1. Add Recent Completed Sales
  bills.slice(0, 5).forEach((b) => {
    const paymentMode = b.payments?.[0]?.payment_method || "cash";
    const itemSummary = b.items?.map((it) => `${it.product_name_snapshot} (${it.quantity})`).slice(0, 2).join(", ");
    pulseFeed.push({
      id: `pulse_sale_${b.id}`,
      type: "sale",
      title: `Bill #${b.bill_number} Issued`,
      description: `${itemSummary || "Slippers"} • Total: ${formatCurrency(b.total_amount)}`,
      timestamp: b.created_at,
      badge: paymentMode.toUpperCase(),
      badgeColor: "emerald",
      billId: b.id,
      actionLabel: "View Receipt",
    });
  });

  // 2. Add Urgent Low Stock Warnings
  lowStockItems.slice(0, 4).forEach((ls) => {
    pulseFeed.push({
      id: `pulse_stock_${ls.id}`,
      type: "stock_alert",
      title: `Low Stock: ${ls.product.name}`,
      description: `${ls.colour}, Size ${ls.size} — Only ${ls.stock_quantity} pairs remaining in rack!`,
      timestamp: ls.product?.created_at || new Date().toISOString(),
      badge: `${ls.stock_quantity} LEFT`,
      badgeColor: "amber",
      actionLabel: "Restock Now",
      actionHref: "/admin/inventory",
    });
  });

  // 3. Add High Credit (Khata) Balance Warnings
  customers
    .filter((c) => (c.outstanding_balance ?? 0) > 0)
    .sort((a, b) => (b.outstanding_balance ?? 0) - (a.outstanding_balance ?? 0))
    .slice(0, 3)
    .forEach((c) => {
      const balance = c.outstanding_balance ?? 0;
      const cleanPhone = c.phone.replace(/\D/g, "");
      const msg = `Hello ${c.name}, this is a gentle reminder from Safary Bags and Footwear. Your pending credit balance is ${formatCurrency(balance)}. Kindly settle via GPay or visit the shop. Thank you!`;
      pulseFeed.push({
        id: `pulse_credit_${c.id}`,
        type: "credit_warning",
        title: `Pending Khata: ${c.name}`,
        description: `Unpaid balance ${formatCurrency(balance)} • Phone: ${c.phone}`,
        timestamp: c.created_at || new Date().toISOString(),
        badge: "DUE OVERDRAFT",
        badgeColor: "red",
        actionLabel: "WhatsApp Due Reminder",
        whatsAppUrl: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`,
      });
    });

  // 4. Add Wholesale Purchases
  purchases.slice(0, 3).forEach((p: any) => {
    pulseFeed.push({
      id: `pulse_pur_${p.id}`,
      type: "purchase",
      title: `Stock-In: Invoice #${p.invoice_number}`,
      description: `Wholesale dispatch confirmed • ${p.items?.length || 0} line items added to stock`,
      timestamp: p.purchase_date || p.created_at || new Date().toISOString(),
      badge: "PURCHASE",
      badgeColor: "purple",
      actionLabel: "View Invoices",
      actionHref: "/admin/purchases",
    });
  });

  // 5. Add Online WhatsApp Enquiries
  enquiries.slice(0, 3).forEach((eq: any) => {
    pulseFeed.push({
      id: `pulse_enq_${eq.id}`,
      type: "enquiry",
      title: `Online Enquiry: ${eq.product_name || "Catalog Footwear"}`,
      description: `Customer ${eq.customer_name || "Visitor"} (${eq.customer_phone || "WhatsApp"})`,
      timestamp: eq.created_at || new Date().toISOString(),
      badge: "WEB LEAD",
      badgeColor: "blue",
      actionLabel: "View Enquiries",
      actionHref: "/admin/enquiries",
    });
  });

  // Sort chronological by timestamp descending
  pulseFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    todaySales,
    todayBillCount,
    totalRevenue,
    estimatedGrossProfit: isOwner ? estimatedGrossProfit : null,
    todayExpenses,
    lowStockItems,
    recentBills,
    bestSellers,
    pulseFeed: pulseFeed.slice(0, 10),
    settings: mockStore.getSettings(),
    isOwner,
  };
}
