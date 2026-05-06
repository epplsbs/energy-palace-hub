
-- about_us: drop overly permissive public write policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.about_us;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.about_us;

-- pos_settings: drop overly permissive public write policies
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.pos_settings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.pos_settings;

-- charger_reservations: replace public read/update/delete with staff-scoped policies
DROP POLICY IF EXISTS "Allow authenticated users to view charger reservations" ON public.charger_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to update charger reservations" ON public.charger_reservations;
DROP POLICY IF EXISTS "Allow authenticated users to delete charger reservations" ON public.charger_reservations;

CREATE POLICY "Staff can view charger reservations"
ON public.charger_reservations
FOR SELECT
TO authenticated
USING (public.is_pos_staff());

CREATE POLICY "Staff can update charger reservations"
ON public.charger_reservations
FOR UPDATE
TO authenticated
USING (public.is_pos_staff())
WITH CHECK (public.is_pos_staff());

CREATE POLICY "Admins can delete charger reservations"
ON public.charger_reservations
FOR DELETE
TO authenticated
USING (public.get_current_user_pos_role() = 'admin');

-- charging_stations: remove redundant policy that allowed any authenticated user full access
DROP POLICY IF EXISTS "Admin full access to charging stations" ON public.charging_stations;

-- pos_users: restrict SELECT to self; admins keep full access via separate policy
DROP POLICY IF EXISTS "POS users can view all users" ON public.pos_users;

CREATE POLICY "Users can view own pos_user record"
ON public.pos_users
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can view all pos_users"
ON public.pos_users
FOR SELECT
TO authenticated
USING (public.get_current_user_pos_role() = 'admin');
