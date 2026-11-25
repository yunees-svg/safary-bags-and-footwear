export type UserRole = "owner" | "staff";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  product_code: string;
  name: string;
  brand: string;
  description?: string | null;
  selling_price: number;
  cost_price: number;
  is_published: boolean;
  entry_date?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  colour: string;
  size: string;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  product?: Product;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  created_at: string;
}

export type PurchaseStatus = "draft" | "confirmed" | "cancelled";

export interface Purchase {
  id: string;
  supplier_id: string;
  invoice_number: string;
  purchase_date: string;
  total_amount: number;
  status: PurchaseStatus;
  created_at: string;
  supplier?: Supplier;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  variant_id: string;
  quantity: number;
  unit_cost: number;
  subtotal: number;
  variant?: ProductVariant;
}

export type BillPaymentStatus = "paid" | "partial" | "credit" | "refunded";
export type BillStatus = "completed" | "cancelled" | "returned";

export interface Bill {
  id: string;
  bill_number: string;
  customer_id?: string | null;
  subtotal: number;
  discount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: BillPaymentStatus;
  bill_status: BillStatus;
  created_by: string;
  created_at: string;
  customer?: Customer | null;
  items?: BillItem[];
  payments?: Payment[];
  creator?: Profile;
}

export interface BillItem {
  id: string;
  bill_id: string;
  variant_id: string;
  product_name_snapshot: string;
  colour_snapshot: string;
  size_snapshot: string;
  quantity: number;
  unit_price: number;
  unit_cost_snapshot: number;
  subtotal: number;
}

export type PaymentMethod = "cash" | "upi" | "card" | "credit" | "split";

export interface Payment {
  id: string;
  bill_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_date: string;
  reference_number?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  created_at: string;
  outstanding_balance?: number;
}

export type LedgerTransactionType = "sale_debit" | "payment_credit" | "return_credit" | "adjustment";

export interface CustomerLedger {
  id: string;
  customer_id: string;
  bill_id?: string | null;
  transaction_type: LedgerTransactionType;
  amount: number;
  description: string;
  created_at: string;
}

export type StockMovementType =
  | "sale"
  | "purchase"
  | "return_restock"
  | "adjustment_in"
  | "adjustment_out"
  | "damage"
  | "theft";

export interface StockMovement {
  id: string;
  variant_id: string;
  movement_type: StockMovementType;
  quantity: number;
  reference_type?: string | null;
  reference_id?: string | null;
  reason?: string | null;
  created_by: string;
  created_at: string;
  variant?: ProductVariant;
}

export interface Return {
  id: string;
  bill_id: string;
  return_reason: string;
  refund_amount: number;
  return_status: "approved" | "rejected" | "completed";
  created_by: string;
  created_at: string;
  bill?: Bill;
  items?: ReturnItem[];
}

export interface ReturnItem {
  id: string;
  return_id: string;
  bill_item_id: string;
  quantity: number;
  restock_quantity: number;
  refund_amount: number;
}

export interface Expense {
  id: string;
  category: "Rent" | "Electricity" | "Transport" | "Shop Maintenance" | "Tea & Refreshments" | "Staff Salary" | "Other";
  amount: number;
  description?: string | null;
  payment_method: PaymentMethod;
  expense_date: string;
  created_by: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  variant_id?: string | null;
  message?: string | null;
  status: "new" | "contacted" | "converted" | "cancelled";
  created_at: string;
  variant?: ProductVariant;
}

export interface ShopSettings {
  id: string;
  shop_name: string;
  logo_url?: string | null;
  address: string;
  phone: string;
  whatsapp_number: string;
  currency: string;
  opening_hours: string;
  tax_rate: number;
  bill_prefix: string;
  low_stock_default: number;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown> | null;
  created_at: string;
}
