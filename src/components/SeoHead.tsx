import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Presentational SEO tag renderer for CMS-driven pages. The caller (CmsCatchAll.tsx)
 * is responsible for fetching the current WordPress page's Yoast SEO fields and passing
 * them in as props — this component no longer does its own data fetch (that used to be
 * a separate `seo_overrides` Supabase lookup by pathname; Yoast fields now come bundled
 * with the page fetch that already happened one level up).
 * Falls back to site-wide defaults from Theme Settings when a field isn't set.
 */
export default function SeoHead(props: {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: any;
}) {
  const { pathname } = useLocation();
  const settings = useSiteSettings();

  const title = props.title || (settings as any)?.default_meta_title || settings?.company_name;
  const description = props.description || (settings as any)?.default_meta_description;
  const canonical = props.canonical || pathname;
  const ogImage = props.image || (settings as any)?.default_og_image;
  const ogType = props.type || "website";
  const jsonLd = props.jsonLd;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index,follow" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
