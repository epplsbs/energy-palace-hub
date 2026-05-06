ALTER TABLE public.charger_status
  ADD COLUMN IF NOT EXISTS charger_id TEXT,
  ADD COLUMN IF NOT EXISTS connector_id INTEGER,
  ADD COLUMN IF NOT EXISTS error_code TEXT DEFAULT 'NoError',
  ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX IF NOT EXISTS charger_status_charger_connector_key
ON public.charger_status (charger_id, connector_id)
WHERE charger_id IS NOT NULL;

ALTER TABLE public.charger_status REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.charger_status;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

CREATE OR REPLACE FUNCTION public.update_charger_status_from_ocpp(
  p_charger_id TEXT,
  p_connector_id INTEGER,
  p_status TEXT,
  p_error_code TEXT DEFAULT 'NoError'
)
RETURNS TABLE (
  id BIGINT,
  charger_id TEXT,
  connector_id INTEGER,
  is_available BOOLEAN,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.charger_status (charger_id, connector_id, is_available, error_code, updated_at)
  VALUES (
    p_charger_id,
    p_connector_id,
    CASE WHEN p_status = 'Available' THEN true ELSE false END,
    p_error_code,
    now()
  )
  ON CONFLICT (charger_id, connector_id) DO UPDATE
    SET is_available = CASE WHEN p_status = 'Available' THEN true ELSE false END,
        error_code = p_error_code,
        updated_at = now()
  RETURNING
    public.charger_status.id,
    public.charger_status.charger_id,
    public.charger_status.connector_id,
    public.charger_status.is_available,
    public.charger_status.updated_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_overall_charger_availability()
RETURNS TABLE (
  total_connectors INTEGER,
  available_connectors INTEGER,
  is_any_available BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER,
    SUM(CASE WHEN is_available THEN 1 ELSE 0 END)::INTEGER,
    COALESCE(bool_or(is_available), false)
  FROM public.charger_status
  WHERE charger_id IS NOT NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_charger_status_from_ocpp(TEXT, INTEGER, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_overall_charger_availability() TO anon, authenticated;