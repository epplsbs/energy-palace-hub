-- Lock down internal SECURITY DEFINER functions from direct API calls.
REVOKE EXECUTE ON FUNCTION public.generate_charging_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_charging_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_order_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.link_pos_user_to_auth() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.link_auth_user_to_pos() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_charger_status_from_ocpp(text, integer, text, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.sync_gallery_to_blog() FROM anon, authenticated, public;

-- Keep RLS helpers callable so policies that reference them keep evaluating:
--   public.get_current_user_pos_role(), public.is_pos_staff(),
--   public.get_overall_charger_availability(), public.slugify(text)

-- Remove duplicate "always true" INSERT policies (keep one per table).
DROP POLICY IF EXISTS "Allow public to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public to insert reservations" ON public.reservations;