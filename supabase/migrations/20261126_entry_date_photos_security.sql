-- Run after 20261125_init_schema.sql

-- Date entered on the "Add Slipper Model" form
ALTER TABLE products ADD COLUMN IF NOT EXISTS entry_date DATE;

-- ROLE CHECKS
-- SECURITY DEFINER lets these read profiles without re-triggering its RLS policies.
-- The original "Owner can manage all profiles" policy queried profiles from inside
-- a profiles policy, which Postgres rejects as infinite recursion.
CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active);
$$;

CREATE OR REPLACE FUNCTION is_owner() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active AND role = 'owner');
$$;

-- The original policies gave every signed-in account full access.
-- Require an active staff or owner profile instead.
DO $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN
        SELECT policyname, tablename FROM pg_policies
        WHERE schemaname = 'public' AND policyname LIKE 'Staff can manage %'
    LOOP
        EXECUTE format('DROP POLICY %I ON %I', item.policyname, item.tablename);
        EXECUTE format(
            'CREATE POLICY %I ON %I FOR ALL TO authenticated USING (is_staff()) WITH CHECK (is_staff())',
            item.policyname, item.tablename
        );
    END LOOP;
END $$;

DROP POLICY IF EXISTS "Staff can view shop settings" ON shop_settings;
CREATE POLICY "Staff can view shop settings" ON shop_settings FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "Staff can view audit logs" ON audit_logs;
CREATE POLICY "Staff can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS "Owner can update shop settings" ON shop_settings;
CREATE POLICY "Owner can update shop settings" ON shop_settings FOR UPDATE TO authenticated
    USING (is_owner()) WITH CHECK (is_owner());

DROP POLICY IF EXISTS "Staff can read profiles" ON profiles;
CREATE POLICY "Staff can read profiles" ON profiles FOR SELECT TO authenticated
    USING (id = auth.uid() OR is_staff());

DROP POLICY IF EXISTS "Owner can manage all profiles" ON profiles;
CREATE POLICY "Owner can manage all profiles" ON profiles FOR ALL TO authenticated
    USING (is_owner()) WITH CHECK (is_owner());

-- Website visitors must not be able to read cost prices through the API
REVOKE SELECT ON products FROM anon;
GRANT SELECT (id, category_id, product_code, name, brand, description, selling_price,
    is_published, entry_date, created_at, updated_at) ON products TO anon;

-- PHOTO STORAGE: anyone can view, only staff can upload, change or delete
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-photos', 'product-photos', TRUE, 1048576, ARRAY['image/jpeg'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Staff can manage product photos" ON storage.objects;
CREATE POLICY "Staff can manage product photos" ON storage.objects FOR ALL TO authenticated
    USING (bucket_id = 'product-photos' AND public.is_staff())
    WITH CHECK (bucket_id = 'product-photos' AND public.is_staff());
