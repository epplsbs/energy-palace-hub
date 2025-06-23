
-- Create table for charging stations
CREATE TABLE public.charging_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  power TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance')),
  connector TEXT NOT NULL,
  estimated_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for restaurant menu categories
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for restaurant menu items
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for gallery items
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for reservations
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for employees
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  specialties TEXT[], -- Array of specialties
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL, -- Store ordered items as JSON
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample data for charging stations
INSERT INTO public.charging_stations (station_id, type, power, status, connector, estimated_time) VALUES
('CCS2-01', 'CCS2', '60KW', 'available', 'CCS2', NULL),
('CCS2-02', 'CCS2', '60KW', 'occupied', 'CCS2', '25 min'),
('GBT-01', 'GBT', '80KW', 'available', 'GBT', NULL),
('GBT-02', 'GBT', '80KW', 'maintenance', 'GBT', NULL);

-- Insert sample data for menu categories
INSERT INTO public.menu_categories (name, description, display_order) VALUES
('Coffee & Beverages', 'Fresh brewed coffee and refreshing drinks', 1),
('Breakfast', 'Start your day with our delicious breakfast options', 2),
('Main Course', 'Hearty meals to fuel your journey', 3),
('Desserts', 'Sweet treats to complete your meal', 4);

-- Insert sample data for menu items
INSERT INTO public.menu_items (category_id, name, description, price, display_order) VALUES
((SELECT id FROM public.menu_categories WHERE name = 'Coffee & Beverages'), 'Espresso', 'Rich and bold espresso shot', 3.50, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Coffee & Beverages'), 'Cappuccino', 'Classic cappuccino with steamed milk', 4.50, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Coffee & Beverages'), 'Fresh Orange Juice', 'Freshly squeezed orange juice', 5.00, 3),
((SELECT id FROM public.menu_categories WHERE name = 'Breakfast'), 'Energy Bowl', 'Quinoa, fruits, nuts and honey', 12.50, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Breakfast'), 'Avocado Toast', 'Multigrain bread with fresh avocado', 9.50, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Main Course'), 'Grilled Chicken Salad', 'Fresh greens with grilled chicken', 14.50, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Main Course'), 'Pasta Primavera', 'Fresh vegetables with pasta', 13.00, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Desserts'), 'Chocolate Brownie', 'Rich chocolate brownie with ice cream', 7.50, 1);

-- Insert sample data for employees
INSERT INTO public.employees (name, designation, bio, image_url, specialties, display_order) VALUES
('Sarah Johnson', 'General Manager', 'With over 10 years in hospitality management, Sarah leads our team with passion for excellence.', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face', ARRAY['Leadership', 'Operations', 'Customer Service'], 1),
('Michael Chen', 'Head Chef', 'Michael brings 15 years of culinary expertise, crafting exceptional meals for our guests.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', ARRAY['Culinary Arts', 'Menu Development', 'Sustainability'], 2),
('Emily Rodriguez', 'EV Technical Specialist', 'Emily ensures our charging infrastructure operates at peak performance 24/7.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', ARRAY['EV Technology', 'Electrical Systems', 'Innovation'], 3),
('David Kim', 'Customer Experience Manager', 'David focuses on creating memorable experiences for every guest who visits Energy Palace.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face', ARRAY['Customer Relations', 'Service Excellence', 'Process Improvement'], 4);

-- Insert sample gallery items
INSERT INTO public.gallery_items (title, description, image_url, display_order) VALUES
('Modern Charging Station', 'State-of-the-art EV charging infrastructure', 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop', 1),
('Restaurant Interior', 'Comfortable dining space with modern amenities', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 2),
('Coffee Bar', 'Premium coffee and beverage station', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop', 3),
('Outdoor Seating', 'Relaxing outdoor dining area', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 4);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (for website visitors)
CREATE POLICY "Public read access for charging stations" ON public.charging_stations FOR SELECT USING (true);
CREATE POLICY "Public read access for menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read access for employees" ON public.employees FOR SELECT USING (true);

-- Allow public to insert reservations and orders
CREATE POLICY "Allow public to create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users (admin access)
-- Note: We'll set up admin authentication later
CREATE POLICY "Admin full access to charging stations" ON public.charging_stations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to menu categories" ON public.menu_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to menu items" ON public.menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to gallery items" ON public.gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to reservations" ON public.reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to employees" ON public.employees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
