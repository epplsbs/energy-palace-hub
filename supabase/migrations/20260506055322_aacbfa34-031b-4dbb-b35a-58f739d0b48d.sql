ALTER TABLE public.charger_status
  ADD COLUMN IF NOT EXISTS charger_id text,
  ADD COLUMN IF NOT EXISTS connector_id integer;

-- Remove any pre-existing seed row that doesn't fit the new schema
DELETE FROM public.charger_status WHERE charger_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS charger_status_charger_connector_key
  ON public.charger_status (charger_id, connector_id);

INSERT INTO public.charger_status (charger_id, connector_id, is_available, updated_at) VALUES
  ('STATION_01', 1, true, now()),
  ('STATION_01', 2, true, now()),
  ('STATION_02', 1, true, now()),
  ('STATION_02', 2, true, now())
ON CONFLICT (charger_id, connector_id) DO NOTHING;

ALTER TABLE public.charger_status REPLICA IDENTITY FULL;