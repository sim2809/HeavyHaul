import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { categories } from "@/data/categories";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { useSiteContent } from "@/hooks/useSiteContent";

const ServicesIndex = () => {
  const { get } = useSiteContent();
  return (
  <>
    <SEO
      title="Heavy Haul Services | Construction, Agricultural, Industrial & Truck Transport"
      description="Complete heavy haul service catalog: construction equipment, agricultural machinery, industrial machinery, and heavy duty truck transport. Click any service for details."
      path="/services"
    />

    {/* HERO */}
    <section className="bg-secondary text-secondary-foreground py-14 lg:py-20">
      <div className="container-tight">
        <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">{get("services","hero_eyebrow","Services")}</p>
        <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase">
          {get("services","hero_title_1","Heavy Haul")} <span className="text-primary">{get("services","hero_title_2","Service Catalog")}</span>
        </h1>
        <p className="mt-4 text-white/75 max-w-2xl">
          {get("services","hero_subtitle","Browse every service we offer — from construction iron to cross-border freight. Click any card for trailers, brands, and instant rates.")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${PHONE}`}><Button variant="hero" size="lg"><Phone /> Call {DISPLAY}</Button></a>
          <Link to="/#quote"><Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white hover:text-secondary">{get("services","hero_cta_quote","Get Free Quote")} <ArrowRight /></Button></Link>
        </div>
      </div>
    </section>

    {/* FEATURED SERVICE */}
    <section className="py-10 bg-background border-b border-border">
      <div className="container-tight">
        <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4">{get("services","featured_eyebrow","Featured Service")}</p>
        <Link
          to="/services/agricultural-equipment-transport/tractor-transport"
          className="group flex flex-col sm:flex-row overflow-hidden rounded-md shadow-card border-2 border-primary/40 hover:border-primary hover:shadow-glow transition-all bg-card"
        >
          <div className="relative sm:w-5/12 aspect-[16/10] sm:aspect-auto overflow-hidden bg-muted">
            <img
              src="/src/assets/tractor-hero.jpg"
              alt="Tractor Shipping Services, tractor loaded on heavy haul trailer"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width={1024}
              height={640}
            />
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-sm shadow-cta">
              {get("services","featured_badge","Popular")}
            </div>
          </div>
          <div className="p-6 sm:p-8 sm:w-7/12 flex flex-col justify-center">
            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors">{get("services","featured_title","Tractor Shipping Services")}</h3>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl">
              {get("services","featured_desc","Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job. John Deere, Case IH, Kubota, New Holland & more.")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Flatbed</span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Step Deck</span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">RGN / Lowboy</span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Hot Shot</span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-primary font-bold uppercase text-sm">
              <span>{get("services","featured_cta","View Tractor Shipping Details")}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </section>

    {/* CARDS — clean photo on top, content below (matches main page style) */}
    <section className="py-14 bg-background">
      <div className="container-tight">
        <div className="grid sm:grid-cols-2 gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/services/${c.slug}`}
              className="group flex flex-col overflow-hidden rounded-md shadow-card border border-border hover:border-primary hover:shadow-glow transition-all bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={`${c.name}, loaded heavy haul trailer`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={1024}
                  height={640}
                />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-sm shadow-cta">
                  Service
                </div>
                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-secondary/80 backdrop-blur text-white text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-sm border border-white/15">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Insured
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.blurb}</p>
                  </div>
                  <span className="shrink-0 h-11 w-11 rounded-md bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.subcategories.slice(0, 4).map((s) => (
                    <span key={s.slug} className="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2 py-1 rounded-sm border border-border">
                      {s.name.replace(" Transport", "")}
                    </span>
                  ))}
                  {c.subcategories.length > 4 && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/15 text-secondary px-2 py-1 rounded-sm border border-primary/40">
                      +{c.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </>
  );
};

export default ServicesIndex;
