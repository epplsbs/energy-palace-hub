CREATE TABLE public.charger_status (
  id BIGSERIAL PRIMARY KEY,
  is_available BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.charger_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view charger status"
  ON public.charger_status FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage charger status"
  ON public.charger_status FOR ALL
  USING (public.get_current_user_pos_role() = 'admin')
  WITH CHECK (public.get_current_user_pos_role() = 'admin');

ALTER TABLE public.charger_status REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.charger_status;

INSERT INTO public.charger_status (is_available) VALUES (false);