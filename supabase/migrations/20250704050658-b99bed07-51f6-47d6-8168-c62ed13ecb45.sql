-- Add logo_url to pos_settings
INSERT INTO pos_settings (setting_key, setting_value, description, setting_type)
VALUES ('logo_url', '', 'Website logo URL', 'text')
ON CONFLICT (setting_key) DO NOTHING;