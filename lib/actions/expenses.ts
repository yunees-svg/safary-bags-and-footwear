"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Expense, PaymentMethod } from "@/lib/types/database";
import { getCurrentUser } from "@/lib/actions/auth";

export async function getExpensesAction(): Promise<Expense[]> {
  return mockStore.getExpenses();
}

export interface CreateExpensePayload {
  category: Expense["category"];
  amount: number;
  description?: string;
  payment_method: PaymentMethod;
  expense_date: string;
}

export async function createExpenseAction(payload: CreateExpensePayload) {
  const user = await getCurrentUser();

  if (payload.amount <= 0) {
    return { error: "Expense amount must be greater than zero." };
  }

  if (!payload.category || !payload.expense_date) {
    return { error: "Category and expense date are required." };
  }

  const newExp = mockStore.addExpense({
    category: payload.category,
    amount: Number(payload.amount),
    description: payload.description?.trim() || null,
    payment_method: payload.payment_method,
    expense_date: payload.expense_date,
    created_by: user?.full_name || "Admin",
  });

  revalidatePath("/admin/expenses");
  revalidatePath("/admin/reports");
  revalidatePath("/admin");

  return { success: true, expense: newExp };
}
