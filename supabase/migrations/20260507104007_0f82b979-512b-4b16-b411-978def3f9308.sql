
-- Extend seo_settings
ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS twitter_title TEXT,
  ADD COLUMN IF NOT EXISTS twitter_description TEXT,
  ADD COLUMN IF NOT EXISTS twitter_image TEXT,
  ADD COLUMN IF NOT EXISTS twitter_card TEXT DEFAULT 'summary_large_image',
  ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_auto_generated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS content_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS seo_settings_page_path_uniq ON public.seo_settings(page_path);

-- Public read for SEO so useSEO hook can fetch on public pages
DROP POLICY IF EXISTS "Public read seo_settings" ON public.seo_settings;
CREATE POLICY "Public read seo_settings" ON public.seo_settings FOR SELECT USING (is_active = true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published posts" ON public.blog_posts;
CREATE POLICY "Public read published posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins manage posts" ON public.blog_posts;
CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL USING (public.get_current_user_pos_role() = 'admin')
  WITH CHECK (public.get_current_user_pos_role() = 'admin');

CREATE TRIGGER blog_posts_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- SEO audit log
CREATE TABLE IF NOT EXISTS public.seo_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  issue_type TEXT NOT NULL, -- missing_meta, duplicate_meta, missing_alt, broken_link, no_schema, etc.
  severity TEXT NOT NULL DEFAULT 'warning', -- info, warning, error
  details JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.seo_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage audit" ON public.seo_audit_log;
CREATE POLICY "Admin manage audit" ON public.seo_audit_log
  FOR ALL USING (public.get_current_user_pos_role() = 'admin')
  WITH CHECK (public.get_current_user_pos_role() = 'admin');

CREATE INDEX IF NOT EXISTS seo_audit_log_page_idx ON public.seo_audit_log(page_path);
CREATE INDEX IF NOT EXISTS seo_audit_log_resolved_idx ON public.seo_audit_log(resolved);

-- SEO redirects
CREATE TABLE IF NOT EXISTS public.seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read redirects" ON public.seo_redirects;
CREATE POLICY "Public read redirects" ON public.seo_redirects FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin manage redirects" ON public.seo_redirects;
CREATE POLICY "Admin manage redirects" ON public.seo_redirects
  FOR ALL USING (public.get_current_user_pos_role() = 'admin')
  WITH CHECK (public.get_current_user_pos_role() = 'admin');

-- Alt text columns
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- Cron extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Slug helper function
CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT trim(both '-' FROM regexp_replace(lower(coalesce(input,'')), '[^a-z0-9]+', '-', 'g'))
$$;
