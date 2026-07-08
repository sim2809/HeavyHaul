import { Link } from "react-router-dom";
import { usePosts } from "@/integrations/wordpress/hooks";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/blog";

// Fallback (used when no posts in CMS yet)
import heroImg from "@/assets/cat-construction.jpg";
import agImg from "@/assets/cat-agricultural.jpg";
import truckImg from "@/assets/cat-trucks.jpg";
import indImg from "@/assets/cat-industrial.jpg";

const fallbackPosts = [
  { slug: "oversize-load-permits-101", title: "Oversize Load Permits 101, What Every Shipper Should Know", excerpt: "A practical guide to state permits, escort cars, and routing for heavy haul shipments.", date: "May 28, 2026", image: heroImg },
  { slug: "agricultural-equipment-transport-guide", title: "Moving Combines & Tractors, Agricultural Transport Done Right", excerpt: "Heads, headers, and harvest deadlines, here's how we move farm equipment safely.", date: "May 12, 2026", image: agImg },
  { slug: "semi-truck-relocation-tips", title: "Relocating A Semi Truck Fleet? Read This First.", excerpt: "Drive-away vs. hauled transport, costs, timing, and DOT compliance explained.", date: "April 30, 2026", image: truckImg },
  { slug: "industrial-machinery-rigging", title: "Rigging Heavy Industrial Machinery For Long-Haul Transport", excerpt: "Tie-downs, dunnage, and air-ride trailers, what protects your CNC on a 1,500-mile run.", date: "April 14, 2026", image: indImg },
];

const Blog = () => {
  const { data: posts } = usePosts();

  const showFallback = posts !== undefined && posts.length === 0;

  return (
    <>
      <SEO
        title="Heavy Haul Blog | News, Guides & Industry Insights - Heavy Haul Group"
        description="Practical guides on oversize load permits, equipment transport, agricultural hauling, and heavy haul industry news."
        path="/blog"
      />
      <section className="bg-secondary text-secondary-foreground py-14 lg:py-20">
        <div className="container-tight max-w-5xl">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Heavy Haul Blog</p>
          <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase">
            News, Guides & <span className="text-primary">Field Stories</span>
          </h1>
          <p className="mt-4 text-white/75 max-w-2xl text-lg">
            Practical, plain-spoken articles from the dispatchers, drivers, and shippers who keep America's heavy iron moving.
          </p>
          <div className="mt-7">
            <Link to="/contact#quote">
              <Button variant="hero" size="xl">Get A Free Quote <ArrowRight /></Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight grid sm:grid-cols-2 gap-6">
          {posts === undefined && <p className="text-muted-foreground">Loading…</p>}

          {showFallback && fallbackPosts.map((p) => (
            <article key={p.slug} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> {p.date}
                </div>
                <h2 className="font-display text-xl sm:text-2xl uppercase leading-tight">{p.title}</h2>
                <p className="text-sm text-muted-foreground mt-3">{p.excerpt}</p>
              </div>
            </article>
          ))}

          {posts && posts.length > 0 && posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-md border border-border bg-card hover:border-primary hover:shadow-card transition-all">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {p.featured_image && (
                  <img src={p.featured_image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(p.published_at)}
                </div>
                <h2 className="font-display text-xl sm:text-2xl uppercase leading-tight group-hover:text-primary transition-colors">{p.title}</h2>
                {p.excerpt && <p className="text-sm text-muted-foreground mt-3">{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>

        <div className="container-tight mt-12 text-center">
          <Link to="/contact#quote">
            <Button variant="hero" size="xl">Get A Free Quote <ArrowRight /></Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Blog;
