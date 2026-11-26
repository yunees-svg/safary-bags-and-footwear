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
