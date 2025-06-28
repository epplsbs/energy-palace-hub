
-- Create storage bucket for menu item images
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-items', 'menu-items', true);

-- Create storage bucket for contact photos  
INSERT INTO storage.buckets (id, name, public) VALUES ('contacts', 'contacts', true);

-- Create policies for menu-items bucket
CREATE POLICY "Allow public access to menu item images" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-items');

CREATE POLICY "Allow authenticated users to upload menu item images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'menu-items' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update menu item images" ON storage.objects
FOR UPDATE USING (bucket_id = 'menu-items' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete menu item images" ON storage.objects
FOR DELETE USING (bucket_id = 'menu-items' AND auth.role() = 'authenticated');

-- Create policies for contacts bucket
CREATE POLICY "Allow public access to contact photos" ON storage.objects
FOR SELECT USING (bucket_id = 'contacts');

CREATE POLICY "Allow authenticated users to upload contact photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'contacts' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'contacts' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete contact photos" ON storage.objects
FOR DELETE USING (bucket_id = 'contacts' AND auth.role() = 'authenticated');

-- Create about_us table for managing About Us content
CREATE TABLE public.about_us (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'About Energy Palace',
  company_story TEXT,
  mission_statement TEXT,
  vision_statement TEXT,
  values JSONB DEFAULT '[]'::jsonb,
  team_description TEXT,
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default about us content
INSERT INTO public.about_us (title, company_story, mission_statement, vision_statement, values, team_description) VALUES (
  'About Energy Palace',
  'Energy Palace was born from a vision to revolutionize the EV charging experience. We recognized that charging your electric vehicle shouldn''t be just about plugging in – it should be an opportunity to relax, recharge yourself, and enjoy premium amenities. Founded in 2024, we''ve combined cutting-edge charging technology with exceptional hospitality to create a destination that serves both your vehicle and your well-being.',
  'To accelerate the adoption of sustainable transportation by providing world-class EV charging infrastructure paired with exceptional hospitality experiences. We believe that the future of travel should be both environmentally responsible and genuinely enjoyable.',
  'To become the leading destination for electric vehicle charging and premium hospitality services, setting new standards for customer experience in the sustainable transportation industry.',
  '[{"title": "Innovation", "description": "Leading the way in sustainable energy solutions and hospitality excellence"}, {"title": "Sustainability", "description": "Committed to environmental responsibility and green energy practices"}, {"title": "Community", "description": "Building connections and supporting the EV community"}, {"title": "Excellence", "description": "Delivering exceptional service and premium experiences"}]'::jsonb,
  'Our dedicated professionals are committed to providing exceptional service and expertise in both electric vehicle charging and hospitality services.'
);

-- Add RLS policy for about_us
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to about_us" ON public.about_us
FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage about_us" ON public.about_us
FOR ALL USING (auth.role() = 'authenticated');
