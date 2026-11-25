"use server";

import { mockStore } from "@/lib/data/mock-store";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getDashboardMetrics() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";

  const bills = mockStore.getBills();
  const variants = mockStore.getVariantsWithProduct();
  const expenses = mockStore.getExpenses();

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

  return {
    todaySales,
    todayBillCount,
    totalRevenue,
    estimatedGrossProfit: isOwner ? estimatedGrossProfit : null,
    todayExpenses,
    lowStockItems,
    recentBills,
    bestSellers,
    isOwner,
  };
}
