-- Supabase PostgreSQL Schema for Slipper Shop Management System
-- Generated: 2026-11-25

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Staff & Owner)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'staff')) DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    product_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT 'In-House',
    description TEXT,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    cost_price NUMERIC(10, 2) NOT NULL CHECK (cost_price >= 0),
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS (Color, Size, Stock)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    colour TEXT NOT NULL,
    size TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    CONSTRAINT uq_product_colour_size UNIQUE(product_id, colour, size)
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- 6. SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PURCHASES
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    invoice_number TEXT NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    status TEXT NOT NULL CHECK (status IN ('draft', 'confirmed', 'cancelled')) DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PURCHASE ITEMS
CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost NUMERIC(10, 2) NOT NULL CHECK (unit_cost >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 9. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BILLS
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'partial', 'credit', 'refunded')) DEFAULT 'paid',
    bill_status TEXT NOT NULL CHECK (bill_status IN ('completed', 'cancelled', 'returned')) DEFAULT 'completed',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. BILL ITEMS (with price and cost snapshots for accurate historical reporting)
CREATE TABLE IF NOT EXISTS bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_name_snapshot TEXT NOT NULL,
    colour_snapshot TEXT NOT NULL,
    size_snapshot TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    unit_cost_snapshot NUMERIC(10, 2) NOT NULL CHECK (unit_cost_snapshot >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 12. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card', 'credit', 'split')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reference_number TEXT
);

-- 13. CUSTOMER LEDGER (for Credit tracking)
CREATE TABLE IF NOT EXISTS customer_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale_debit', 'payment_credit', 'return_credit', 'adjustment')),
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. STOCK MOVEMENTS (Auditable record of every single inventory change)
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('sale', 'purchase', 'return_restock', 'adjustment_in', 'adjustment_out', 'damage', 'theft')),
    quantity INTEGER NOT NULL, -- positive for stock addition, negative for stock reduction
    reference_type TEXT,
    reference_id UUID,
    reason TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. RETURNS
CREATE TABLE IF NOT EXISTS returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE RESTRICT,
    return_reason TEXT NOT NULL,
    refund_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
    return_status TEXT NOT NULL CHECK (return_status IN ('approved', 'rejected', 'completed')) DEFAULT 'completed',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. RETURN ITEMS
CREATE TABLE IF NOT EXISTS return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    bill_item_id UUID NOT NULL REFERENCES bill_items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    restock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (restock_quantity >= 0),
    refund_amount NUMERIC(10, 2) NOT NULL CHECK (refund_amount >= 0)
);

-- 17. EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('Rent', 'Electricity', 'Transport', 'Shop Maintenance', 'Tea & Refreshments', 'Staff Salary', 'Other')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card', 'credit', 'split')),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. ENQUIRIES (Offline / WhatsApp manual log)
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    message TEXT,
    status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'converted', 'cancelled')) DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. SHOP SETTINGS
CREATE TABLE IF NOT EXISTS shop_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_name TEXT NOT NULL DEFAULT 'Safary Bags and Footwear',
    logo_url TEXT,
    address TEXT NOT NULL DEFAULT '124 Market Street, Ground Floor, Central Bazaar',
    phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    whatsapp_number TEXT NOT NULL DEFAULT '+91 98765 43210',
    currency TEXT NOT NULL DEFAULT 'INR',
    opening_hours TEXT NOT NULL DEFAULT 'Mon-Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM',
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    bill_prefix TEXT NOT NULL DEFAULT 'SAFARY-',
    low_stock_default INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR HIGH-TRAFFIC LOOKUPS
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_bills_customer ON bills(customer_id);
CREATE INDEX IF NOT EXISTS idx_bills_number ON bills(bill_number);
CREATE INDEX IF NOT EXISTS idx_bill_items_bill ON bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_variant ON stock_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_customer_ledger_customer ON customer_ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ FOR CUSTOMER STOREFRONT
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view variants of published products" ON product_variants FOR SELECT
    USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND p.is_published = TRUE));
CREATE POLICY "Public can view product images" ON product_images FOR SELECT
    USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_images.product_id AND p.is_published = TRUE));
CREATE POLICY "Public can view shop settings" ON shop_settings FOR SELECT USING (TRUE);

-- AUTHENTICATED STAFF/OWNER POLICIES (Full CRUD for Shop Operations)
CREATE POLICY "Staff can manage categories" ON categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage products" ON products FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage variants" ON product_variants FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage product images" ON product_images FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage suppliers" ON suppliers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage purchases" ON purchases FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage purchase items" ON purchase_items FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage customers" ON customers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage bills" ON bills FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage bill items" ON bill_items FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage payments" ON payments FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage customer ledger" ON customer_ledger FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage stock movements" ON stock_movements FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage returns" ON returns FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage return items" ON return_items FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage expenses" ON expenses FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage enquiries" ON enquiries FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can view shop settings" ON shop_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Staff can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Staff can read profiles" ON profiles FOR SELECT TO authenticated USING (TRUE);

-- OWNER RESTRICTIONS: Only Owner can manage profiles & sensitive settings
CREATE POLICY "Owner can update shop settings" ON shop_settings FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'owner'));
CREATE POLICY "Owner can manage all profiles" ON profiles FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'owner'));
