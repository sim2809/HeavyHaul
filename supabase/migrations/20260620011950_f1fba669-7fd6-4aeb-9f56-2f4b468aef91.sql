
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('owner','admin','marketing_manager','seo_specialist','content_editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "users can read own roles" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "owners/admins manage roles" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'));

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff can view all profiles" ON public.profiles FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()) OR id = auth.uid());
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "owners manage profiles" ON public.profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'))
WITH CHECK (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin'));

-- Auto-create profile + first user becomes owner
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ GLOBAL SETTINGS (singleton) ============
CREATE TABLE public.global_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT,
  logo_url TEXT,
  phone_primary TEXT,
  phone_secondary TEXT,
  email TEXT,
  address TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  business_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  footer_content TEXT,
  copyright_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
GRANT SELECT ON public.global_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.global_settings TO authenticated;
GRANT ALL ON public.global_settings TO service_role;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read global settings" ON public.global_settings FOR SELECT USING (true);
CREATE POLICY "owners/admins write global settings" ON public.global_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'marketing_manager'))
WITH CHECK (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'marketing_manager'));

INSERT INTO public.global_settings (id, company_name, phone_primary, email)
VALUES (1, 'Heavy Haul Group', '(866) 411-1212', 'dispatch@heavyhaulgroup.com')
ON CONFLICT (id) DO NOTHING;

-- ============ ANALYTICS SETTINGS (singleton) ============
CREATE TABLE public.analytics_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  gtm_id TEXT,
  ga_id TEXT,
  google_ads_conversion_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  google_ads_remarketing_tag TEXT,
  meta_pixel_id TEXT,
  call_tracking_script TEXT,
  custom_header_scripts TEXT,
  custom_footer_scripts TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
GRANT SELECT ON public.analytics_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.analytics_settings TO authenticated;
GRANT ALL ON public.analytics_settings TO service_role;
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read analytics" ON public.analytics_settings FOR SELECT USING (true);
CREATE POLICY "owners/admins/seo write analytics" ON public.analytics_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'seo_specialist') OR public.has_role(auth.uid(),'marketing_manager'))
WITH CHECK (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'seo_specialist') OR public.has_role(auth.uid(),'marketing_manager'));

INSERT INTO public.analytics_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_global_settings_updated BEFORE UPDATE ON public.global_settings
FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER trg_analytics_settings_updated BEFORE UPDATE ON public.analytics_settings
FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
