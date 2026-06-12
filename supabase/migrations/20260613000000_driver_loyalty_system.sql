
-- Create driver loyalty tier enum
CREATE TYPE public.driver_loyalty_tier AS ENUM ('none', 'silver', 'gold', 'platinum');

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  driver_photo_url TEXT,
  vehicle_photo_url TEXT,
  is_public BOOLEAN DEFAULT false,
  tier driver_loyalty_tier DEFAULT 'none',
  referral_code VARCHAR(10) UNIQUE,
  referred_by_id UUID REFERENCES public.drivers(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  visit_count INTEGER DEFAULT 0,
  total_sales_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create driver commissions table
CREATE TABLE public.driver_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  order_id UUID, -- Reference to pos_orders or pos_charging_orders
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('commission', 'referral_bonus')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add driver_id to pos_orders and pos_charging_orders
ALTER TABLE public.pos_orders ADD COLUMN driver_id UUID REFERENCES public.drivers(id);
ALTER TABLE public.pos_charging_orders ADD COLUMN driver_id UUID REFERENCES public.drivers(id);

-- Enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_commissions ENABLE ROW LEVEL SECURITY;

-- Policies for drivers
CREATE POLICY "Public drivers are viewable by everyone" ON public.drivers
  FOR SELECT USING (is_public = true AND status = 'approved');

CREATE POLICY "POS staff can view all drivers" ON public.drivers
  FOR SELECT TO authenticated USING (public.is_pos_staff());

CREATE POLICY "POS staff can manage drivers" ON public.drivers
  FOR ALL TO authenticated USING (public.is_pos_staff());

-- Policies for driver commissions
CREATE POLICY "POS staff can view commissions" ON public.driver_commissions
  FOR SELECT TO authenticated USING (public.is_pos_staff());

CREATE POLICY "POS staff can manage commissions" ON public.driver_commissions
  FOR ALL TO authenticated USING (public.is_pos_staff());

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set referral code on insert
CREATE OR REPLACE FUNCTION set_driver_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_driver_referral_code
  BEFORE INSERT ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION set_driver_referral_code();

-- Function to update driver tier and calculate commissions
CREATE OR REPLACE FUNCTION handle_driver_order_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_driver_id UUID;
  v_total_amount DECIMAL(15,2);
  v_commission_amount DECIMAL(10,2) := 0;
  v_has_referral_bonus_earned BOOLEAN := FALSE;
  v_referrer_id UUID;
BEGIN
  -- We only care about completed orders with a driver assigned
  IF (NEW.order_status = 'completed' OR NEW.status = 'completed') AND NEW.driver_id IS NOT NULL THEN
    v_driver_id := NEW.driver_id;
    v_total_amount := NEW.total_amount;

    -- 1. Calculate Commission
    -- रु. १,००० सम्मको सेल्स -> रु. १२५ नगद
    -- रु. २,००० सम्मको सेल्स -> रु. २५० नगद
    -- रु. ४,०००+ को सेल्स -> रु. ५०० नगद
    -- रु. ७,५००+ को सेल्स -> रु. ५०० नगद + १ प्लेट चिकेन खाना + १ चिसो फ्री

    IF v_total_amount >= 7500 THEN
      v_commission_amount := 500;
      -- Note: The meal and drink are handled manually or as notes
    ELSIF v_total_amount >= 4000 THEN
      v_commission_amount := 500;
    ELSIF v_total_amount >= 2000 THEN
      v_commission_amount := 250;
    ELSIF v_total_amount >= 1000 THEN
      v_commission_amount := 125;
    END IF;

    IF v_commission_amount > 0 THEN
      INSERT INTO public.driver_commissions (driver_id, order_id, amount, type, notes)
      VALUES (v_driver_id, NEW.id, v_commission_amount, 'commission',
              CASE WHEN v_total_amount >= 7500 THEN 'Includes 1 plate chicken meal + 1 cold drink' ELSE NULL END);
    END IF;

    -- 2. Update Driver Stats (Visit count and Total Sales)
    UPDATE public.drivers
    SET visit_count = visit_count + 1,
        total_sales_amount = total_sales_amount + v_total_amount,
        updated_at = now()
    WHERE id = v_driver_id;

    -- 3. Check for Referral Bonus
    -- रु. ७,५००+ को सेल्स भएपछि तपाईले थप रु. १०० बोनस प्राप्त गर्नुहुनेछ।
    IF v_total_amount >= 7500 THEN
      SELECT referred_by_id INTO v_referrer_id FROM public.drivers WHERE id = v_driver_id;
      IF v_referrer_id IS NOT NULL THEN
        INSERT INTO public.driver_commissions (driver_id, order_id, amount, type, notes)
        VALUES (v_referrer_id, NEW.id, 100, 'referral_bonus', 'Bonus for referral ' || (SELECT full_name FROM public.drivers WHERE id = v_driver_id));
      END IF;
    END IF;

    -- 4. Update Tier
    -- १० पटक ल्याउँदा: Silver Chalak
    -- २५ पटक ल्याउँदा: Gold Chalak
    -- ५० पटक ल्याउँदा: Platinum Chalak
    UPDATE public.drivers
    SET tier =
      CASE
        WHEN visit_count >= 50 THEN 'platinum'::public.driver_loyalty_tier
        WHEN visit_count >= 25 THEN 'gold'::public.driver_loyalty_tier
        WHEN visit_count >= 10 THEN 'silver'::public.driver_loyalty_tier
        ELSE 'none'::public.driver_loyalty_tier
      END
    WHERE id = v_driver_id;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for order completion
CREATE TRIGGER trigger_handle_pos_order_completion
  AFTER UPDATE OF order_status ON public.pos_orders
  FOR EACH ROW
  WHEN (OLD.order_status <> 'completed' AND NEW.order_status = 'completed')
  EXECUTE FUNCTION handle_driver_order_completion();

CREATE TRIGGER trigger_handle_pos_charging_order_completion
  AFTER UPDATE OF status ON public.pos_charging_orders
  FOR EACH ROW
  WHEN (OLD.status <> 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION handle_driver_order_completion();

-- Storage Buckets setup (usually done via SQL in Supabase)
INSERT INTO storage.buckets (id, name, public) VALUES ('driver_assets', 'driver_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for driver_assets
CREATE POLICY "Driver assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'driver_assets');

CREATE POLICY "Authenticated users can upload driver assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'driver_assets');

CREATE POLICY "Authenticated users can update/delete driver assets" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'driver_assets');
