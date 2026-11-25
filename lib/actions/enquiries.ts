"use server";

import { revalidatePath } from "next/cache";
import { mockStore } from "@/lib/data/mock-store";
import { Enquiry } from "@/lib/types/database";

export async function getEnquiriesAction(): Promise<
  (Enquiry & {
    productName?: string;
    colour?: string;
    size?: string;
  })[]
> {
  const snapshot = mockStore.getSnapshot();
  const enquiries = snapshot.enquiries;
  const variants = snapshot.variants;
  const products = snapshot.products;

  return enquiries.map((e) => {
    let productName = undefined;
    let colour = undefined;
    let size = undefined;

    if (e.variant_id) {
      const v = variants.find((vr) => vr.id === e.variant_id);
      if (v) {
        colour = v.colour;
        size = v.size;
        const p = products.find((pr) => pr.id === v.product_id);
        if (p) productName = p.name;
      }
    }

    return {
      ...e,
      productName,
      colour,
      size,
    };
  });
}

export async function createEnquiryAction(payload: {
  customer_name: string;
  phone: string;
  variant_id?: string | null;
  message?: string;
}) {
  if (!payload.customer_name || !payload.phone) {
    return { error: "Customer name and phone number are required." };
  }

  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}`,
    customer_name: payload.customer_name.trim(),
    phone: payload.phone.trim(),
    variant_id: payload.variant_id || null,
    message: payload.message?.trim() || null,
    status: "new",
    created_at: new Date().toISOString(),
  };

  mockStore.getSnapshot().enquiries.unshift(newEnquiry);
  revalidatePath("/admin/enquiries");
  return { success: true, enquiry: newEnquiry };
}

export async function updateEnquiryStatusAction(id: string, status: Enquiry["status"]) {
  const enquiry = mockStore.getSnapshot().enquiries.find((e) => e.id === id);
  if (!enquiry) {
    return { error: "Enquiry record not found." };
  }

  enquiry.status = status;
  revalidatePath("/admin/enquiries");
  return { success: true };
}
