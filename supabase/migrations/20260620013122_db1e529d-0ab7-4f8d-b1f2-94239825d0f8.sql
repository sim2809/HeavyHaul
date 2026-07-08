-- SEO overrides per route
CREATE TABLE public.seo_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  title text,
  description text,
  canonical text,
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary_large_image',
  robots text DEFAULT 'index,follow',
  json_ld jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_overrides TO authenticated;
GRANT ALL ON public.seo_overrides TO service_role;
ALTER TABLE public.seo_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read seo" ON public.seo_overrides FOR SELECT USING (true);
CREATE POLICY "Staff manage seo" ON public.seo_overrides FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_seo_updated BEFORE UPDATE ON public.seo_overrides FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Redirects
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  status_code int NOT NULL DEFAULT 301,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read redirects" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Staff manage redirects" ON public.redirects FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_redirects_updated BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Add sitemap-relevant columns to global_settings if not present
ALTER TABLE public.global_settings ADD COLUMN IF NOT EXISTS site_url text;
ALTER TABLE public.global_settings ADD COLUMN IF NOT EXISTS robots_txt text;
ALTER TABLE public.global_settings ADD COLUMN IF NOT EXISTS default_meta_title text;
ALTER TABLE public.global_settings ADD COLUMN IF NOT EXISTS default_meta_description text;
ALTER TABLE public.global_settings ADD COLUMN IF NOT EXISTS default_og_image text;
