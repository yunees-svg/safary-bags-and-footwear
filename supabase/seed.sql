-- Seed data for initial Slipper Shop operations

-- 1. Initial Shop Settings
INSERT INTO shop_settings (id, shop_name, logo_url, address, phone, whatsapp_number, currency, opening_hours, tax_rate, bill_prefix, low_stock_default)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Safary Bags and Footwear',
    '/images/shop-logo.png',
    'Shop No. 4, Ground Floor, Central Retail Arcade, Main Market, MG Road',
    '+91 98765 43210',
    '+91 98765 43210',
    'INR',
    'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 7:00 PM',
    0.00,
    'SAFARY-',
    5
) ON CONFLICT (id) DO NOTHING;

-- 2. Initial Categories
INSERT INTO categories (id, name, slug, description, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Men''s Slippers', 'mens-slippers', 'Durable, stylish and comfortable slippers for daily and outdoor wear', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'Women''s Slippers', 'womens-slippers', 'Chic slides, lightweight flip-flops and plush indoor slippers for women', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'Kids'' Slippers', 'kids-slippers', 'Colourful, soft, anti-slip slippers crafted for children of all ages', TRUE),
    ('44444444-4444-4444-4444-444444444444', 'Orthopedic & Comfort', 'ortho-comfort', 'Special high-density memory foam and acupressure soles for foot support', TRUE),
    ('55555555-5555-5555-5555-555555555555', 'Casual Slides', 'casual-slides', 'Trendy slip-on sliders for pool, casual strolls, and relaxing at home', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Suppliers
INSERT INTO suppliers (id, name, phone, address)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Metro Footwear Wholesalers', '+91 98111 22233', 'Plot 45, Leather & Rubber Industrial Area, Agra'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Zenith Comfort Polymers', '+91 98444 55566', 'Survey 12, Footwear Hub, Calicut, Kerala')
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Sample Products
INSERT INTO products (id, category_id, product_code, name, brand, description, selling_price, cost_price, is_published)
VALUES
    (
        'a1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'MS-CL-101',
        'Apex Men Classic Grip Slide',
        'Apex Soles',
        'Ergonomic slip-on with textured anti-slip sole and water-resistant cushioned strap.',
        399.00,
        220.00,
        TRUE
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'WS-FL-204',
        'Luxe Cloud Women Pillow Slide',
        'SoftWalk',
        'Ultra-light pillow slide with 3.5cm thick cushioned EVA foam footbed.',
        499.00,
        270.00,
        TRUE
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        'OR-MD-305',
        'Dr. Care Orthopedic Therapy Slipper',
        'Dr. Care',
        'Doctor recommended therapeutic footbed with arch contouring and heel cup relief.',
        699.00,
        380.00,
        TRUE
    ),
    (
        'd4444444-4444-4444-4444-444444444444',
        '33333333-3333-3333-3333-333333333333',
        'KD-CH-402',
        'Dino-Pals Kids Cartoon Flip-Flop',
        'PlayStep',
        'Fun dinosaur themed flip-flops with elastic backstrap for toddlers and secure grip.',
        299.00,
        150.00,
        TRUE
    )
ON CONFLICT (id) DO NOTHING;

-- 5. Product Variants (Color, Size, Stock)
INSERT INTO product_variants (id, product_id, colour, size, sku, stock_quantity, low_stock_threshold)
VALUES
    -- Apex Men Classic (Black & Navy)
    ('e0000101-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Black', '7', 'MS-CL-101-BLK-7', 12, 4),
    ('e0000101-0000-0000-0000-000000000002', 'a1111111-1111-1111-1111-111111111111', 'Black', '8', 'MS-CL-101-BLK-8', 15, 4),
    ('e0000101-0000-0000-0000-000000000003', 'a1111111-1111-1111-1111-111111111111', 'Black', '9', 'MS-CL-101-BLK-9', 8, 4),
    ('e0000101-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'Navy Blue', '8', 'MS-CL-101-NVY-8', 6, 4),
    ('e0000101-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'Navy Blue', '9', 'MS-CL-101-NVY-9', 2, 4), -- Low stock alert!

    -- Luxe Cloud Women (Beige & Pink)
    ('e0000204-0000-0000-0000-000000000001', 'b2222222-2222-2222-2222-222222222222', 'Beige', '5', 'WS-FL-204-BGE-5', 10, 3),
    ('e0000204-0000-0000-0000-000000000002', 'b2222222-2222-2222-2222-222222222222', 'Beige', '6', 'WS-FL-204-BGE-6', 14, 3),
    ('e0000204-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'Pastel Pink', '6', 'WS-FL-204-PNK-6', 9, 3),
    ('e0000204-0000-0000-0000-000000000004', 'b2222222-2222-2222-2222-222222222222', 'Pastel Pink', '7', 'WS-FL-204-PNK-7', 3, 3),

    -- Dr. Care Orthopedic (Brown & Black)
    ('e0000305-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333', 'Dark Brown', '7', 'OR-MD-305-BRN-7', 7, 3),
    ('e0000305-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333', 'Dark Brown', '8', 'OR-MD-305-BRN-8', 11, 3),
    ('e0000305-0000-0000-0000-000000000003', 'c3333333-3333-3333-3333-333333333333', 'Jet Black', '8', 'OR-MD-305-BLK-8', 1, 3), -- Low stock alert!

    -- Dino-Pals Kids (Sky Blue & Lime)
    ('e0000402-0000-0000-0000-000000000001', 'd4444444-4444-4444-4444-444444444444', 'Sky Blue', '12 (Kids)', 'KD-CH-402-BLU-12', 8, 3),
    ('e0000402-0000-0000-0000-000000000002', 'd4444444-4444-4444-4444-444444444444', 'Lime Green', '13 (Kids)', 'KD-CH-402-LME-13', 6, 3)
ON CONFLICT (id) DO NOTHING;

-- 6. Initial Sample Customers
INSERT INTO customers (id, name, phone, address)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Rahul Sharma', '+91 98234 56789', 'House 12, Green Park Colony'),
    ('c2222222-2222-2222-2222-222222222222', 'Priya Patel', '+91 97345 67890', 'Flat 402, Surya Heights')
ON CONFLICT (id) DO NOTHING;
