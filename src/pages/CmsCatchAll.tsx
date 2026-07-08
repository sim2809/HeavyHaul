import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CmsSections from "@/components/CmsSections";
import SeoHead from "@/components/SeoHead";
import { usePageBySlug } from "@/integrations/wordpress/hooks";

/**
 * Catch-all CMS page renderer.
 * Looks up the current pathname (without leading slash) as a WordPress page URI.
 * If found → renders sections + SEO.
 * If not found → renders 404.
 */
export default function CmsCatchAll() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "home";
  const { data, isLoading } = usePageBySlug(slug);

  if (isLoading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-muted">
        <div className="text-center">
          <Helmet><title>404 — Page not found</title><meta name="robots" content="noindex" /></Helmet>
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
          <a href="/" className="text-primary underline">Return to Home</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={data.meta.seo.title || data.meta.title}
        description={data.meta.seo.description}
        image={data.meta.seo.og_image}
      />
      <CmsSections slug={slug} />
    </>
  );
}
