
-- Drop existing view first to avoid column rename error
DROP VIEW IF EXISTS public.public_support_partners;

-- Add cover_photo_url to drivers
ALTER TABLE public.drivers
ADD COLUMN cover_photo_url TEXT;

-- Create driver_ratings table
CREATE TABLE public.driver_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create business_feedback table
CREATE TABLE public.business_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL, -- Can be manual entry or from profile
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  charging_rating INTEGER CHECK (charging_rating >= 1 AND charging_rating <= 5),
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recreate view with full phone number and cover photo
CREATE VIEW public.public_support_partners AS
SELECT
  id,
  full_name,
  driver_photo_url,
  cover_photo_url,
  vehicle_photo_url,
  vehicle_photo_urls,
  vehicle_number,
  description,
  tier,
  phone
FROM public.drivers
WHERE is_public = true AND status = 'approved';

-- Enable RLS
ALTER TABLE public.driver_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for driver_ratings
CREATE POLICY "Public can view driver ratings" ON public.driver_ratings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate drivers" ON public.driver_ratings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policies for business_feedback
CREATE POLICY "Admin can view business feedback" ON public.business_feedback
  FOR SELECT TO authenticated USING (public.is_pos_staff());

CREATE POLICY "Anyone can provide feedback" ON public.business_feedback
  FOR INSERT WITH CHECK (true);

-- Grants
GRANT SELECT ON public.public_support_partners TO anon, authenticated;
GRANT SELECT ON public.driver_ratings TO anon, authenticated;
GRANT INSERT ON public.driver_ratings TO authenticated;
GRANT SELECT ON public.business_feedback TO authenticated;
GRANT INSERT ON public.business_feedback TO anon, authenticated;
