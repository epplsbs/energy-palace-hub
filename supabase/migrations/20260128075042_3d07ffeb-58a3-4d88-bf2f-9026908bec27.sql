-- Add DELETE policy for pos_charging_orders (for charging staff/admins)
CREATE POLICY "Charging staff can delete charging orders"
ON public.pos_charging_orders
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM pos_users
    WHERE pos_users.auth_user_id = auth.uid()
    AND pos_users.role IN ('admin', 'charging_staff')
    AND pos_users.is_active = true
  )
);

-- Add DELETE policy for orders table (for admins)
CREATE POLICY "Admin can delete orders"
ON public.orders
FOR DELETE
USING (get_current_user_pos_role() = 'admin');

-- Also ensure public can insert charging orders (website booking)
CREATE POLICY "Allow public to create charging bookings"
ON public.pos_charging_orders
FOR INSERT
WITH CHECK (true);