
-- 1. Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_title TEXT,
    customer_email TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Enable RLS on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for testimonials
CREATE POLICY "Allow public read access to active testimonials"
ON public.testimonials FOR SELECT
USING (is_active = true);

CREATE POLICY "Staff can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

-- 4. Fix RLS for about_us (re-add management policies dropped in previous migration)
CREATE POLICY "Staff can manage about_us"
ON public.about_us
FOR ALL
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

-- 5. Fix RLS for pos_settings (re-add management policies dropped in previous migration)
CREATE POLICY "Staff can manage pos_settings"
ON public.pos_settings
FOR ALL
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

-- 6. Ensure RLS for menu_items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'menu_items' AND policyname = 'Staff can manage menu_items'
    ) THEN
        CREATE POLICY "Staff can manage menu_items"
        ON public.menu_items
        FOR ALL
        TO authenticated
        USING (public.is_pos_staff())
        WITH CHECK (public.is_pos_staff());
    END IF;
END $$;

-- 7. Ensure RLS for menu_categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'menu_categories' AND policyname = 'Staff can manage menu_categories'
    ) THEN
        CREATE POLICY "Staff can manage menu_categories"
        ON public.menu_categories
        FOR ALL
        TO authenticated
        USING (public.is_pos_staff())
        WITH CHECK (public.is_pos_staff());
    END IF;
END $$;

-- 8. Ensure RLS for contacts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contacts' AND policyname = 'Staff can manage contacts'
    ) THEN
        CREATE POLICY "Staff can manage contacts"
        ON public.contacts
        FOR ALL
        TO authenticated
        USING (public.is_pos_staff())
        WITH CHECK (public.is_pos_staff());
    END IF;
END $$;

-- 9. Ensure RLS for gallery_items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'gallery_items' AND policyname = 'Staff can manage gallery_items'
    ) THEN
        CREATE POLICY "Staff can manage gallery_items"
        ON public.gallery_items
        FOR ALL
        TO authenticated
        USING (public.is_pos_staff())
        WITH CHECK (public.is_pos_staff());
    END IF;
END $$;

-- 10. Ensure RLS for employees
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'employees' AND policyname = 'Staff can manage employees'
    ) THEN
        CREATE POLICY "Staff can manage employees"
        ON public.employees
        FOR ALL
        TO authenticated
        USING (public.is_pos_staff())
        WITH CHECK (public.is_pos_staff());
    END IF;
END $$;
