CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT true,
  seo jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Staff manage pages" ON public.pages FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type text NOT NULL,
  name text,
  sort_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sections" ON public.page_sections FOR SELECT USING (true);
CREATE POLICY "Staff manage sections" ON public.page_sections FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_sections_updated BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE INDEX idx_page_sections_page ON public.page_sections(page_id, sort_order);

INSERT INTO public.pages (slug, title, description) VALUES
  ('home', 'Home', 'Homepage'),
  ('about', 'About', 'About us page'),
  ('services', 'Services', 'Services overview'),
  ('contact', 'Contact', 'Contact page')
ON CONFLICT (slug) DO NOTHING;
