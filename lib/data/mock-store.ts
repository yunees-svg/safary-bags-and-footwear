import {
  Category,
  Product,
  ProductVariant,
  Supplier,
  Bill,
  Customer,
  CustomerLedger,
  StockMovement,
  Expense,
  Enquiry,
  ShopSettings,
  Profile,
  PaymentMethod,
} from "@/lib/types/database";

export interface MockDatabase {
  settings: ShopSettings;
  profiles: Profile[];
  categories: Category[];
  products: Product[];
  variants: ProductVariant[];
  suppliers: Supplier[];
  customers: Customer[];
  bills: Bill[];
  ledger: CustomerLedger[];
  stockMovements: StockMovement[];
  expenses: Expense[];
  enquiries: Enquiry[];
}

const initialSettings: ShopSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  shop_name: "Safary Bags and Footwear",
  logo_url: null,
  address: "Shop No. 4, Ground Floor, Central Retail Arcade, Main Market, MG Road",
  phone: "+91 98765 43210",
  whatsapp_number: "+91 98765 43210",
  currency: "INR",
  opening_hours: "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM",
  tax_rate: 0.0,
  bill_prefix: "SAFARY-",
  low_stock_default: 5,
  updated_at: new Date().toISOString(),
};

const initialProfiles: Profile[] = [
  {
    id: "usr_owner_01",
    full_name: "Owner",
    email: "owner@safary.com",
    role: "owner",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const initialCategories: Category[] = [
  {
    id: "cat_1",
    name: "Men's Slippers",
    slug: "mens-slippers",
    description: "Durable, stylish and comfortable slippers for daily and outdoor wear",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat_2",
    name: "Women's Slippers",
    slug: "womens-slippers",
    description: "Chic slides, lightweight flip-flops and plush indoor slippers for women",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat_3",
    name: "Kids' Slippers",
    slug: "kids-slippers",
    description: "Colourful, soft, anti-slip slippers crafted for children of all ages",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat_4",
    name: "Orthopedic & Comfort",
    slug: "ortho-comfort",
    description: "Special high-density memory foam and acupressure soles for foot support",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat_5",
    name: "Casual Slides",
    slug: "casual-slides",
    description: "Trendy slip-on sliders for pool, casual strolls, and relaxing at home",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "cat_6",
    name: "Travel & School Bags",
    slug: "bags-backpacks",
    description: "Durable water-resistant school bags, travel duffels, and laptop backpacks",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [];
const initialVariants: ProductVariant[] = [];
const initialSuppliers: Supplier[] = [];
const initialCustomers: Customer[] = [];
const initialBills: Bill[] = [];
const initialStockMovements: StockMovement[] = [];
const initialExpenses: Expense[] = [];
const initialEnquiries: Enquiry[] = [];

// In-Memory store instance (singleton per server lifecycle)
class Store {
  private data: MockDatabase;

  constructor() {
    this.data = {
      settings: initialSettings,
      profiles: initialProfiles,
      categories: initialCategories,
      products: initialProducts,
      variants: initialVariants,
      suppliers: initialSuppliers,
      customers: initialCustomers,
      bills: initialBills,
      ledger: [],
      stockMovements: initialStockMovements,
      expenses: initialExpenses,
      enquiries: initialEnquiries,
    };
  }

  getSnapshot(): MockDatabase {
    return this.data;
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find((c) => c.slug === slug);
  }

  addCategory(category: Omit<Category, "id" | "created_at">): Category {
    const newCat: Category = {
      ...category,
      id: `cat_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.data.categories.push(newCat);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const hasProducts = this.data.products.some((p) => p.category_id === id);
    if (hasProducts) return false;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    return true;
  }

  // Products & Variants
  getProducts(): (Product & { category?: Category; variants: ProductVariant[] })[] {
    return this.data.products.map((p) => {
      const category = this.data.categories.find((c) => c.id === p.category_id);
      const variants = this.data.variants.filter((v) => v.product_id === p.id);
      return { ...p, category, variants };
    });
  }

  getProductById(id: string) {
    const p = this.data.products.find((prod) => prod.id === id);
    if (!p) return null;
    const category = this.data.categories.find((c) => c.id === p.category_id);
    const variants = this.data.variants.filter((v) => v.product_id === p.id);
    return { ...p, category, variants };
  }

  addProduct(
    product: Omit<Product, "id" | "created_at" | "updated_at">,
    variants: Omit<ProductVariant, "id" | "product_id">[]
  ): Product {
    const newProd: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.products.unshift(newProd);

    // Add variants
    variants.forEach((v, idx) => {
      this.data.variants.push({
        ...v,
        id: `var_${Date.now()}_${idx}`,
        product_id: newProd.id,
      });
    });

    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    // Check if product was used in bills
    const hasBills = this.data.bills.some((b) =>
      b.items?.some((item) =>
        this.data.variants.some((v) => v.product_id === id && v.id === item.variant_id)
      )
    );
    if (hasBills) {
      // Archive instead
      this.updateProduct(id, { is_published: false });
      return false;
    }
    this.data.variants = this.data.variants.filter((v) => v.product_id !== id);
    this.data.products = this.data.products.filter((p) => p.id !== id);
    return true;
  }

  // Inventory & Adjustments
  getVariantsWithProduct(): (ProductVariant & { product: Product })[] {
    return this.data.variants
      .map((v) => {
        const prod = this.data.products.find((p) => p.id === v.product_id);
        if (!prod) return null;
        return { ...v, product: prod };
      })
      .filter((v): v is ProductVariant & { product: Product } => v !== null);
  }

  adjustStock(options: {
    variant_id: string;
    new_quantity: number;
    movement_type: StockMovement["movement_type"];
    reason: string;
    created_by: string;
  }): boolean {
    const variant = this.data.variants.find((v) => v.id === options.variant_id);
    if (!variant) return false;

    const diff = options.new_quantity - variant.stock_quantity;
    if (diff === 0) return true;

    variant.stock_quantity = options.new_quantity;

    this.data.stockMovements.unshift({
      id: `sm_${Date.now()}`,
      variant_id: options.variant_id,
      movement_type: options.movement_type,
      quantity: diff,
      reference_type: "manual_adjustment",
      reason: options.reason,
      created_by: options.created_by,
      created_at: new Date().toISOString(),
    });

    return true;
  }

  // Bills & POS
  createBill(payload: {
    customer_id?: string | null;
    items: {
      variant_id: string;
      quantity: number;
      unit_price: number;
      unit_cost: number;
    }[];
    discount: number;
    payment_method: PaymentMethod;
    paid_amount: number;
    created_by: string;
    reference_number?: string;
  }): Bill {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = this.data.bills.length + 1;
    const billNumber = `SLIP-${today}-${String(count).padStart(4, "0")}`;

    let subtotal = 0;
    const billItems = payload.items.map((item, idx) => {
      const variant = this.data.variants.find((v) => v.id === item.variant_id);
      const product = variant ? this.data.products.find((p) => p.id === variant.product_id) : null;
      const lineSubtotal = item.quantity * item.unit_price;
      subtotal += lineSubtotal;

      // Atomically reduce stock
      if (variant) {
        variant.stock_quantity = Math.max(0, variant.stock_quantity - item.quantity);
        this.data.stockMovements.unshift({
          id: `sm_${Date.now()}_${idx}`,
          variant_id: item.variant_id,
          movement_type: "sale",
          quantity: -item.quantity,
          reference_type: "bill",
          reason: `Sale on Bill ${billNumber}`,
          created_by: payload.created_by,
          created_at: new Date().toISOString(),
        });
      }

      return {
        id: `bi_${Date.now()}_${idx}`,
        bill_id: `bill_${Date.now()}`,
        variant_id: item.variant_id,
        product_name_snapshot: product ? product.name : "Slipper Item",
        colour_snapshot: variant ? variant.colour : "-",
        size_snapshot: variant ? variant.size : "-",
        quantity: item.quantity,
        unit_price: item.unit_price,
        unit_cost_snapshot: item.unit_cost,
        subtotal: lineSubtotal,
      };
    });

    const totalAmount = Math.max(0, subtotal - (payload.discount || 0));
    let paymentStatus: Bill["payment_status"] = "paid";

    if (payload.payment_method === "credit") {
      paymentStatus = "credit";
    } else if (payload.paid_amount < totalAmount) {
      paymentStatus = "partial";
    }

    const billId = `bill_${Date.now()}`;
    const newBill: Bill = {
      id: billId,
      bill_number: billNumber,
      customer_id: payload.customer_id,
      subtotal,
      discount: payload.discount,
      tax_amount: 0,
      total_amount: totalAmount,
      payment_status: paymentStatus,
      bill_status: "completed",
      created_by: payload.created_by,
      created_at: new Date().toISOString(),
      items: billItems,
      payments: [
        {
          id: `pay_${Date.now()}`,
          bill_id: billId,
          payment_method: payload.payment_method,
          amount: payload.paid_amount,
          payment_date: new Date().toISOString(),
          reference_number: payload.reference_number,
        },
      ],
    };

    this.data.bills.unshift(newBill);

    // Update customer outstanding if credit/partial
    if (payload.customer_id && totalAmount > payload.paid_amount) {
      const creditDue = totalAmount - payload.paid_amount;
      const cust = this.data.customers.find((c) => c.id === payload.customer_id);
      if (cust) {
        cust.outstanding_balance = (cust.outstanding_balance || 0) + creditDue;
      }
      this.data.ledger.unshift({
        id: `led_${Date.now()}`,
        customer_id: payload.customer_id,
        bill_id: billId,
        transaction_type: "sale_debit",
        amount: creditDue,
        description: `Credit balance from Bill ${billNumber}`,
        created_at: new Date().toISOString(),
      });
    }

    return newBill;
  }

  getBills(): Bill[] {
    return this.data.bills.map((b) => {
      const customer = this.data.customers.find((c) => c.id === b.customer_id);
      const creator = this.data.profiles.find((p) => p.id === b.created_by);
      return { ...b, customer, creator };
    });
  }

  // Expenses
  getExpenses(): Expense[] {
    return this.data.expenses;
  }

  addExpense(expense: Omit<Expense, "id" | "created_at">): Expense {
    const newExp: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.data.expenses.unshift(newExp);
    return newExp;
  }

  // Customers
  getCustomers(): Customer[] {
    return this.data.customers;
  }

  addCustomer(customer: Omit<Customer, "id" | "created_at">): Customer {
    const newCust: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
      created_at: new Date().toISOString(),
      outstanding_balance: 0,
    };
    this.data.customers.push(newCust);
    return newCust;
  }

  recordCustomerPayment(customerId: string, amount: number, method: PaymentMethod): boolean {
    const customer = this.data.customers.find((c) => c.id === customerId);
    if (!customer) return false;

    customer.outstanding_balance = Math.max(0, (customer.outstanding_balance || 0) - amount);

    this.data.ledger.unshift({
      id: `led_${Date.now()}`,
      customer_id: customerId,
      transaction_type: "payment_credit",
      amount,
      description: `Payment received via ${method.toUpperCase()}`,
      created_at: new Date().toISOString(),
    });

    return true;
  }

  // Settings
  getSettings(): ShopSettings {
    return this.data.settings;
  }

  updateSettings(settings: Partial<ShopSettings>): ShopSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
      updated_at: new Date().toISOString(),
    };
    return this.data.settings;
  }

  // Profiles / Staff
  getProfiles(): Profile[] {
    return this.data.profiles;
  }

  addStaff(staff: Omit<Profile, "id" | "created_at">): Profile {
    const newStaff: Profile = {
      ...staff,
      id: `usr_staff_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.data.profiles.push(newStaff);
    return newStaff;
  }
}

// Global singleton to survive Next.js module reloads in dev
const globalForStore = globalThis as unknown as { mockStoreInstance?: Store };
export const mockStore = globalForStore.mockStoreInstance || new Store();
if (process.env.NODE_ENV !== "production") {
  globalForStore.mockStoreInstance = mockStore;
}
