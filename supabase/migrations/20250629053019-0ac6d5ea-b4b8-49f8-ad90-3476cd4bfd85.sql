
-- Fix RLS policies for pos_settings to allow public access for website settings
DROP POLICY IF EXISTS "Allow public read access" ON pos_settings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON pos_settings;

CREATE POLICY "Allow public read access" ON pos_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated updates" ON pos_settings
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated insert" ON pos_settings
  FOR INSERT WITH CHECK (true);

-- Fix RLS policies for pos_charging_orders to allow public booking
DROP POLICY IF EXISTS "Allow public insert" ON pos_charging_orders;
DROP POLICY IF EXISTS "Allow public read" ON pos_charging_orders;

CREATE POLICY "Allow public insert" ON pos_charging_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON pos_charging_orders
  FOR SELECT USING (true);

-- Fix RLS policies for about_us to allow public access
DROP POLICY IF EXISTS "Allow public read access" ON about_us;
DROP POLICY IF EXISTS "Allow authenticated updates" ON about_us;

CREATE POLICY "Allow public read access" ON about_us
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated updates" ON about_us
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated insert" ON about_us
  FOR INSERT WITH CHECK (true);
