-- Add expected_end_time column to pos_charging_orders
ALTER TABLE pos_charging_orders 
ADD COLUMN expected_end_time timestamp with time zone;

-- Add logo_url to pos_settings
INSERT INTO pos_settings (setting_key, setting_value, description, setting_type)
VALUES ('logo_url', '', 'Website logo URL', 'text')
ON CONFLICT (setting_key) DO NOTHING;