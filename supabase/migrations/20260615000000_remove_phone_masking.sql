
-- Remove phone masking from public support partners view
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
  phone -- Return full phone number as requested
FROM public.drivers
WHERE is_public = true AND status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.public_support_partners TO anon, authenticated;
