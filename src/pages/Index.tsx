import heroImg from "@/assets/hero-truck.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuoteForm from "@/components/QuoteForm";
import Gallery from "@/components/Gallery";
import BrandMarquee from "@/components/BrandMarquee";
import UsaMap from "@/components/UsaMap";
import CountUp from "@/components/CountUp";
import LiveActivity from "@/components/LiveActivity";
import InstantQuoteCalculator from "@/components/InstantQuoteCalculator";
import RecentShipmentsTicker from "@/components/RecentShipmentsTicker";
import Guarantees from "@/components/Guarantees";
import FAQ, { FAQS } from "@/components/FAQ";
import DispatcherTeam from "@/components/DispatcherTeam";
import { useSiteContent } from "@/hooks/useSiteContent";

import SEO from "@/components/SEO";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { categories } from "@/data/categories";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

import {
  Phone, ShieldCheck, BadgeCheck, Users, MapPin, Truck,
  Clock, Activity, DollarSign, CheckCircle2, FileText, ClipboardList,
  PackageCheck, Star, Award, ArrowRight,
} from "lucide-react";


const Index = () => {
  const { get } = useSiteContent();

  const trustBadges = [
    { icon: ShieldCheck, label: get("home","hero_trust_1","Fully Insured") },
    { icon: BadgeCheck, label: get("home","hero_trust_2","DOT Compliant") },
    { icon: Users, label: get("home","hero_trust_3","Expert Drivers") },
    { icon: MapPin, label: get("home","hero_trust_4","All 50 States") },
  ];

  const stats = [
    { end: 4.9, decimals: 1, suffix: "", label: get("home","stat_1_label","Avg. Rating"), sub: get("home","stat_1_sub","2,400+ shippers") },
    { end: 15, decimals: 0, suffix: "+", label: get("home","stat_2_label","Years"), sub: get("home","stat_2_sub","In heavy haul") },
    { end: 12, decimals: 0, suffix: "K+", label: get("home","stat_3_label","Loads"), sub: get("home","stat_3_sub","Delivered safely") },
    { end: 50, decimals: 0, suffix: "", label: get("home","stat_4_label","States"), sub: get("home","stat_4_sub","Nationwide coverage") },
  ];

  const why = [
    { icon: Clock, title: get("home","why_1_title","Same / Next Day Dispatch"), desc: get("home","why_1_desc","Urgent loads moved within hours, not days.") },
    { icon: Activity, title: get("home","why_2_title","Real-Time Updates"), desc: get("home","why_2_desc","Direct line to your dispatcher from pickup to delivery.") },
    { icon: Users, title: get("home","why_3_title","Heavy Haul Specialists"), desc: get("home","why_3_desc","Decades of oversize and superload experience.") },
    { icon: DollarSign, title: get("home","why_4_title","Competitive Pricing"), desc: get("home","why_4_desc","Transparent quotes, no hidden fees.") },
    { icon: MapPin, title: get("home","why_5_title","Nationwide Network"), desc: get("home","why_5_desc","Thousands of vetted carriers across all 50 states.") },
    { icon: ShieldCheck, title: get("home","why_6_title","Fully Insured Loads"), desc: get("home","why_6_desc","Cargo and liability coverage on every shipment.") },
  ];

  const steps = [
    { icon: FileText, title: get("home","step_1_title","Request a Quote"), desc: get("home","step_1_desc","Share your route, equipment and timing.") },
    { icon: ClipboardList, title: get("home","step_2_title","Plan & Assign Carrier"), desc: get("home","step_2_desc","We secure permits and the right rig.") },
    { icon: Truck, title: get("home","step_3_title","Pickup & Secure Transport"), desc: get("home","step_3_desc","Loaded, strapped, and on the road.") },
    { icon: PackageCheck, title: get("home","step_4_title","Delivery & Confirmation"), desc: get("home","step_4_desc","Safe drop-off with proof of delivery.") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MovingCompany",
        name: "Heavy Haul Group",
        url: "https://heavyhaulgroup.com",
        telephone: "+1-800-555-0199",
        areaServed: "US",
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "2400" },
        description:
          "Heavy haul transportation, oversize load shipping, and equipment transport across the United States.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };


  return (
    <>
      <SEO
        title="Heavy Haul Transport USA | Oversize Load Shipping - Heavy Haul Group"
        description="Nationwide heavy haul & oversize load transport. Fully insured, DOT compliant, same-day quotes. Construction, agricultural, industrial & truck transport."
        path="/"
        image={heroImg}
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <img
          src={heroImg}
          alt="Heavy haul Peterbilt semi truck transporting a Caterpillar bulldozer on a multi-axle lowboy across an American interstate"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 topo-bg opacity-40" />

        <div className="relative container-tight py-12 md:py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-white animate-fade-up">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary/15 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40">
                <Award className="h-3.5 w-3.5" />
                {get("home","hero_badge_1","#1 Rated Heavy Haul Carrier Network")}
              </div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-green-500/10 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400 border border-green-500/40">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                {get("home","hero_badge_2","12 Dispatchers Online Now")}
              </div>
            </div>

            <h1 className="stencil font-bold uppercase text-[44px] sm:text-6xl lg:text-7xl leading-[0.9]">
              {get("home","hero_title_line1","Heavy Haul &")}
              <br />
              <span className="text-primary">{get("home","hero_title_line2","Oversize Load")}</span>
              <br />
              {get("home","hero_title_line3","Transport Nationwide")}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/80 max-w-xl font-medium">
              {get("home","hero_subtitle","Quality heavy load transport, anytime, anywhere across the United States. Same-day quotes. Fully insured. DOT compliant.")}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href={`tel:${PHONE}`} className="group inline-flex items-center gap-3 bg-white/5 backdrop-blur hover:bg-white/10 border border-white/15 rounded-md px-5 py-3 transition">
                <span className="h-12 w-12 rounded bg-gradient-amber flex items-center justify-center shadow-cta">
                  <Phone className="h-6 w-6 text-secondary" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-white/60">{get("home","hero_phone_label","Speak To A Dispatcher")}</span>
                  <span className="block stencil text-2xl sm:text-3xl text-white group-hover:text-primary">{DISPLAY}</span>
                </span>
              </a>
              <a href="#quote">
                <Button variant="hero" size="xl">{get("home","hero_cta_label","Get Free Quote")} <ArrowRight /></Button>
              </a>
            </div>

            <ul className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {trustBadges.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-white/90">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-primary/15 border border-primary/40">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <span className="font-bold uppercase tracking-wide text-xs sm:text-[13px]">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="quote" className="lg:col-span-5 scroll-mt-24 relative">
            <div className="absolute -inset-2 bg-gradient-amber rounded-lg opacity-40 blur-2xl animate-pulse pointer-events-none" aria-hidden />
            <div className="relative">
              <InstantQuoteCalculator />
            </div>
          </div>


        </div>

        {/* Stats bar */}
        <div className="relative bg-black/60 backdrop-blur border-t border-white/10">
          <div className="container-tight grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className="py-5 px-4 text-center text-white">
                <div className="stencil text-3xl sm:text-4xl text-primary">
                  <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] font-bold">{s.label}</div>
                <div className="text-[11px] text-white/55">{s.sub}</div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* LIVE SHIPMENTS TICKER */}
      <RecentShipmentsTicker />







      {/* SERVICES, clickable cards with real photos */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-2xl mb-12">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" /> {get("home","services_eyebrow","What We Haul")}
            </p>
            <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
              {get("home","services_title_1","Specialized Transport")} <span className="text-primary">{get("home","services_title_2","For Every Industry")}</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              {get("home","services_subtitle","From farm equipment to industrial machinery, click any category for full sub-services, brand specialties, and shipping rates.")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {categories.slice(0, 4).map((c) => (
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
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-sans font-extrabold text-xl sm:text-2xl normal-case tracking-tight text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{c.blurb}</p>
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
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/15 text-secondary px-2 py-1 rounded-sm border border-primary/40">
                      +{c.subcategories.length - 4} more
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <BrandMarquee />

      {/* GALLERY, videos & real loaded trailer photos */}
      <Gallery />

      {/* HEAVY HAUL IN YOUR STATE, animated US map */}
      <section className="py-16 sm:py-24 bg-muted/40 overflow-hidden">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">{get("home","coverage_eyebrow","Nationwide Coverage")}</p>
            <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
              {get("home","coverage_title_1","Heavy Haul")} <span className="text-primary">{get("home","coverage_title_2","In Your State")}</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              {get("home","coverage_subtitle","We dispatch heavy haul and oversize load transport in every U.S. state, coast to coast.")}
            </p>
          </div>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <UsaMap />
            </div>
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-card border border-border rounded-md p-6 shadow-card">
                <div className="stencil text-4xl text-primary">{get("home","coverage_card_value","50 / 50")}</div>
                <p className="text-xs uppercase tracking-[0.25em] font-bold mt-1 text-muted-foreground">{get("home","coverage_card_label","States Covered")}</p>
              </div>
              <div className="bg-secondary text-white rounded-md p-6 border-t-4 border-primary">
                <p className="text-sm text-white/80">{get("home","coverage_card_note","Local dispatchers, nationwide network. Pick a state, we'll have a rig on it.")}</p>
                <a href="#quote" className="mt-4 inline-block">
                  <Button variant="hero" size="lg">Get A Free Quote <ArrowRight /></Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="relative py-16 sm:py-24 bg-gradient-dark text-white overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-40" aria-hidden />
        <div className="relative container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-primary/40" /> {get("home","why_eyebrow","Why Heavy Haul Group")} <span className="h-px w-8 bg-primary/40" />
            </p>
            <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
              {get("home","why_title_1","Built For Heavy.")} <span className="text-primary">{get("home","why_title_2","Trusted For Every Mile.")}</span>
            </h2>
            <p className="text-white/70 mt-5 text-base sm:text-lg">
              {get("home","why_subtitle","We move what others can't. Our dispatchers, drivers, and equipment are dedicated 100% to oversize and heavy haul freight.")}
            </p>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="relative">
            <CarouselContent className="-ml-4">
              {why.map(({ icon: Icon, title, desc }) => (
                <CarouselItem key={title} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="group h-full bg-white rounded-xl border border-white/10 p-8 flex flex-col items-center text-center shadow-card hover:-translate-y-1 transition-transform">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide text-secondary">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed min-h-[3rem]">{desc}</p>
                    <Link
                      to="/services"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Explore <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-3 mt-10">
              <CarouselPrevious className="static translate-y-0 h-11 w-11 rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-secondary" />
              <CarouselNext className="static translate-y-0 h-11 w-11 rounded-full border-white/20 bg-transparent text-white hover:bg-white hover:text-secondary" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* GUARANTEES / RISK REVERSAL */}
      <Guarantees />

      {/* DISPATCHER TEAM, faces & names */}
      <DispatcherTeam />

      {/* HOW IT WORKS */}

      <section className="py-12 sm:py-16 bg-background">
        <div className="container-tight">
          <div className="mb-8">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">{get("home","steps_eyebrow","Strategic Execution")}</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">{get("home","steps_title","From Quote To Delivery")}</h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="relative bg-card p-6 sm:p-7 group overflow-hidden transition-colors hover:bg-secondary">
                <div className="flex items-center justify-between mb-4">
                  <span className="stencil text-5xl leading-none text-primary font-bold">
                    0{i + 1}
                  </span>
                  <span className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon className="h-5 w-5 text-primary group-hover:text-secondary transition-colors" strokeWidth={2} />
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="stencil text-lg uppercase text-foreground group-hover:text-secondary-foreground transition-colors">{title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-secondary-foreground/80 leading-relaxed transition-colors">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>



      {/* REVIEWS — BENTO MOSAIC */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="container-tight">
          <div className="text-center mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Verified Across 2,400+ Loads</p>
            <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
              Real Shippers. <span className="text-primary">Real Loads.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Scorecard */}
            <div className="md:col-span-2 bg-primary text-secondary p-8 flex flex-col justify-between rounded-sm shadow-cta min-h-[260px]">
              <div>
                <p className="stencil text-2xl leading-tight uppercase">Overall Rating</p>
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
              <div>
                <p className="stencil text-7xl leading-none">4.9</p>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-2">
                  2,400+ verified shippers
                </p>
              </div>
            </div>

            {/* Featured testimonial */}
            <article className="md:col-span-4 bg-secondary text-white p-8 sm:p-10 rounded-sm flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-6 right-6 text-primary/20 stencil text-7xl leading-none select-none">"</div>
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg sm:text-xl italic leading-relaxed">
                "Moved a 120k lb transformer across state lines without a single permit delay. Our dispatcher kept us updated every two hours — the most professional haul we've booked."
              </p>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs uppercase font-bold text-primary tracking-widest">
                  John D. — Global Energy Logistics
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verified Load
                </span>
              </div>
            </article>

            {/* Smaller reviews */}
            {[
              { q: "Dispatcher actually picks up the phone. Delivered on time, no surprises.", n: "Mike R.", role: "Fleet Manager" },
              { q: "Best rates for RGN specialized equipment. Most brokers overcharge on permits — HHG is transparent.", n: "Sarah K.", role: "Operations Lead" },
              { q: "The $1M cargo coverage is real. A minor strap failure on a prototype rig — handled in 48 hours.", n: "Lisa R.", role: "Infrastructure Lead" },
            ].map((r) => (
              <article key={r.n} className="md:col-span-2 bg-card border border-border p-6 rounded-sm flex flex-col shadow-card">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-[14px] text-foreground italic leading-relaxed flex-1">"{r.q}"</p>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs font-black uppercase tracking-widest text-primary">{r.n}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{r.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* FINAL CTA */}

      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 topo-bg opacity-50" aria-hidden />
        <div className="h-2 bg-gradient-stripe" aria-hidden />
        <div className="relative container-tight py-16 sm:py-20 text-center max-w-3xl mx-auto">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Limited Carrier Availability Today</p>
          <h2 className="stencil text-4xl sm:text-5xl lg:text-6xl font-bold uppercase">
            Ready To Move <span className="text-primary">Your Equipment?</span>
          </h2>
          <p className="mt-4 text-white/75 text-lg">
            Speak with a live dispatcher now or lock your rate in 60 seconds. Response in under 10 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${PHONE}`}>
              <Button variant="hero" size="xl" className="w-full sm:w-auto"><Phone /> Call {DISPLAY}</Button>
            </a>
            <a href="#quote">
              <Button variant="call" size="xl" className="w-full sm:w-auto">Get Free Quote <ArrowRight /></Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
