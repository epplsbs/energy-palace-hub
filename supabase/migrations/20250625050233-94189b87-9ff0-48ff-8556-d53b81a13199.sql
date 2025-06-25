
-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'cashier', 'waiter', 'charging_staff', 'manager');

-- Create users table for POS system (separate from auth.users)
CREATE TABLE public.pos_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'cashier',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.pos_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menu categories table (enhanced)
CREATE TABLE public.pos_menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) DEFAULT 'food' CHECK (type IN ('food', 'drink', 'charging')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menu items table (enhanced for POS)
CREATE TABLE public.pos_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.pos_menu_categories(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 13.00,
  vat_inclusive BOOLEAN DEFAULT false,
  image_url TEXT,
  sku VARCHAR(50),
  stock_quantity INTEGER DEFAULT 0,
  track_stock BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table (enhanced for POS)
CREATE TABLE public.pos_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(100),
  order_type VARCHAR(20) DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeaway', 'delivery', 'charging')),
  table_number VARCHAR(10),
  cashier_id UUID REFERENCES public.pos_users(id),
  waiter_id UUID REFERENCES public.pos_users(id),
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  vat_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'qr', 'bank_transfer')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create order items table
CREATE TABLE public.pos_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.pos_orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.pos_menu_items(id),
  item_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  vat_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.pos_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_type VARCHAR(20) DEFAULT 'one_time' CHECK (expense_type IN ('one_time', 'recurring')),
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer')),
  receipt_number VARCHAR(50),
  vendor_name VARCHAR(100),
  created_by UUID REFERENCES public.pos_users(id),
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create deposits table
CREATE TABLE public.pos_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  deposit_method VARCHAR(20) DEFAULT 'cash' CHECK (deposit_method IN ('cash', 'bank_transfer', 'card')),
  description TEXT,
  reference_number VARCHAR(50),
  deposited_by UUID REFERENCES public.pos_users(id),
  deposit_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create charging orders table
CREATE TABLE public.pos_charging_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  vehicle_number VARCHAR(20),
  charging_station_id UUID REFERENCES public.charging_stations(id),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  units_consumed DECIMAL(8,2),
  rate_per_unit DECIMAL(6,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash',
  payment_status VARCHAR(20) DEFAULT 'pending',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.pos_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.pos_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json')),
  description TEXT,
  updated_by UUID REFERENCES public.pos_users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default settings
INSERT INTO public.pos_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'Energy Palace', 'text', 'Company name for receipts'),
('company_logo', '', 'text', 'Company logo URL'),
('vat_enabled', 'true', 'boolean', 'Enable VAT calculations'),
('default_vat_rate', '13.00', 'number', 'Default VAT rate percentage'),
('currency', 'Rs.', 'text', 'Currency symbol'),
('fiscal_year_start', '2024-04-01', 'text', 'Fiscal year start date'),
('receipt_footer', 'Thank you for visiting Energy Palace!', 'text', 'Footer text for receipts');

-- Enable RLS on all tables
ALTER TABLE public.pos_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_charging_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
-- POS Users policies
CREATE POLICY "POS users can view all users" ON public.pos_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can insert users" ON public.pos_users FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update users" ON public.pos_users FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Menu categories and items policies
CREATE POLICY "All authenticated users can view menu" ON public.pos_menu_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated users can view menu items" ON public.pos_menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage menu" ON public.pos_menu_categories FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager')));
CREATE POLICY "Admins and managers can manage menu items" ON public.pos_menu_items FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'manager')));

-- Orders policies
CREATE POLICY "All authenticated users can view orders" ON public.pos_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can create orders" ON public.pos_orders FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND is_active = true));
CREATE POLICY "Staff can update orders" ON public.pos_orders FOR UPDATE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND is_active = true));

-- Order items policies
CREATE POLICY "All authenticated users can view order items" ON public.pos_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage order items" ON public.pos_order_items FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND is_active = true));

-- Expenses and deposits policies
CREATE POLICY "All authenticated users can view expenses" ON public.pos_expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated users can add expenses" ON public.pos_expenses FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND is_active = true));

CREATE POLICY "All authenticated users can view deposits" ON public.pos_deposits FOR SELECT TO authenticated USING (true);
CREATE POLICY "All authenticated users can add deposits" ON public.pos_deposits FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND is_active = true));

-- Charging orders policies
CREATE POLICY "All authenticated users can view charging orders" ON public.pos_charging_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Charging staff can manage charging orders" ON public.pos_charging_orders FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'charging_staff') AND is_active = true));

-- Settings policies
CREATE POLICY "All authenticated users can view settings" ON public.pos_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can update settings" ON public.pos_settings FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.pos_users WHERE auth_user_id = auth.uid() AND role = 'admin'));

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  order_num TEXT;
BEGIN
  -- Get the next number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.pos_orders
  WHERE DATE(created_at) = CURRENT_DATE
    AND order_number LIKE TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
  
  -- Format as YYYYMMDD001
  order_num := TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(next_num::TEXT, 3, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.pos_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Similar function for charging orders
CREATE OR REPLACE FUNCTION generate_charging_order_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  order_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.pos_charging_orders
  WHERE DATE(created_at) = CURRENT_DATE
    AND order_number LIKE 'CH' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
  
  order_num := 'CH' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(next_num::TEXT, 3, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_charging_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_charging_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_charging_order_number
  BEFORE INSERT ON public.pos_charging_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_charging_order_number();
