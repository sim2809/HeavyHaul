import { Link, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight, Phone, MapPin, Clock, Truck } from "lucide-react";
import { cities, findCity, popularLanes } from "@/data/categories";
import SEO from "@/components/SEO";
import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import NotFound from "./NotFound";

// Simple deterministic transit estimate based on slug-based hashing
const estimateTransit = (a: string, b: string) => {
  const sum = (s: string) => Array.from(s).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const days = 2 + (Math.abs(sum(a) - sum(b)) % 5);
  const miles = 400 + ((sum(a + b) * 7) % 2200);
  return { days, miles };
};

export const LanesIndex = () => {
  return (
    <>
      <SEO
        title="Heavy Haul Shipping Lanes USA | Nationwide Routes - Heavy Haul Group"
        description="Heavy haul transport on every U.S. shipping lane. New York to Dallas, LA to Houston, Chicago to Atlanta and more. Get instant lane quotes."
        path="/lanes"
      />
      <section className="bg-secondary text-secondary-foreground py-14 lg:py-20">
        <div className="container-tight">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Geo-Targeted Heavy Haul</p>
          <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase">
            U.S. Heavy Haul <span className="text-primary">Shipping Lanes</span>
          </h1>
          <p className="mt-4 text-white/75 max-w-2xl">
            Click your origin and destination below for transit estimates, lane-specific dispatchers, and instant quotes.
          </p>
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="container-tight">
          <h2 className="stencil text-2xl uppercase mb-5 text-primary">Most Popular Lanes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {popularLanes.map(([from, to]) => {
              const a = findCity(from)!;
              const b = findCity(to)!;
              return (
                <Link key={`${from}-${to}`} to={`/lanes/${from}-to-${to}`} className="group flex items-center justify-between bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="font-display uppercase">{a.name}, {a.state} → {b.name}, {b.state}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </Link>
              );
            })}
          </div>

          <h2 className="stencil text-2xl uppercase mb-5 text-primary">Browse Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {cities.map((c) => (
              <Link key={c.slug} to={`/lanes/from-${c.slug}`} className="bg-card border border-border rounded-md px-3 py-2.5 text-sm font-bold uppercase hover:border-primary hover:text-primary transition-colors">
                {c.name}, {c.state}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const LanePage = () => {
  const { laneSlug = "" } = useParams();

  // Patterns supported:
  //   from-{city}                  → list outbound lanes from city
  //   {from}-to-{to}               → specific lane page
  let from: string | undefined;
  let to: string | undefined;

  if (laneSlug.startsWith("from-")) {
    from = laneSlug.replace("from-", "");
  } else {
    const m = laneSlug.match(/^(.+)-to-(.+)$/);
    if (m) {
      from = m[1];
      to = m[2];
    }
  }

  const fromCity = from ? findCity(from) : undefined;
  const toCity = to ? findCity(to) : undefined;

  if (!fromCity) return <NotFound />;

  // Outbound listing
  if (!toCity) {
    return (
      <>
        <SEO
          title={`Heavy Haul From ${fromCity.name}, ${fromCity.state} | Outbound Lanes`}
          description={`Heavy haul and oversize load transport from ${fromCity.name}, ${fromCity.state} to anywhere in the USA. Same-day dispatch. Get a free quote now.`}
          path={`/lanes/from-${fromCity.slug}`}
        />
        <section className="bg-secondary text-secondary-foreground py-14 lg:py-20">
          <div className="container-tight">
            <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60 mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/lanes" className="hover:text-primary">Lanes</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">From {fromCity.name}</span>
            </nav>
            <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase">
              Heavy Haul From <span className="text-primary">{fromCity.name}, {fromCity.state}</span>
            </h1>
            <p className="mt-4 text-white/75 max-w-2xl">
              We dispatch lowboys, RGNs, and step decks out of {fromCity.name} to all 50 states. Pick your destination below.
            </p>
          </div>
        </section>
        <section className="py-14 bg-background">
          <div className="container-tight grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities.filter((c) => c.slug !== fromCity.slug).map((c) => (
              <Link key={c.slug} to={`/lanes/${fromCity.slug}-to-${c.slug}`} className="group flex items-center justify-between bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-display uppercase">{fromCity.name} → {c.name}, {c.state}</div>
                    <div className="text-xs text-muted-foreground">Heavy haul · Insured</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </>
    );
  }

  const { days, miles } = estimateTransit(fromCity.slug, toCity.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Heavy Haul Transport",
    provider: { "@type": "MovingCompany", name: "Heavy Haul Group", telephone: "+1-800-555-0199" },
    areaServed: [
      { "@type": "City", name: fromCity.name },
      { "@type": "City", name: toCity.name },
    ],
    name: `Heavy Haul ${fromCity.name} to ${toCity.name}`,
  };

  return (
    <>
      <SEO
        title={`Heavy Haul ${fromCity.name}, ${fromCity.state} to ${toCity.name}, ${toCity.state} | Free Quote`}
        description={`Oversize load and heavy equipment transport from ${fromCity.name} to ${toCity.name}. Approx. ${miles} miles · ${days}-${days + 1} day transit. Same-day dispatch.`}
        path={`/lanes/${fromCity.slug}-to-${toCity.slug}`}
        jsonLd={jsonLd}
      />

      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-30" aria-hidden />
        <div className="relative container-tight py-14 lg:py-20">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60 mb-4 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/lanes" className="hover:text-primary">Lanes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{fromCity.name} → {toCity.name}</span>
          </nav>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Lane Specialists
              </p>
              <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase leading-[0.95]">
                Heavy Haul <br />
                <span className="text-primary">{fromCity.name}, {fromCity.state}</span> →
                <br />
                <span className="text-primary">{toCity.name}, {toCity.state}</span>
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-xl">
                Lowboys, RGNs, and step decks dispatched daily on this lane. Permits, pilot cars, and DOT compliance handled in-house.
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3 max-w-lg">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                  <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="stencil text-2xl text-white">{days}-{days + 1}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/55">Day Transit</div>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                  <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="stencil text-2xl text-white">~{miles}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/55">Miles</div>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                  <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="stencil text-2xl text-white">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/55">Dispatch</div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${PHONE}`}><Button variant="hero" size="xl"><Phone /> Call {DISPLAY}</Button></a>
                <a href="#quote"><Button variant="call" size="xl">Quote This Lane <ArrowRight /></Button></a>
              </div>
            </div>

            <div id="quote" className="lg:col-span-5 scroll-mt-24">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="container-tight">
          <h2 className="stencil text-2xl sm:text-3xl uppercase mb-5">
            Common Equipment Moved On The <span className="text-primary">{fromCity.name} → {toCity.name}</span> Lane
          </h2>
          <p className="text-muted-foreground max-w-3xl mb-6">
            Whether you're shipping construction equipment, agricultural machinery, industrial freight, or commercial trucks
            from {fromCity.name}, {fromCity.state} to {toCity.name}, {toCity.state}, we have the trailer and the carrier ready today.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Excavators & Dozers", to: "/services/construction-equipment-transport" },
              { label: "Tractors & Combines", to: "/services/agricultural-equipment-transport" },
              { label: "Generators & CNC", to: "/services/industrial-machinery-transport" },
              { label: "Semi & Dump Trucks", to: "/services/heavy-duty-truck-transport" },
            ].map((x) => (
              <Link key={x.label} to={x.to} className="group flex items-center justify-between bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                <span className="font-display uppercase text-sm">{x.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LanePage;
