
-- 1. Remove overly broad contacts storage policies (any authenticated user could overwrite/delete photos)
DROP POLICY IF EXISTS "Allow authenticated users to upload contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update contact photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete contact photos" ON storage.objects;

-- 2. Add explicit staff SELECT policies for tables that lacked them
CREATE POLICY "Staff can view reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (public.is_pos_staff());

CREATE POLICY "Staff can view orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_pos_staff());

CREATE POLICY "Staff can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

CREATE POLICY "Staff can update reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

-- 3. Fix mutable search_path on remaining function
CREATE OR REPLACE FUNCTION public.sync_gallery_to_blog()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  RETURN NEW;
END;
$function$;

-- 4. Switch SECURITY DEFINER view to invoker semantics so RLS of the caller applies
ALTER VIEW public.charging_order_availability SET (security_invoker = true);
