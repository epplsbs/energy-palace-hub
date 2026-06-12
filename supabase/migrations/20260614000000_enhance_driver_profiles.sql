
-- Enhance drivers table with description and multiple vehicle photos
ALTER TABLE public.drivers
ADD COLUMN description TEXT,
ADD COLUMN vehicle_photo_urls TEXT[] DEFAULT '{}';

-- Create or update public view for support partners
-- This view provides masked phone numbers and only shows approved, public drivers
CREATE OR REPLACE VIEW public.public_support_partners AS
SELECT
  id,
  full_name,
  driver_photo_url,
  vehicle_photo_url,
  vehicle_photo_urls,
  vehicle_number,
  description,
  tier,
  -- Mask phone: e.g., 984****123
  CASE
    WHEN length(phone) >= 7 THEN
      substring(phone from 1 for 3) || '****' || substring(phone from length(phone)-2)
    ELSE '****' || substring(phone from length(phone)-2)
  END as masked_phone
FROM public.drivers
WHERE is_public = true AND status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.public_support_partners TO anon, authenticated;
