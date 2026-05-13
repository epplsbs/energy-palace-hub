
-- Relax RLS policies to ensure authenticated users can manage content
-- This addresses the 403 errors encountered when updating from the admin page

-- 1. pos_settings
DROP POLICY IF EXISTS "Staff can manage pos_settings" ON public.pos_settings;
CREATE POLICY "Authenticated users can manage pos_settings"
ON public.pos_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. about_us
DROP POLICY IF EXISTS "Staff can manage about_us" ON public.about_us;
CREATE POLICY "Authenticated users can manage about_us"
ON public.about_us
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. testimonials
DROP POLICY IF EXISTS "Staff can manage testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. contacts
DROP POLICY IF EXISTS "Staff can manage contacts" ON public.contacts;
CREATE POLICY "Authenticated users can manage contacts"
ON public.contacts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. gallery_items
DROP POLICY IF EXISTS "Staff can manage gallery_items" ON public.gallery_items;
CREATE POLICY "Authenticated users can manage gallery_items"
ON public.gallery_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. menu_items
DROP POLICY IF EXISTS "Staff can manage menu_items" ON public.menu_items;
CREATE POLICY "Authenticated users can manage menu_items"
ON public.menu_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. menu_categories
DROP POLICY IF EXISTS "Staff can manage menu_categories" ON public.menu_categories;
CREATE POLICY "Authenticated users can manage menu_categories"
ON public.menu_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
