import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import { usePageBySlug } from "@/integrations/wordpress/hooks";
import type { Section } from "@/integrations/wordpress/mappers";

/**
 * Renders all enabled sections for a given page slug from the CMS (WordPress via WPGraphQL).
 * Drop into any public page: <CmsSections slug="home" />
 * Returns null until loaded so it doesn't flash.
 */
export default function CmsSections({ slug }: { slug: string }) {
  const { data } = usePageBySlug(slug);
  const sections = data?.sections;

  if (!sections || sections.length === 0) return null;
  return <>{sections.map((s) => <SectionRenderer key={s.id} section={s} />)}</>;
}

function SectionRenderer({ section }: { section: Section }) {
  const d = section.data || {};
  const style = d.style as React.CSSProperties | undefined;

  switch (section.type) {
    case "hero":
      return (
        <section style={style} className="relative py-20 md:py-28 bg-gradient-to-br from-secondary to-secondary/80 text-white">
          {d.image && <img src={d.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
          <div className="relative container mx-auto px-4 text-center">
            {d.eyebrow && <div className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-4">{d.eyebrow}</div>}
            {d.headline && <h1 className="text-4xl md:text-6xl font-bold mb-4">{d.headline}</h1>}
            {d.subheadline && <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">{d.subheadline}</p>}
            {d.cta_label && <Button asChild size="lg" className="bg-primary hover:bg-primary/90"><a href={d.cta_href || "#"}>{d.cta_label}</a></Button>}
          </div>
        </section>
      );

    case "rich_text":
      return (
        <section style={style} className="py-12">
          <div className="container mx-auto px-4 prose max-w-3xl" dangerouslySetInnerHTML={{ __html: d.html || "" }} />
        </section>
      );

    case "features": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            {d.headline && <h2 className="text-3xl font-bold text-center mb-12">{d.headline}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((it, i) => {
                const Icon = (Icons as any)[it.icon] || Icons.Check;
                return (
                  <div key={i} className="p-6 bg-card rounded-lg border">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold mb-2">{it.title}</h3>
                    <p className="text-sm text-muted-foreground">{it.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case "cta":
      return (
        <section style={style} className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            {d.headline && <h2 className="text-3xl md:text-4xl font-bold mb-3">{d.headline}</h2>}
            {d.subheadline && <p className="text-lg opacity-90 mb-6">{d.subheadline}</p>}
            {d.cta_label && <Button asChild size="lg" variant="secondary"><a href={d.cta_href || "#"}>{d.cta_label}</a></Button>}
          </div>
        </section>
      );

    case "faq": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            {d.headline && <h2 className="text-3xl font-bold text-center mb-8">{d.headline}</h2>}
            <div className="space-y-4">
              {items.map((it, i) => (
                <details key={i} className="border rounded-lg p-4 bg-card">
                  <summary className="font-semibold cursor-pointer">{it.q}</summary>
                  <p className="mt-2 text-muted-foreground">{it.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "stats": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-12 bg-secondary text-white">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {items.map((it, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-primary">{it.value}</div>
                <div className="text-sm text-white/70 mt-1">{it.label}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "reviews": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            {d.headline && <h2 className="text-3xl font-bold text-center mb-12">{d.headline}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((it, i) => (
                <blockquote key={i} className="p-6 bg-card rounded-lg border">
                  {it.rating && (
                    <div className="flex gap-0.5 mb-2 text-primary">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Icons.Star key={star} className={`h-4 w-4 ${star < it.rating ? "fill-current" : ""}`} />
                      ))}
                    </div>
                  )}
                  <p className="italic">"{it.quote}"</p>
                  <footer className="mt-3 text-sm font-semibold">{it.author}{it.company && <span className="text-muted-foreground"> — {it.company}</span>}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "testimonials": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
            {items.map((it, i) => (
              <blockquote key={i} className="p-6 bg-card rounded-lg border">
                <p className="italic">"{it.quote}"</p>
                <footer className="mt-3 text-sm font-semibold">{it.author}{it.company && <span className="text-muted-foreground"> — {it.company}</span>}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      );
    }

    case "services": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16">
          <div className="container mx-auto px-4">
            {d.headline && <h2 className="text-3xl font-bold text-center mb-12">{d.headline}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((it, i) => {
                const Icon = (Icons as any)[it.icon] || Icons.Truck;
                const content = (
                  <div className="p-6 bg-card rounded-lg border h-full">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold mb-2">{it.title}</h3>
                    <p className="text-sm text-muted-foreground">{it.description}</p>
                  </div>
                );
                return it.href ? (
                  <a key={i} href={it.href} className="hover:opacity-90 transition-opacity">{content}</a>
                ) : (
                  <div key={i}>{content}</div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case "gallery": {
      const items: any[] = d.items || [];
      return (
        <section style={style} className="py-16">
          <div className="container mx-auto px-4">
            {d.headline && <h2 className="text-3xl font-bold text-center mb-12">{d.headline}</h2>}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((it, i) => (
                <figure key={i} className="rounded-lg overflow-hidden border bg-card">
                  {it.src && <img src={it.src} alt={it.alt || ""} className="w-full aspect-[4/3] object-cover" />}
                  {it.caption && <figcaption className="p-3 text-sm text-muted-foreground">{it.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "image_block":
      return (
        <section style={style} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            {d.src && (
              d.href ? (
                <a href={d.href}><img src={d.src} alt={d.alt || ""} className="w-full rounded-lg" /></a>
              ) : (
                <img src={d.src} alt={d.alt || ""} className="w-full rounded-lg" />
              )
            )}
            {d.caption && <p className="mt-2 text-sm text-muted-foreground text-center">{d.caption}</p>}
          </div>
        </section>
      );

    case "video_block":
      return (
        <section style={style} className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {d.url && (
                /youtube|vimeo/.test(d.url) ? (
                  <iframe src={d.url} className="w-full h-full" allowFullScreen title={d.caption || "Video"} />
                ) : (
                  <video src={d.url} poster={d.poster} controls className="w-full h-full" />
                )
              )}
            </div>
            {d.caption && <p className="mt-2 text-sm text-muted-foreground text-center">{d.caption}</p>}
          </div>
        </section>
      );

    case "custom_html":
      return <section dangerouslySetInnerHTML={{ __html: d.html || "" }} />;

    default:
      return null;
  }
}
