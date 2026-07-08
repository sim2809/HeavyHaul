-- HubSpot settings (singleton)
CREATE TABLE public.hubspot_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled boolean NOT NULL DEFAULT false,
  portal_id text,
  form_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.hubspot_settings TO authenticated;
GRANT ALL ON public.hubspot_settings TO service_role;
ALTER TABLE public.hubspot_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage hubspot" ON public.hubspot_settings FOR ALL USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tg_hubspot_updated BEFORE UPDATE ON public.hubspot_settings FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
INSERT INTO public.hubspot_settings (id, enabled) VALUES (1, false) ON CONFLICT DO NOTHING;

-- Form submissions log
CREATE TABLE public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  origin text,
  destination text,
  equipment text,
  message text,
  page_url text,
  source text,
  extra jsonb,
  hubspot_status text NOT NULL DEFAULT 'pending',
  hubspot_error text,
  hubspot_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.form_submissions TO anon;
GRANT INSERT ON public.form_submissions TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.form_submissions TO authenticated;
GRANT ALL ON public.form_submissions TO service_role;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON public.form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read submissions" ON public.form_submissions FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update submissions" ON public.form_submissions FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete submissions" ON public.form_submissions FOR DELETE USING (public.is_staff(auth.uid()));
CREATE INDEX idx_submissions_created ON public.form_submissions(created_at DESC);
