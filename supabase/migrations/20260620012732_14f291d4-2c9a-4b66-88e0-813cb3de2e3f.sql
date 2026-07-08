
-- MEDIA ASSETS
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INT,
  height INT,
  folder TEXT DEFAULT 'uploads',
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "staff manage media" ON public.media_assets FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_media_folder ON public.media_assets(folder);
CREATE INDEX idx_media_created ON public.media_assets(created_at DESC);

-- BLOG CATEGORIES & TAGS
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "staff manage categories" ON public.blog_categories FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_tags TO authenticated;
GRANT ALL ON public.blog_tags TO service_role;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "staff manage tags" ON public.blog_tags FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- BLOG POSTS
CREATE TYPE public.post_status AS ENUM ('draft','published','scheduled');

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  status public.post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  no_index BOOLEAN NOT NULL DEFAULT false,
  schema_jsonld JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts" ON public.blog_posts FOR SELECT
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));
CREATE POLICY "staff read all posts" ON public.blog_posts FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));
CREATE POLICY "staff write posts" ON public.blog_posts FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE INDEX idx_posts_status_pub ON public.blog_posts(status, published_at DESC);
CREATE INDEX idx_posts_slug ON public.blog_posts(slug);
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- JOIN TABLES
CREATE TABLE public.blog_post_categories (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
GRANT SELECT ON public.blog_post_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_post_categories TO authenticated;
GRANT ALL ON public.blog_post_categories TO service_role;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read post_categories" ON public.blog_post_categories FOR SELECT USING (true);
CREATE POLICY "staff manage post_categories" ON public.blog_post_categories FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
GRANT SELECT ON public.blog_post_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_post_tags TO authenticated;
GRANT ALL ON public.blog_post_tags TO service_role;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read post_tags" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "staff manage post_tags" ON public.blog_post_tags FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- STORAGE POLICIES on storage.objects (bucket created via tool below)
CREATE POLICY "Public can view media files" ON storage.objects FOR SELECT
USING (bucket_id = 'media');
CREATE POLICY "Staff can upload media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff can update media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND public.is_staff(auth.uid()));
