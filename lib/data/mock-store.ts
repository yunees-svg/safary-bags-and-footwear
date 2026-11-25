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
    full_name: "Jimmy Sharma (Owner)",
    email: "owner@safary.com",
    role: "owner",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "usr_staff_01",
    full_name: "Vikram Sen (Counter Staff)",
    email: "staff@safary.com",
    role: "staff",
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

const initialProducts: Product[] = [
  {
    id: "prod_1",
    category_id: "cat_1",
    product_code: "MS-CL-101",
    name: "Apex Men Classic Grip Slide",
    brand: "Apex Soles",
    description: "Ergonomic slip-on with textured anti-slip sole and water-resistant cushioned strap.",
    selling_price: 399.0,
    cost_price: 220.0,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "prod_2",
    category_id: "cat_2",
    product_code: "WS-FL-204",
    name: "Luxe Cloud Women Pillow Slide",
    brand: "SoftWalk",
    description: "Ultra-light pillow slide with 3.5cm thick cushioned EVA foam footbed.",
    selling_price: 499.0,
    cost_price: 270.0,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "prod_3",
    category_id: "cat_4",
    product_code: "OR-MD-305",
    name: "Dr. Care Orthopedic Therapy Slipper",
    brand: "Dr. Care",
    description: "Doctor recommended therapeutic footbed with arch contouring and heel cup relief.",
    selling_price: 699.0,
    cost_price: 380.0,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "prod_4",
    category_id: "cat_3",
    product_code: "KD-CH-402",
    name: "Dino-Pals Kids Cartoon Flip-Flop",
    brand: "PlayStep",
    description: "Fun dinosaur themed flip-flops with elastic backstrap for toddlers and secure grip.",
    selling_price: 299.0,
    cost_price: 150.0,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "prod_5",
    category_id: "cat_6",
    product_code: "SF-BG-501",
    name: "Safary Trekker Multi-Pocket Backpack",
    brand: "Safary Gear",
    description: "Heavy-duty 35L waterproof backpack with cushioned laptop sleeve and ergonomic lumbar strap.",
    selling_price: 999.0,
    cost_price: 550.0,
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const initialVariants: ProductVariant[] = [
  // Apex Men Classic
  { id: "var_101_1", product_id: "prod_1", colour: "Black", size: "7", sku: "MS-CL-101-BLK-7", stock_quantity: 12, low_stock_threshold: 4 },
  { id: "var_101_2", product_id: "prod_1", colour: "Black", size: "8", sku: "MS-CL-101-BLK-8", stock_quantity: 15, low_stock_threshold: 4 },
  { id: "var_101_3", product_id: "prod_1", colour: "Black", size: "9", sku: "MS-CL-101-BLK-9", stock_quantity: 8, low_stock_threshold: 4 },
  { id: "var_101_4", product_id: "prod_1", colour: "Navy Blue", size: "8", sku: "MS-CL-101-NVY-8", stock_quantity: 6, low_stock_threshold: 4 },
  { id: "var_101_5", product_id: "prod_1", colour: "Navy Blue", size: "9", sku: "MS-CL-101-NVY-9", stock_quantity: 2, low_stock_threshold: 4 },

  // Luxe Cloud Women
  { id: "var_204_1", product_id: "prod_2", colour: "Beige", size: "5", sku: "WS-FL-204-BGE-5", stock_quantity: 10, low_stock_threshold: 3 },
  { id: "var_204_2", product_id: "prod_2", colour: "Beige", size: "6", sku: "WS-FL-204-BGE-6", stock_quantity: 14, low_stock_threshold: 3 },
  { id: "var_204_3", product_id: "prod_2", colour: "Pastel Pink", size: "6", sku: "WS-FL-204-PNK-6", stock_quantity: 9, low_stock_threshold: 3 },
  { id: "var_204_4", product_id: "prod_2", colour: "Pastel Pink", size: "7", sku: "WS-FL-204-PNK-7", stock_quantity: 3, low_stock_threshold: 3 },

  // Dr. Care Orthopedic
  { id: "var_305_1", product_id: "prod_3", colour: "Dark Brown", size: "7", sku: "OR-MD-305-BRN-7", stock_quantity: 7, low_stock_threshold: 3 },
  { id: "var_305_2", product_id: "prod_3", colour: "Dark Brown", size: "8", sku: "OR-MD-305-BRN-8", stock_quantity: 11, low_stock_threshold: 3 },
  { id: "var_305_3", product_id: "prod_3", colour: "Jet Black", size: "8", sku: "OR-MD-305-BLK-8", stock_quantity: 1, low_stock_threshold: 3 },

  // Dino-Pals Kids
  { id: "var_402_1", product_id: "prod_4", colour: "Sky Blue", size: "12 (Kids)", sku: "KD-CH-402-BLU-12", stock_quantity: 8, low_stock_threshold: 3 },
  { id: "var_402_2", product_id: "prod_4", colour: "Lime Green", size: "13 (Kids)", sku: "KD-CH-402-LME-13", stock_quantity: 6, low_stock_threshold: 3 },

  // Safary Trekker Backpack
  { id: "var_501_1", product_id: "prod_5", colour: "Matte Black", size: "35L", sku: "SF-BG-501-BLK-35L", stock_quantity: 8, low_stock_threshold: 2 },
  { id: "var_501_2", product_id: "prod_5", colour: "Navy Blue", size: "35L", sku: "SF-BG-501-NVY-35L", stock_quantity: 5, low_stock_threshold: 2 },
  { id: "var_501_3", product_id: "prod_5", colour: "Olive Green", size: "35L", sku: "SF-BG-501-OLV-35L", stock_quantity: 4, low_stock_threshold: 2 },
];

const initialSuppliers: Supplier[] = [
  { id: "sup_1", name: "Metro Footwear Wholesalers", phone: "+91 98111 22233", address: "Plot 45, Industrial Footwear Zone, Agra", created_at: new Date().toISOString() },
  { id: "sup_2", name: "Zenith Comfort Polymers", phone: "+91 98444 55566", address: "Survey 12, Calicut Footwear Hub, Kerala", created_at: new Date().toISOString() },
];

const initialCustomers: Customer[] = [
  { id: "cust_1", name: "Rahul Sharma", phone: "9823456789", address: "House 12, Green Park", created_at: new Date().toISOString(), outstanding_balance: 0 },
  { id: "cust_2", name: "Priya Patel", phone: "9734567890", address: "Flat 402, Surya Heights", created_at: new Date().toISOString(), outstanding_balance: 350 },
  { id: "cust_3", name: "Anand Verma", phone: "9612345678", address: "Sector 14, Main Road", created_at: new Date().toISOString(), outstanding_balance: 0 },
];

const initialBills: Bill[] = [
  {
    id: "bill_1",
    bill_number: "SLIP-20261125-0001",
    customer_id: "cust_1",
    subtotal: 798.0,
    discount: 50.0,
    tax_amount: 0.0,
    total_amount: 748.0,
    payment_status: "paid",
    bill_status: "completed",
    created_by: "usr_owner_01",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    items: [
      {
        id: "bi_1",
        bill_id: "bill_1",
        variant_id: "var_101_2",
        product_name_snapshot: "Apex Men Classic Grip Slide",
        colour_snapshot: "Black",
        size_snapshot: "8",
        quantity: 2,
        unit_price: 399.0,
        unit_cost_snapshot: 220.0,
        subtotal: 798.0,
      },
    ],
    payments: [
      {
        id: "pay_1",
        bill_id: "bill_1",
        payment_method: "upi",
        amount: 748.0,
        payment_date: new Date(Date.now() - 3600000 * 3).toISOString(),
        reference_number: "UPI-4819283719",
      },
    ],
  },
  {
    id: "bill_2",
    bill_number: "SLIP-20261125-0002",
    customer_id: "cust_2",
    subtotal: 499.0,
    discount: 0.0,
    tax_amount: 0.0,
    total_amount: 499.0,
    payment_status: "partial",
    bill_status: "completed",
    created_by: "usr_staff_01",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    items: [
      {
        id: "bi_2",
        bill_id: "bill_2",
        variant_id: "var_204_2",
        product_name_snapshot: "Luxe Cloud Women Pillow Slide",
        colour_snapshot: "Beige",
        size_snapshot: "6",
        quantity: 1,
        unit_price: 499.0,
        unit_cost_snapshot: 270.0,
        subtotal: 499.0,
      },
    ],
    payments: [
      {
        id: "pay_2",
        bill_id: "bill_2",
        payment_method: "cash",
        amount: 149.0,
        payment_date: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ],
  },
];

const initialStockMovements: StockMovement[] = [
  {
    id: "sm_1",
    variant_id: "var_101_2",
    movement_type: "sale",
    quantity: -2,
    reference_type: "bill",
    reference_id: "bill_1",
    reason: "Sale Bill SLIP-20261125-0001",
    created_by: "usr_owner_01",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "sm_2",
    variant_id: "var_204_2",
    movement_type: "sale",
    quantity: -1,
    reference_type: "bill",
    reference_id: "bill_2",
    reason: "Sale Bill SLIP-20261125-0002",
    created_by: "usr_staff_01",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

const initialExpenses: Expense[] = [
  {
    id: "exp_1",
    category: "Electricity",
    amount: 1850.0,
    description: "Shop air cooler & lighting bill for current month",
    payment_method: "upi",
    expense_date: new Date().toISOString().split("T")[0],
    created_by: "usr_owner_01",
    created_at: new Date().toISOString(),
  },
  {
    id: "exp_2",
    category: "Tea & Refreshments",
    amount: 120.0,
    description: "Daily tea and water jar for shop staff",
    payment_method: "cash",
    expense_date: new Date().toISOString().split("T")[0],
    created_by: "usr_staff_01",
    created_at: new Date().toISOString(),
  },
];

const initialEnquiries: Enquiry[] = [
  {
    id: "enq_1",
    customer_name: "Sunil Kumar",
    phone: "9812340987",
    variant_id: "var_101_5",
    message: "Interested in Apex Navy Blue Size 9. Please message when restocked.",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

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
