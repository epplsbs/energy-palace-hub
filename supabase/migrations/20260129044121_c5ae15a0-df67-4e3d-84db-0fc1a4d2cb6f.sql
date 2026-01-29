-- SECURITY FIX: Address multiple security vulnerabilities

-- 1. Ensure helper functions exist with proper security (recreate to ensure correct definition)
CREATE OR REPLACE FUNCTION public.get_current_user_pos_role()
RETURNS TEXT 
LANGUAGE sql 
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::TEXT FROM public.pos_users 
  WHERE auth_user_id = auth.uid() 
  AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_pos_staff()
RETURNS BOOLEAN 
LANGUAGE sql 
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND is_active = true
  );
$$;

-- 2. Fix pos_charging_orders - Remove public read access that exposes PII
DROP POLICY IF EXISTS "Allow public read" ON pos_charging_orders;

-- Create a view for public availability checking (no PII exposed)
CREATE OR REPLACE VIEW public.charging_order_availability AS
SELECT 
  charging_station_id,
  start_time,
  expected_end_time,
  status
FROM pos_charging_orders
WHERE status IN ('active', 'booked');

-- Grant public read on the view (safe - no PII)
GRANT SELECT ON public.charging_order_availability TO anon, authenticated;

-- 3. Fix pos_settings - Remove public read access to sensitive settings
DROP POLICY IF EXISTS "Allow public read access" ON pos_settings;

-- Create policy that filters out sensitive settings for public access
CREATE POLICY "Public read non-sensitive settings" 
ON pos_settings FOR SELECT 
USING (
  setting_key NOT IN (
    'email_smtp_host',
    'email_smtp_port',
    'email_smtp_user',
    'email_smtp_password',
    'email_from_address'
  )
  OR 
  EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  )
);

-- 4. Fix storage bucket policies - Restrict to admin/manager only
DROP POLICY IF EXISTS "Allow authenticated users to upload menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update menu item images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload contact images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete contact images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update contact images" ON storage.objects;

-- Menu-items bucket - Admin/Manager only for uploads
CREATE POLICY "Admins can upload menu images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'menu-items' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'manager')
    AND is_active = true
  )
);

CREATE POLICY "Admins can update menu images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'menu-items' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'manager')
    AND is_active = true
  )
);

CREATE POLICY "Admins can delete menu images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'menu-items' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  )
);

-- Contacts bucket - Admin only for uploads
CREATE POLICY "Admins can upload contact images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'contacts' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  )
);

CREATE POLICY "Admins can update contact images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'contacts' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  )
);

CREATE POLICY "Admins can delete contact images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'contacts' 
  AND EXISTS(
    SELECT 1 FROM public.pos_users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
    AND is_active = true
  )
);