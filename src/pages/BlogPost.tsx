import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/blog";
import { usePostBySlug } from "@/integrations/wordpress/hooks";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = usePostBySlug(slug);

  if (isLoading) {
    return <div className="container-tight py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!post) {
    return (
      <div className="container-tight py-20 text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to blog</Link>
      </div>
    );
  }

  const title = post.seo_title || post.title;
  const desc = post.seo_description || post.excerpt || "";
  const ogImage = post.og_image || post.featured_image;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {desc && <meta name="description" content={desc} />}
        <link rel="canonical" href={`/blog/${post.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        {post.no_index && <meta name="robots" content="noindex,nofollow" />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          datePublished: post.published_at,
          author: post.author_name ? { "@type": "Person", name: post.author_name } : undefined,
          image: ogImage || undefined,
        })}</script>
      </Helmet>

      <article className="bg-background">
        <section className="bg-secondary text-secondary-foreground py-12 lg:py-16">
          <div className="container-tight max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary text-xs uppercase font-bold tracking-widest hover:text-primary-glow">
              <ArrowLeft className="h-3 w-3" /> All Posts
            </Link>
            <h1 className="stencil text-3xl sm:text-5xl font-bold uppercase mt-4">{post.title}</h1>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/60 uppercase tracking-widest">
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3 text-primary" /> {formatDate(post.published_at)}</span>
              )}
              {post.author_name && <span>By {post.author_name}</span>}
            </div>
          </div>
        </section>

        {post.featured_image && (
          <div className="container-tight max-w-4xl -mt-6 relative z-10">
            <img src={post.featured_image} alt={post.title} className="w-full rounded-md shadow-card aspect-[16/9] object-cover" />
          </div>
        )}

        <section className="py-14 lg:py-20">
          <div
            className="container-tight max-w-3xl prose prose-lg prose-headings:font-display prose-headings:uppercase prose-a:text-primary prose-img:rounded-md"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          <div className="container-tight max-w-3xl mt-12 pt-8 border-t border-border text-center">
            <Link to="/contact#quote">
              <Button variant="hero" size="xl">Get A Free Quote <ArrowRight /></Button>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
};

export default BlogPostPage;
