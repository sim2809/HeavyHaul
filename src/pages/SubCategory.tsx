import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Phone, Truck, CheckCircle2, Award, MapPin, ShieldCheck, Clock, DollarSign, FileCheck, Star, Tractor } from "lucide-react";
import { findCategory, findSub } from "@/data/categories";
import SEO from "@/components/SEO";
import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotFound from "./NotFound";
import TractorPage from "./TractorPage";

const SubCategoryPage = () => {
  const { categorySlug = "", subSlug = "" } = useParams();
  const cat = findCategory(categorySlug);
  const sub = findSub(categorySlug, subSlug);
  if (!cat || !sub) return <NotFound />;

  // Dedicated rich page for Tractor Shipping
  if (cat.slug === "agricultural-equipment-transport" && sub.slug === "tractor-transport") {
    return <TractorPage cat={cat} sub={sub} />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: sub.name,
    provider: { "@type": "MovingCompany", name: "Heavy Haul Group", telephone: "+1-800-555-0199" },
    areaServed: "United States",
    description: sub.blurb,
  };

  return (
    <>
      <SEO
        title={`${sub.name} | ${cat.short} Heavy Haul - Heavy Haul Group`}
        description={`Nationwide ${sub.name.toLowerCase()}. We move ${sub.brands.slice(0, 3).join(", ")} & more. Same-day quotes, fully insured. Call ${DISPLAY}.`}
        path={`/services/${cat.slug}/${sub.slug}`}
        image={cat.image}
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <img src={cat.image} alt={`${sub.name} on heavy haul trailer`} className="absolute inset-0 h-full w-full object-cover opacity-35" width={1920} height={700} />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container-tight py-14 lg:py-20">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60 mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/services/${cat.slug}`} className="hover:text-primary">{cat.short}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{sub.name}</span>
          </nav>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                <Award className="h-3.5 w-3.5" /> Specialist Carrier
              </div>
              <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase leading-[0.95]">{sub.name}</h1>
              <p className="mt-4 text-lg text-white/80 max-w-2xl">{sub.blurb}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${PHONE}`}><Button variant="hero" size="xl"><Phone /> Call {DISPLAY}</Button></a>
                <a href="#quote"><Button variant="call" size="xl">Free Quote <ArrowRight /></Button></a>
              </div>
            </div>
            <div className="lg:col-span-5 hidden lg:block">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Brands We Transport</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase mb-5">
              {sub.name.replace(" Transport", "")} <span className="text-primary">Brands We Specialize In</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sub.brands.map((b) => (
                <div key={b} className="flex items-center gap-2 bg-card border border-border rounded-md p-3 hover:border-primary transition-colors">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-display uppercase text-sm">{b}</span>
                </div>
              ))}
            </div>

            <p className="mt-10 text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Trailer Types</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase mb-5">
              The Right Rig <span className="text-primary">For The Job</span>
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {sub.trailers.map((t) => (
                <li key={t} className="flex items-start gap-2 bg-card border border-border rounded-md p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-display uppercase">{t}</div>
                    <div className="text-xs text-muted-foreground">Permitted & insured</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 bg-secondary text-secondary-foreground rounded-md p-6 border-l-4 border-primary">
              <p className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Geo-Targeted Dispatch
              </p>
              <p className="text-white/85">
                Need <em className="text-primary not-italic">{sub.name.toLowerCase()}</em> from New York to Dallas, or any U.S. lane?
                We match your route to the closest carrier with the right trailer in minutes.
              </p>
              <Link to="/lanes" className="mt-3 inline-flex items-center gap-2 text-primary font-bold uppercase text-sm hover:underline">
                Browse Shipping Lanes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside id="quote" className="lg:col-span-4 scroll-mt-24 lg:hidden">
            <QuoteForm />
          </aside>
        </div>
      </section>
    </>
  );
};

export default SubCategoryPage;
