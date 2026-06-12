
-- Fix triggers to fire on INSERT as well
DROP TRIGGER IF EXISTS trigger_handle_pos_order_completion ON public.pos_orders;
CREATE TRIGGER trigger_handle_pos_order_completion
  AFTER INSERT OR UPDATE OF order_status ON public.pos_orders
  FOR EACH ROW
  WHEN (NEW.order_status = 'completed' AND (TG_OP = 'INSERT' OR OLD.order_status <> 'completed'))
  EXECUTE FUNCTION handle_driver_order_completion();

DROP TRIGGER IF EXISTS trigger_handle_pos_charging_order_completion ON public.pos_charging_orders;
CREATE TRIGGER trigger_handle_pos_charging_order_completion
  AFTER INSERT OR UPDATE OF status ON public.pos_charging_orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND (TG_OP = 'INSERT' OR OLD.status <> 'completed'))
  EXECUTE FUNCTION handle_driver_order_completion();
