"use server";

import { mockStore } from "@/lib/data/mock-store";
import { getCurrentUser } from "@/lib/actions/auth";
import { formatCurrency } from "@/lib/utils";

export interface AssistantReply {
  answer: string;
  suggestedLinks?: { label: string; href: string }[];
}

export async function askShopAssistantAction(question: string): Promise<AssistantReply> {
  const user = await getCurrentUser();
  const isOwner = user?.role === "owner";

  const q = question.trim().toLowerCase();
  const bills = mockStore.getBills();
  const variants = mockStore.getVariantsWithProduct();
  const customers = mockStore.getCustomers();
  const expenses = mockStore.getExpenses();
  const settings = mockStore.getSettings();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBills = bills.filter(
    (b) => b.bill_status === "completed" && b.created_at.slice(0, 10) === todayStr
  );
  const todaySales = todayBills.reduce((acc, b) => acc + b.total_amount, 0);
  const totalRevenue = bills
    .filter((b) => b.bill_status === "completed")
    .reduce((acc, b) => acc + b.total_amount, 0);

  const lowStock = variants.filter((v) => v.stock_quantity <= v.low_stock_threshold);
  const creditCustomers = customers.filter((c) => (c.outstanding_balance ?? 0) > 0);
  const totalCredit = creditCustomers.reduce((acc, c) => acc + (c.outstanding_balance ?? 0), 0);

  // If Gemini API key is configured, use live Gemini 2.5 Flash with store context
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const storeContext = {
        shopName: settings.shop_name,
        userRole: user?.role || "staff",
        todaySales,
        todayBillCount: todayBills.length,
        totalRevenue,
        totalProducts: mockStore.getProducts().length,
        lowStockItems: lowStock.slice(0, 8).map((v) => ({
          name: v.product.name,
          code: v.product.product_code,
          colour: v.colour,
          size: v.size,
          stock: v.stock_quantity,
        })),
        pendingKhataCount: creditCustomers.length,
        totalPendingKhata: totalCredit,
        topCreditCustomers: creditCustomers.slice(0, 5).map((c) => ({
          name: c.name,
          phone: c.phone,
          due: c.outstanding_balance,
        })),
        todayExpenses: expenses
          .filter((e) => e.expense_date === todayStr)
          .reduce((a, b) => a + b.amount, 0),
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are "Safary AI", a smart retail shop assistant for "${settings.shop_name}" (selling slippers, footwear, and bags).
Live Store Data: ${JSON.stringify(storeContext)}
Rules:
- Keep answers concise, clear, and helpful in Indian Rupees (₹).
- If userRole is "staff", do NOT reveal owner profit margins or cost prices.
- User Question: "${question}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            answer: text.trim(),
            suggestedLinks: inferLinks(q),
          };
        }
      }
    } catch {
      // Fallback to local store intelligence
    }
  }

  // Local Smart Shop Intelligence (works 100% without API key)
  if (q.includes("sale") || q.includes("revenue") || q.includes("today") || q.includes("earn") || q.includes("bill")) {
    return {
      answer: `📊 **Sales Snapshot for ${settings.shop_name}:**\n• **Today's Sales:** ${formatCurrency(todaySales)} (${todayBills.length} bills)\n• **Total Store Revenue:** ${formatCurrency(totalRevenue)} across ${bills.length} bills.${
        isOwner ? `\n• **Today's Expenses:** ${formatCurrency(expenses.filter((e) => e.expense_date === todayStr).reduce((a, b) => a + b.amount, 0))}` : ""
      }`,
      suggestedLinks: [
        { label: "Open Billing / POS", href: "/admin/pos" },
        ...(isOwner ? [{ label: "View Financial Reports", href: "/admin/reports" }] : []),
      ],
    };
  }

  if (q.includes("low") || q.includes("stock") || q.includes("alert") || q.includes("reorder") || q.includes("empty")) {
    if (lowStock.length === 0) {
      return {
        answer: "✅ All product sizes and colours are well-stocked right now! No low-stock alerts.",
        suggestedLinks: [{ label: "View Full Inventory", href: "/admin/inventory" }],
      };
    }
    const list = lowStock
      .slice(0, 5)
      .map((v) => `• **${v.product.name}** (${v.colour}, Size ${v.size}): **${v.stock_quantity} left**`)
      .join("\n");
    return {
      answer: `⚠️ **${lowStock.length} Variants Running Low:**\n${list}${
        lowStock.length > 5 ? `\n...and ${lowStock.length - 5} more.` : ""
      }`,
      suggestedLinks: [
        { label: "Manage Inventory", href: "/admin/inventory" },
        { label: "AI Scan Wholesale Bill", href: "/admin/purchases/new" },
      ],
    };
  }

  if (q.includes("khata") || q.includes("credit") || q.includes("due") || q.includes("owe") || q.includes("pending")) {
    if (creditCustomers.length === 0) {
      return {
        answer: "✅ Great news! No customers have pending Khata credit dues right now.",
        suggestedLinks: [{ label: "Credit Ledger", href: "/admin/credit" }],
      };
    }
    const list = creditCustomers
      .sort((a, b) => (b.outstanding_balance ?? 0) - (a.outstanding_balance ?? 0))
      .slice(0, 5)
      .map((c) => `• **${c.name}** (${c.phone}): **${formatCurrency(c.outstanding_balance ?? 0)}**`)
      .join("\n");
    return {
      answer: `💳 **Pending Khata Credit (${formatCurrency(totalCredit)} total):**\n${list}\n\nYou can send 1-click WhatsApp reminders directly from the Credit Management page.`,
      suggestedLinks: [{ label: "Open Credit & Send WhatsApp", href: "/admin/credit" }],
    };
  }

  if (q.includes("size") || q.includes("bag") || q.includes("slipper") || q.includes("available") || q.includes("find")) {
    const tokens = q.split(/\s+/).filter((t) => t.length >= 1 && !["do", "you", "have", "in", "size", "stock", "is", "there", "any", "available"].includes(t));
    const matched = variants.filter((v) =>
      tokens.some(
        (t) =>
          v.product.name.toLowerCase().includes(t) ||
          v.product.product_code.toLowerCase().includes(t) ||
          v.colour.toLowerCase().includes(t) ||
          v.size.toLowerCase() === t
      )
    );

    if (matched.length > 0) {
      const list = matched
        .slice(0, 5)
        .map(
          (v) =>
            `• **${v.product.name}** (${v.colour}, Size ${v.size}) — **${v.stock_quantity} in stock** (${formatCurrency(v.product.selling_price)})`
        )
        .join("\n");
      return {
        answer: `🔍 **Matching Stock Found:**\n${list}`,
        suggestedLinks: [{ label: "Bill at POS", href: "/admin/pos" }],
      };
    }
  }

  if (q.includes("invoice") || q.includes("scan") || q.includes("purchase") || q.includes("bill")) {
    return {
      answer:
        "🧾 To process a wholesale distributor bill automatically, open the **AI Invoice Agent**. You can upload a photo/PDF or test with a sample wholesale bill.",
      suggestedLinks: [{ label: "Open AI Invoice Agent", href: "/admin/purchases/new" }],
    };
  }

  return {
    answer: `👋 Hi! I'm **Safary AI**, your store assistant for **${settings.shop_name}**.\n\nAsk me things like:\n• *"How much sales today?"*\n• *"Show low stock alerts"*\n• *"Who owes Khata credit?"*\n• *"Check stock for size 8"*`,
    suggestedLinks: [
      { label: "Billing / POS", href: "/admin/pos" },
      { label: "AI Invoice Agent", href: "/admin/purchases/new" },
    ],
  };
}

function inferLinks(q: string): { label: string; href: string }[] {
  if (q.includes("khata") || q.includes("credit") || q.includes("due")) {
    return [{ label: "Open Credit Ledger", href: "/admin/credit" }];
  }
  if (q.includes("stock") || q.includes("low")) {
    return [{ label: "Open Inventory", href: "/admin/inventory" }];
  }
  if (q.includes("invoice") || q.includes("purchase")) {
    return [{ label: "Open AI Invoice Agent", href: "/admin/purchases/new" }];
  }
  return [{ label: "Open POS Billing", href: "/admin/pos" }];
}
