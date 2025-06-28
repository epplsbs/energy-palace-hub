
-- Create contacts table for managing business contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SEO settings table
CREATE TABLE public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path VARCHAR(255) NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  robots_directives TEXT DEFAULT 'index,follow',
  schema_markup JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default SEO settings for main pages
INSERT INTO public.seo_settings (page_path, meta_title, meta_description, meta_keywords, og_title, og_description) VALUES
('/', 'Energy Palace - Premium EV Charging & Dining Experience in Nepal', 'Experience the future of EV charging with premium dining at Energy Palace. Fast charging stations, luxury amenities, and exceptional service in Kathmandu, Nepal.', 'EV charging, electric vehicle, Nepal, Kathmandu, dining, restaurant, fast charging, premium service', 'Energy Palace - Premium EV Charging & Dining', 'Experience the future of EV charging with premium dining at Energy Palace in Nepal.'),
('/blog', 'Energy Palace Blog - Latest News & Insights', 'Stay updated with the latest news, insights, and stories from Energy Palace. Learn about EV technology, sustainability, and premium dining experiences.', 'EV news, electric vehicle blog, sustainability, energy palace news', 'Energy Palace Blog', 'Latest news and insights from Energy Palace Nepal'),
('/contacts', 'Contact Energy Palace - Get in Touch', 'Contact Energy Palace for reservations, inquiries, or support. Find our location, phone numbers, and team contact information.', 'contact, energy palace contact, Nepal EV charging contact', 'Contact Energy Palace', 'Get in touch with Energy Palace for all your EV charging and dining needs');

-- Create AI content suggestions table
CREATE TABLE public.ai_content_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL, -- 'blog', 'seo', 'social'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  target_audience VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Insert sample contacts
INSERT INTO public.contacts (name, position, email, phone, department, display_order) VALUES
('Sujan Nepal', 'General Manager', 'sujan1nepal@gmail.com', '+977-1-4567890', 'Management', 1),
('Customer Service', 'Support Team', 'support@energypalace.com', '+977-1-4567891', 'Customer Service', 2),
('Reservations', 'Booking Team', 'reservations@energypalace.com', '+977-1-4567892', 'Reservations', 3),
('Technical Support', 'Charging Support', 'tech@energypalace.com', '+977-1-4567893', 'Technical', 4);

-- Update the orders table to include order source
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_source VARCHAR(50) DEFAULT 'website';

-- Create a function to sync gallery items with blog posts
CREATE OR REPLACE FUNCTION sync_gallery_to_blog()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to automatically create blog posts from gallery updates
  -- For now, we'll just log the change
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for gallery sync (optional, can be used later)
-- CREATE TRIGGER gallery_blog_sync_trigger
--   AFTER INSERT OR UPDATE ON public.gallery_items
--   FOR EACH ROW EXECUTE FUNCTION sync_gallery_to_blog();
