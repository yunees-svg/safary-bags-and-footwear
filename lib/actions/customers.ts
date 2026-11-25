"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Customer, CustomerLedger, PaymentMethod } from "@/lib/types/database";

export async function getCustomersAction(): Promise<
  (Customer & {
    totalBills: number;
    totalPurchased: number;
  })[]
> {
  const customers = mockStore.getCustomers();
  const bills = mockStore.getBills();

  return customers.map((c) => {
    const custBills = bills.filter((b) => b.customer_id === c.id && b.bill_status === "completed");
    const totalPurchased = custBills.reduce((acc, b) => acc + b.total_amount, 0);

    return {
      ...c,
      totalBills: custBills.length,
      totalPurchased,
      outstanding_balance: c.outstanding_balance || 0,
    };
  });
}

export async function createCustomerAction(payload: {
  name: string;
  phone: string;
  address?: string;
}) {
  if (!payload.name || !payload.phone) {
    return { error: "Customer name and phone number are required." };
  }

  const existing = mockStore
    .getCustomers()
    .find((c) => c.phone.replace(/\D/g, "") === payload.phone.replace(/\D/g, ""));
  if (existing) {
    return { error: `A customer with phone ${payload.phone} already exists (${existing.name}).` };
  }

  const newCust = mockStore.addCustomer({
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    address: payload.address?.trim() || null,
  });

  revalidatePath("/admin/customers");
  revalidatePath("/admin/credit");
  revalidatePath("/admin/pos");
  return { success: true, customer: newCust };
}

export async function recordCreditPaymentAction(payload: {
  customer_id: string;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
}) {
  if (payload.amount <= 0) {
    return { error: "Payment amount must be greater than zero." };
  }

  const success = mockStore.recordCustomerPayment(
    payload.customer_id,
    payload.amount,
    payload.payment_method
  );

  if (!success) {
    return { error: "Customer not found." };
  }

  revalidatePath("/admin/credit");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/pos");
  revalidatePath("/admin/reports");
  revalidatePath("/admin");

  return { success: true };
}

export async function getCustomerLedgerAction(customerId: string): Promise<CustomerLedger[]> {
  const snapshot = mockStore.getSnapshot();
  return snapshot.ledger.filter((l) => l.customer_id === customerId);
}
