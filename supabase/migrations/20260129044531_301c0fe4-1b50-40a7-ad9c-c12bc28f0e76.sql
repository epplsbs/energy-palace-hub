-- Recreate the generate_charging_order_number function that was removed
CREATE OR REPLACE FUNCTION public.generate_charging_order_number()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Recreate the trigger function
CREATE OR REPLACE FUNCTION public.set_charging_order_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_charging_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate the trigger if it doesn't exist
DROP TRIGGER IF EXISTS set_charging_order_number_trigger ON public.pos_charging_orders;
CREATE TRIGGER set_charging_order_number_trigger
  BEFORE INSERT ON public.pos_charging_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_charging_order_number();