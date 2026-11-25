import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function generateOrderWhatsAppUrl(options: {
  phone: string;
  productName: string;
  productCode: string;
  colour: string;
  size: string;
  price: number;
}): string {
  const cleanPhone = options.phone.replace(/[^0-9]/g, "");
  const message = `Hello! I would like to order the following slipper from your shop:
- Product: ${options.productName} (${options.productCode})
- Colour: ${options.colour}
- Size: ${options.size}
- Price: ₹${options.price}

Please confirm availability and how I can complete the order. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
