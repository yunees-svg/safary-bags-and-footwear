import { Suspense } from "react";
import { getExpensesAction } from "@/lib/actions/expenses";
import { ExpensesClient } from "@/components/admin/expenses-client";

export const instant = false;

export default async function AdminExpensesPage() {
  const expenses = await getExpensesAction();
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading expenses...</div>}>
      <ExpensesClient expenses={expenses} />
    </Suspense>
  );
}
