"use server";

import { mockStore } from "@/lib/data/mock-store";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getReportsDataAction() {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";

  const bills = mockStore.getBills().filter((b) => b.bill_status === "completed");
  const expenses = mockStore.getExpenses();
  const variants = mockStore.getVariantsWithProduct();
  const customers = mockStore.getCustomers();

  // Total Sales & Gross Profit
  let totalGrossSales = 0;
  let totalDiscounts = 0;
  let totalCostOfGoodsSold = 0;

  // Breakdown by payment method
  const paymentBreakdown: Record<string, number> = {
    cash: 0,
    upi: 0,
    card: 0,
    credit: 0,
  };

  // Product sales counter
  const productSalesMap = new Map<
    string,
    {
      name: string;
      code: string;
      soldQty: number;
      revenue: number;
      cost: number;
      margin: number;
    }
  >();

  bills.forEach((b) => {
    totalGrossSales += b.total_amount;
    totalDiscounts += b.discount || 0;

    b.payments?.forEach((p) => {
      const m = p.payment_method.toLowerCase();
      paymentBreakdown[m] = (paymentBreakdown[m] || 0) + p.amount;
    });

    b.items?.forEach((item) => {
      const lineCost = item.quantity * item.unit_cost_snapshot;
      totalCostOfGoodsSold += lineCost;

      const key = item.product_name_snapshot;
      const existing = productSalesMap.get(key) || {
        name: item.product_name_snapshot,
        code: "-",
        soldQty: 0,
        revenue: 0,
        cost: 0,
        margin: 0,
      };

      existing.soldQty += item.quantity;
      existing.revenue += item.subtotal;
      existing.cost += lineCost;
      existing.margin = existing.revenue - existing.cost;
      productSalesMap.set(key, existing);
    });
  });

  const grossProfit = totalGrossSales - totalCostOfGoodsSold;
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netOperatingProfit = grossProfit - totalExpensesAmount;

  // Best-selling vs Slow-moving
  const productPerformance = Array.from(productSalesMap.values()).sort(
    (a, b) => b.soldQty - a.soldQty
  );

  // Credit outstanding
  const totalCreditDue = customers.reduce(
    (acc, c) => acc + (c.outstanding_balance || 0),
    0
  );

  return {
    isOwner,
    totalGrossSales,
    totalDiscounts,
    totalCostOfGoodsSold: isOwner ? totalCostOfGoodsSold : null,
    grossProfit: isOwner ? grossProfit : null,
    totalExpensesAmount,
    netOperatingProfit: isOwner ? netOperatingProfit : null,
    totalCreditDue,
    paymentBreakdown,
    productPerformance,
    billCount: bills.length,
    expenseCount: expenses.length,
  };
}
