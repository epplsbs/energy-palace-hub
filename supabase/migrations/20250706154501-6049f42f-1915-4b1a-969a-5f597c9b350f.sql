-- Add location fields to business settings
INSERT INTO pos_settings (setting_key, setting_value, description, setting_type) VALUES
  ('business_latitude', '27.7172', 'Business location latitude', 'text'),
  ('business_longitude', '85.3240', 'Business location longitude', 'text'),
  ('business_location_name', 'Kathmandu, Nepal', 'Business location display name', 'text')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();

-- Create charger reservations table
CREATE TABLE IF NOT EXISTS charger_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  charging_station_id UUID REFERENCES charging_stations(id),
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on charger_reservations
ALTER TABLE charger_reservations ENABLE ROW LEVEL SECURITY;

-- Allow public to create reservations
CREATE POLICY "Allow public to create charger reservations" ON charger_reservations
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all reservations
CREATE POLICY "Allow authenticated users to view charger reservations" ON charger_reservations
  FOR SELECT USING (true);

-- Allow authenticated users to update reservations
CREATE POLICY "Allow authenticated users to update charger reservations" ON charger_reservations
  FOR UPDATE USING (true);

-- Allow authenticated users to delete reservations
CREATE POLICY "Allow authenticated users to delete charger reservations" ON charger_reservations
  FOR DELETE USING (true);