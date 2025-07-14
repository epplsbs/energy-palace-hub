-- Create table for about us content
CREATE TABLE public.about_us (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_story TEXT,
  mission_statement TEXT,
  vision_statement TEXT,
  values JSONB DEFAULT '[]'::jsonb, -- Array of {title, description} objects
  team_description TEXT,
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  customer_email TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for contacts
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for about_us" ON public.about_us FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access for contacts" ON public.contacts FOR SELECT USING (true);

-- Create policies for authenticated users (admin access)
CREATE POLICY "Admin full access to about_us" ON public.about_us FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to contacts" ON public.contacts FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample about us content
INSERT INTO public.about_us (title, company_story, mission_statement, vision_statement, values, team_description, hero_image_url, display_order) VALUES
(
  'About Energy Palace',
  'Energy Palace was founded with a vision to create the perfect pit stop for electric vehicle travelers. We understand that charging your EV should be more than just plugging in - it should be a comfortable, enjoyable experience. Our state-of-the-art facility combines fast charging technology with exceptional dining and hospitality.',
  'To provide electric vehicle travelers with a premium charging experience, combining cutting-edge technology with exceptional hospitality and sustainable practices.',
  'To become the leading network of EV charging destinations, setting the standard for comfort, sustainability, and innovation in electric mobility.',
  '[
    {
      "title": "Sustainability", 
      "description": "We are committed to environmental responsibility and supporting the transition to clean energy."
    },
    {
      "title": "Innovation", 
      "description": "We continuously invest in the latest charging technology and customer experience improvements."
    },
    {
      "title": "Excellence", 
      "description": "We strive to exceed expectations in every aspect of our service."
    },
    {
      "title": "Community", 
      "description": "We believe in building connections and supporting the EV community."
    }
  ]'::jsonb,
  'Our dedicated team of professionals is passionate about sustainable transportation and exceptional customer service. From our technical specialists who maintain our charging infrastructure to our culinary team that crafts delicious meals, every team member is committed to making your visit memorable.',
  'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200&h=600&fit=crop',
  1
);

-- Insert sample testimonials
INSERT INTO public.testimonials (customer_name, customer_title, content, rating, display_order) VALUES
('Sarah Mitchell', 'Tesla Model 3 Owner', 'Energy Palace has completely changed my road trip experience! The charging is fast, the food is excellent, and the staff is incredibly friendly. This is how all charging stations should be.', 5, 1),
('Michael Rodriguez', 'EV Enthusiast', 'I stop here every week during my commute. The charging infrastructure is top-notch and the coffee is the best in town. Highly recommend to any EV driver!', 5, 2),
('Emma Thompson', 'Business Traveler', 'Perfect location for a quick charge and meal. The restaurant atmosphere is welcoming and the charging bays are always clean and well-maintained.', 4, 3),
('David Chen', 'Local Resident', 'Energy Palace has become our go-to spot for family dinners. The kids love the environment and we appreciate supporting a business that cares about sustainability.', 5, 4);

-- Insert sample contacts
INSERT INTO public.contacts (name, email, phone, position, department, display_order) VALUES
('General Information', 'info@energypalace.com', '+1 (555) 123-4567', 'Main Contact', 'General', 1),
('Reservations', 'reservations@energypalace.com', '+1 (555) 123-4568', 'Reservations Manager', 'Restaurant', 2),
('Charging Support', 'charging@energypalace.com', '+1 (555) 123-4569', 'Technical Support', 'Charging', 3),
('Business Partnerships', 'partnerships@energypalace.com', '+1 (555) 123-4570', 'Partnership Manager', 'Business Development', 4);
