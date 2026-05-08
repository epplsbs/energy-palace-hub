
-- Unschedule if exists then re-schedule (safe re-run)
DO $$ BEGIN
  PERFORM cron.unschedule('seo-daily-autofill');
EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN
  PERFORM cron.unschedule('seo-daily-sitemap-ping');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'seo-daily-autofill',
  '0 3 * * *',
  $cron$ SELECT net.http_post(
    url:='https://zrjrzwndjfvobxcoyspa.supabase.co/functions/v1/seo-cron',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanJ6d25kamZ2b2J4Y295c3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NzQ3MTEsImV4cCI6MjA2NjI1MDcxMX0.Rx3FTprLkiHi567g39uFYq3cO1TgLYkpNAnNVvpzH74"}'::jsonb,
    body:='{}'::jsonb
  ) $cron$
);

SELECT cron.schedule(
  'seo-daily-sitemap-ping',
  '30 3 * * *',
  $cron$ SELECT net.http_post(
    url:='https://zrjrzwndjfvobxcoyspa.supabase.co/functions/v1/sitemap?ping=1',
    headers:='{"Content-Type":"application/json"}'::jsonb,
    body:='{}'::jsonb
  ) $cron$
);
