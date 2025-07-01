-- Remove the NOT NULL constraint from order_number in pos_charging_orders table
-- and update the set_charging_order_number trigger to work properly

-- First drop the existing trigger
DROP TRIGGER IF EXISTS set_charging_order_number_trigger ON pos_charging_orders;

-- Make order_number nullable and add a default
ALTER TABLE pos_charging_orders 
ALTER COLUMN order_number DROP NOT NULL,
ALTER COLUMN order_number SET DEFAULT '';

-- Update the trigger function to set order_number if it's empty
CREATE OR REPLACE FUNCTION public.set_charging_order_number()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_charging_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER set_charging_order_number_trigger
  BEFORE INSERT ON pos_charging_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_charging_order_number();