CREATE TABLE public.nav_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_menus TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_menus TO authenticated;
GRANT ALL ON public.nav_menus TO service_role;
ALTER TABLE public.nav_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menus" ON public.nav_menus FOR SELECT USING (true);
CREATE POLICY "Staff manage menus" ON public.nav_menus FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_menus_updated BEFORE UPDATE ON public.nav_menus FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid NOT NULL REFERENCES public.nav_menus(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.nav_items(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  icon text,
  open_in_new_tab boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read items" ON public.nav_items FOR SELECT USING (true);
CREATE POLICY "Staff manage items" ON public.nav_items FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_navitems_updated BEFORE UPDATE ON public.nav_items FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE INDEX idx_nav_items_menu ON public.nav_items(menu_id, sort_order);

INSERT INTO public.nav_menus (location, name) VALUES
  ('header_primary', 'Header — Primary navigation'),
  ('footer_company', 'Footer — Company'),
  ('footer_resources', 'Footer — Resources'),
  ('footer_legal', 'Footer — Legal')
ON CONFLICT (location) DO NOTHING;
