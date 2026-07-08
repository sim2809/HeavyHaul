import { Link } from "react-router-dom";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  ArrowRight, ChevronRight, Phone, CheckCircle2, MapPin, ShieldCheck, Clock,
  DollarSign, FileCheck, Star, Award, Truck, Tractor, Gauge, Ruler, Wrench,
  Headphones, Users, BadgeCheck, TrendingUp, Zap, Gavel, Package, Building2, HardHat,
} from "lucide-react";
import SEO from "@/components/SEO";
import InstantQuoteCalculator from "@/components/InstantQuoteCalculator";
import RecentShipmentsTicker from "@/components/RecentShipmentsTicker";
import CountUp from "@/components/CountUp";
import { Reveal } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Category, SubCategory, states } from "@/data/categories";
import heroImg from "@/assets/tractor-hero.jpg";
import rowcrop from "@/assets/tractor-rowcrop.jpg";
import fourwd from "@/assets/tractor-4wd.jpg";
import compact from "@/assets/tractor-compact.jpg";
import loadedTractor from "@/assets/gallery/loaded-tractor.jpg";

type Props = { cat: Category; sub: SubCategory };

const TRACTOR_TYPES = [
  { name: "Compact Tractor", hp: "20–60 HP", trailer: "Hot Shot / Flatbed", desc: "Sub-compact, lawn, and small property tractors — Kubota BX, John Deere 1/2/3 Series, Mahindra eMax.", img: compact },
  { name: "Utility Tractor", hp: "45–125 HP", trailer: "Flatbed / Step Deck", desc: "All-purpose utility tractors used for loader work, mowing, and light tillage. Most ship as standard freight.", img: compact },
  { name: "Row-Crop Tractor", hp: "140–400 HP", trailer: "Step Deck / Lowboy", desc: "John Deere 8R, Case IH Magnum, Fendt 700/1000 — duals and front weights add width permits.", img: rowcrop },
  { name: "High-Horsepower Tractor", hp: "300–600 HP", trailer: "RGN / Lowboy", desc: "Track and wheeled flagship tractors with overheight and overwidth permits across most lanes.", img: rowcrop },
  { name: "Articulated 4WD Tractor", hp: "400–700+ HP", trailer: "RGN / Multi-Axle", desc: "Case IH Steiger, John Deere 9R, Versatile — duals removed, weights pulled, route surveys when needed.", img: fourwd },
  { name: "Track Tractor", hp: "300–700 HP", trailer: "RGN / Lowboy", desc: "Challenger MT, John Deere 9RX, Case Quadtrac — track shoes set the deck width, lowboys preferred.", img: fourwd },
];

// Brand color theming — branded wordmarks on white cards
type BrandDef = {
  name: string;
  accent: string;    // brand primary hex (used for ring/hover/text)
  logo: () => JSX.Element;
};

// Stylized brand wordmarks rendered in brand colors on white (no trademarked artwork files).
const BRANDS: BrandDef[] = [
  {
    name: "John Deere", accent: "#367C2B",
    logo: () => (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" className="h-9 w-9"><path d="M16 3l-4 8 4-3 4 3-4-8zm-8 9l4 7 1-5-5-2zm16 0l-5 2 1 5 4-7zm-8 6l-5 2 5 9 5-9-5-2z" fill="#FFDE00" stroke="#367C2B" strokeWidth=".6"/></svg>
        <span className="font-black italic text-[#367C2B] text-base leading-none tracking-tight">JOHN<br/>DEERE</span>
      </div>
    ),
  },
  {
    name: "Case IH", accent: "#E2231A",
    logo: () => (
      <div className="flex flex-col items-start">
        <span className="font-black italic text-[#E2231A] text-2xl leading-none tracking-tighter">CASE</span>
        <span className="bg-[#E2231A] text-white font-black text-[11px] px-1.5 leading-tight tracking-wider mt-0.5">IH</span>
      </div>
    ),
  },
  {
    name: "New Holland", accent: "#004A87",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-[#004A87] text-base tracking-tight">NEW HOLLAND</span>
        <span className="text-[8px] uppercase tracking-[0.3em] text-[#004A87]/70 mt-0.5">Agriculture</span>
      </div>
    ),
  },
  {
    name: "Kubota", accent: "#FF6600",
    logo: () => (
      <span className="font-black italic text-[#FF6600] text-2xl tracking-tight">Kubota</span>
    ),
  },
  {
    name: "Massey Ferguson", accent: "#C8102E",
    logo: () => (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full border-[3px] border-[#C8102E] flex items-center justify-center font-black text-[#C8102E] text-sm">MF</div>
        <span className="font-black text-[#C8102E] text-[13px] leading-tight tracking-tight">MASSEY<br/>FERGUSON</span>
      </div>
    ),
  },
  {
    name: "Fendt", accent: "#008542",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-[#008542] text-2xl tracking-tight">Fendt</span>
        <span className="h-[3px] w-12 bg-[#008542] mt-1" />
      </div>
    ),
  },
  {
    name: "Claas", accent: "#006633",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-[#006633] text-2xl tracking-tight">CLAAS</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#006633]/80 mt-1">Harvest the Best</span>
      </div>
    ),
  },
  {
    name: "AGCO", accent: "#ED1C24",
    logo: () => (
      <span className="font-black text-[#ED1C24] text-3xl tracking-[0.05em]">AGCO</span>
    ),
  },
  {
    name: "Mahindra", accent: "#ED1B23",
    logo: () => (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-md bg-[#ED1B23] flex items-center justify-center font-black text-white text-base">M</div>
        <span className="font-black text-[#ED1B23] text-[15px] tracking-tight uppercase">Mahindra</span>
      </div>
    ),
  },
  {
    name: "Challenger", accent: "#FFD200",
    logo: () => (
      <div className="flex items-center gap-1">
        <span className="h-5 w-5 rounded-sm bg-[#FFD200] border border-black/10" />
        <span className="font-black italic text-black text-lg tracking-tight uppercase">Challenger</span>
      </div>
    ),
  },
  {
    name: "Versatile", accent: "#E63027",
    logo: () => (
      <span className="font-black italic text-[#E63027] text-xl uppercase tracking-tight">Versatile</span>
    ),
  },
  {
    name: "Steyr", accent: "#E60012",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black text-[#E60012] text-2xl tracking-[0.15em]">STEYR</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#E60012]/80 mt-0.5">Tractors</span>
      </div>
    ),
  },
  {
    name: "Deutz-Fahr", accent: "#006B3F",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-[#006B3F] text-xl tracking-tight">DEUTZ-FAHR</span>
        <span className="h-[3px] w-16 bg-[#006B3F] mt-1" />
      </div>
    ),
  },
  {
    name: "Valtra", accent: "#C8102E",
    logo: () => (
      <span className="font-black italic text-[#C8102E] text-2xl tracking-tight">VALTRA</span>
    ),
  },
  {
    name: "Kioti", accent: "#E2231A",
    logo: () => (
      <span className="font-black text-[#E2231A] text-2xl tracking-[0.1em] uppercase">KIOTI</span>
    ),
  },
  {
    name: "Yanmar", accent: "#E60012",
    logo: () => (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 32 32" className="h-8 w-8"><polygon points="16,4 28,26 4,26" fill="none" stroke="#E60012" strokeWidth="3"/></svg>
        <span className="font-black text-[#E60012] text-xl tracking-tight uppercase">Yanmar</span>
      </div>
    ),
  },
  {
    name: "Belarus", accent: "#D71920",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-black text-xl tracking-tight uppercase">BELARUS</span>
        <span className="h-[3px] w-16 bg-[#D71920] mt-1" />
      </div>
    ),
  },
  {
    name: "JCB", accent: "#FFCC00",
    logo: () => (
      <div className="h-12 w-20 rounded-md bg-[#FFCC00] flex items-center justify-center font-black text-black text-2xl tracking-tight">JCB</div>
    ),
  },
  {
    name: "Landini", accent: "#0055A4",
    logo: () => (
      <div className="flex flex-col items-start leading-none">
        <span className="font-black italic text-[#0055A4] text-2xl tracking-tight">LANDINI</span>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#0055A4]/80 mt-0.5">Tractors</span>
      </div>
    ),
  },
  {
    name: "Zetor", accent: "#D71920",
    logo: () => (
      <span className="font-black text-[#D71920] text-2xl tracking-[0.05em] uppercase">ZETOR</span>
    ),
  },
];


const STEPS = [
  { n: "01", t: "Quote in Minutes", d: "Send model, HP, duals, and pickup ZIP. We price the lane and trailer in one call." },
  { n: "02", t: "Permits & Routing", d: "Oversize permits, bridge analysis, and pilot cars handled by our dispatch team." },
  { n: "03", t: "Pickup & Tie-Down", d: "Driver loads, chains the axles, and protects exhaust stacks and hydraulics." },
  { n: "04", t: "Tracked Delivery", d: "GPS updates from pickup to drop — and a dispatcher on call 24/7 if anything shifts." },
];

const WHY_US = [
  { icon: ShieldCheck, t: "Fully Insured & DOT Compliant", d: "Up to $1M cargo coverage and full liability on every tractor load — new, used, dealer or auction." },
  { icon: Clock, t: "Same-Day Dispatch", d: "Most tractor pickups assigned within hours. Same-week delivery on standard lanes nationwide." },
  { icon: DollarSign, t: "All-In Pricing", d: "One number — permits, fuel, escorts, pilot cars. No add-ons after the load is booked." },
  { icon: Users, t: "Tractor Specialists", d: "Drivers who know how to chain a 9R, protect a duals set, and handle high-HP cabs the right way." },
  { icon: FileCheck, t: "50-State Permits", d: "Oversize, overweight, and overheight permits filed in-house for every lane in the U.S." },
  { icon: Headphones, t: "24/7 Load Tracking", d: "Real-time GPS updates and a dispatcher on call from pickup to proof of delivery." },
];

const FAQS = [
  { q: "How much does it cost to ship a tractor?", a: "Compact tractors typically run $1.25–$2.25/mile, row-crop tractors $2.50–$4.00/mile, and articulated 4WD tractors $4.50–$7.50/mile depending on permits, duals, and route." },
  { q: "Do I need to remove the duals or front weights?", a: "For most row-crop and 4WD tractors over 8'6\" wide loaded, yes — we'll let you know on the quote. Removing duals often saves permit fees and pilot car costs." },
  { q: "What trailer will you use for my tractor?", a: "Compact/utility tractors ride on flatbeds or hot shots. Row-crop tractors usually need a step deck. High-HP and articulated 4WD tractors ship on RGN or lowboy trailers." },
  { q: "Can you ship a tractor from a dealer or auction?", a: "Yes — we pick up daily from Ritchie Bros., Purple Wave, IronPlanet, and every major John Deere, Case IH, and Kubota dealer in the U.S." },
  { q: "How long does tractor shipping take?", a: "Same-week pickup on most lanes. Coast-to-coast delivery typically runs 5–8 business days. Regional hauls under 500 miles often deliver next day." },
  { q: "Is my tractor insured during transport?", a: "Yes. Every load is covered up to $1M cargo, plus full liability. We send the certificate of insurance before pickup." },
];

const GALLERY = [heroImg, rowcrop, fourwd, compact, loadedTractor, heroImg, rowcrop, fourwd];

  const TractorPage = ({ cat, sub }: Props) => {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tractor Shipping Services",
    provider: { "@type": "MovingCompany", name: "Heavy Haul Group", telephone: "+1-800-555-0199" },
    areaServed: "United States",
    description: "Nationwide tractor shipping for compact, utility, row-crop, high-horsepower, and articulated 4WD tractors.",
  };

  return (
    <>
      <SEO
        title="Tractor Shipping Services | Nationwide Tractor Transport - Heavy Haul Group"
        description={`Tractor shipping services nationwide — compact, row-crop, high-HP, and articulated 4WD tractors. John Deere, Case IH, Kubota, Fendt & more. Same-day quotes. Call ${DISPLAY}.`}
        path={`/services/${cat.slug}/${sub.slug}`}
        image={heroImg}
        jsonLd={jsonLd}
      />

      {/* HERO with embedded QUOTE FORM */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <img
          src={heroImg}
          alt="High-horsepower tractor loaded on heavy haul trailer at sunset"
          className="absolute inset-0 h-full w-full object-cover opacity-95"
          loading="eager"
          width={1920}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/20" />

        <div className="relative container-tight py-14 lg:py-24">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/services/${cat.slug}`} className="hover:text-primary">{cat.short}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Tractor Shipping</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                <Tractor className="h-3.5 w-3.5" /> Nationwide · Fully Insured · 24/7 Dispatch
              </div>
              <h1 className="stencil text-4xl sm:text-6xl lg:text-7xl font-bold uppercase max-w-3xl leading-[0.95]">
                Tractor <span className="text-primary">Shipping</span> Services
              </h1>
              <p className="mt-5 text-lg text-white/85 max-w-2xl">
                From sub-compact Kubotas to 700 HP articulated Steigers — we move tractors on the right trailer, with the right permits, anywhere in the United States.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${PHONE}`}>
                  <Button variant="hero" size="xl"><Phone /> Call {DISPLAY}</Button>
                </a>
                <a href="#quote">
                  <Button variant="call" size="xl">Get Free Quote <ArrowRight /></Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-white/80">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> $1M Cargo Insured</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> All 50 States</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Same-Day Dispatch</span>
              </div>
            </div>

            <aside id="quote" className="lg:col-span-5 scroll-mt-24">
              <InstantQuoteCalculator />
            </aside>
          </div>
        </div>

        <div className="relative h-[3px] w-full overflow-hidden bg-secondary-foreground/10">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_hsl(var(--primary))] animate-sweep-x" />
        </div>
      </section>

      <RecentShipmentsTicker />

      {/* WHO WE ARE */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Reveal>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Who We Are</p>
              <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-5 leading-[0.95]">
                Reliable Tractor <span className="text-primary">Heavy Haul Carriers</span>
              </h2>
            </Reveal>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>
                Heavy Haul Group is a nationwide tractor transport company dispatching tractor loads across all 50 states every single day.
                From single-unit moves to full dealer fleets, our specialists handle permits, pilot cars, route surveys, bridge analysis, and oversize escorts — start to finish.
              </p>
              <p>
                We move tractors for farmers, dealers, rental yards, OEM manufacturers, auction houses, and Fortune-500 ag operators. Emergency breakdown haul or recurring monthly fleet rotations — our dispatchers match your load to the closest tractor specialist carrier and quote in minutes.
              </p>
              <p className="text-foreground font-medium">
                Every shipment is backed by up to $1M in cargo coverage, full DOT/MC compliance, real-time GPS tracking, and a dedicated dispatcher you can reach 24/7.
              </p>
            </div>
            <ul className="mt-7 grid sm:grid-cols-2 gap-2.5">
              {[
                "Permits, pilot cars & route surveys",
                "$1M cargo & full liability insured",
                "John Deere, Case IH, Kubota & more",
                "RGN, lowboy, step deck, flatbed",
                "Same-day & emergency dispatch",
                "Real-time load tracking 24/7",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative rounded-md overflow-hidden border-t-4 border-primary shadow-card">
              <img
                src={rowcrop}
                alt="Row-crop tractor secured on a step deck heavy haul trailer"
                loading="lazy"
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-1">Trusted Nationwide</div>
                <div className="font-display uppercase text-lg leading-tight">Tractor Shipping Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-secondary border-y border-white/10">
        <div className="container-tight py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/70">
          <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> FMCSA Licensed</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> $1M Cargo Insured</span>
          <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> Bonded & Compliant</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> 50-State Authority</span>
          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" /> BBB A+ Rated</span>
        </div>
      </section>

      {/* TRACTOR TYPES */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="container-tight">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Every Tractor, Every Trailer</p>
          <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-4">
            Tractors <span className="text-primary">We Ship</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Tractor shipping isn't one-size-fits-all. The trailer, the permits, and the tie-down plan change with horsepower, width, and weight. Here's how we pair each tractor with the right rig.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRACTOR_TYPES.map((t) => (
              <article key={t.name} className="bg-card border border-border rounded-md overflow-hidden hover:border-primary hover:shadow-card transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={t.img} alt={`${t.name} on heavy haul trailer`} loading="lazy" width={1536} height={1024} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-display uppercase text-xl text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-wider font-bold">
                    <span className="bg-muted border border-border px-2 py-1 rounded-sm flex items-center gap-1"><Gauge className="h-3 w-3 text-primary" /> {t.hp}</span>
                    <span className="bg-muted border border-border px-2 py-1 rounded-sm flex items-center gap-1"><Truck className="h-3 w-3 text-primary" /> {t.trailer}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{t.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-14 sm:py-20 bg-background border-t border-border">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Who We Haul For</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              One Tractor Or A <span className="text-primary">Full Fleet</span> — We Handle It
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { img: heroImg, icon: Gavel, tag: "Auction Buyers", title: "Bought At Auction", subtitle: "Ritchie Bros · IronPlanet · Purple Wave", desc: "Won a tractor at auction? We pick up from the yard and deliver to your farm — title, gate pass, and load-out handled.", cta: "Quote My Auction Win" },
              { img: compact, icon: Package, tag: "One-Time Shipper", title: "Single Tractor Move", subtitle: "Private sellers · Farmers", desc: "Selling, relocating, or moving one tractor? Same white-glove dispatch as a fleet customer — no minimums.", cta: "Ship One Tractor" },
              { img: rowcrop, icon: Building2, tag: "Dealers", title: "Dealer Freight", subtitle: "John Deere · Case IH · Kubota dealers", desc: "Ship with us week after week. Dedicated account reps, custom lane pricing, and Net-30 terms for qualified dealers.", cta: "Open Dealer Account" },
              { img: fourwd, icon: HardHat, tag: "Large Farms & Fleets", title: "Fleet Relocations", subtitle: "Multi-unit moves · Seasonal rotations", desc: "Multi-tractor relocations between farms and regions, same-day dispatch, project-based COIs included.", cta: "Move My Fleet" },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title}>
                  <div className="group relative h-full bg-card border-2 border-border rounded-md overflow-hidden hover:border-primary hover:shadow-card transition-all flex flex-col">
                    <div className="relative bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary ring-2 ring-primary-foreground/30">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display uppercase text-base sm:text-lg leading-tight tracking-wide truncate">{card.tag}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 truncate">{card.subtitle}</div>
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={card.img} alt={card.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent" />
                      <Icon className="absolute top-3 right-3 h-14 w-14 text-primary/30" strokeWidth={1.5} />
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1">For {card.tag}</div>
                        <div className="font-display uppercase text-white text-xl leading-tight">{card.title}</div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                      <a href="#quote" className="mt-5 inline-flex items-center justify-between gap-2 rounded-sm border-2 border-primary px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        {card.cta} <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRANDS — animated branded logo grid */}
      <section className="py-16 sm:py-20 bg-gradient-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 topo-bg opacity-30" aria-hidden />
        <div className="relative container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Brands We Move Daily</p>
            <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase">
              Every Major <span className="text-primary">Tractor Brand</span>
            </h2>
            <p className="text-white/70 mt-3">
              Each brand has its own quirks — cab heights, dual setups, hydraulic protection. Our drivers know them all.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {BRANDS.map((b, i) => (
              <div
                key={b.name}
                className="group relative h-24 flex items-center justify-center rounded-lg bg-white border-2 border-white/20 shadow-lg transition-all duration-300 animate-fade-in overflow-hidden hover:-translate-y-1 hover:scale-[1.04]"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "both",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = b.accent; e.currentTarget.style.boxShadow = `0 18px 40px -12px ${b.accent}aa`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${b.accent}14, transparent 65%)` }}
                  aria-hidden
                />
                <div className="relative transition-transform duration-300 group-hover:scale-110">
                  {b.logo()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-14 sm:py-20 bg-secondary text-secondary-foreground">
        <div className="container-tight">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Recent Loads</p>
              <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
                Tractors <span className="text-primary">On The Road</span>
              </h2>
            </div>
            <p className="text-white/70 text-sm max-w-md md:text-right">
              A snapshot of recent tractor hauls — properly strapped, permitted, and delivered on schedule.
            </p>
          </Reveal>

          <Carousel opts={{ loop: true, align: "start", watchFocus: false }} plugins={[autoplay.current]} className="relative">
            <CarouselContent className="-ml-3">
              {GALLERY.map((src, i) => (
                <CarouselItem key={i} className="pl-3 basis-full sm:basis-1/2 lg:basis-1/4">
                  <div className="group relative overflow-hidden rounded-sm aspect-[4/3] border border-white/10">
                    <img src={src} alt={`Tractor transport example ${i + 1}`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/10 to-transparent" />
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-lg">
                      <CheckCircle2 className="h-3 w-3" /> Delivered
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Load #{String(1240 + i * 37).padStart(4, "0")}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/80">
                        {["IA → TX","NE → CA","IL → GA","ND → OK","KS → CO","MN → WI","OH → IN","SD → MT"][i % 8]}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" />
            <CarouselNext className="right-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" />
          </Carousel>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container-tight">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">How It Works</p>
          <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-10">
            Tractor To Trailer <span className="text-primary">In 4 Steps</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-card border border-border rounded-md p-6 hover:border-primary hover:shadow-card transition-all">
                <div className="stencil text-5xl text-primary mb-3">{s.n}</div>
                <h3 className="font-display uppercase text-lg mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-10 sm:py-12 bg-gradient-dark border-y border-white/10">
        <div className="container-tight grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { end: 4.9, decimals: 1, suffix: "", label: "Avg. Rating", sub: "1,200+ tractor loads" },
            { end: 15, decimals: 0, suffix: "+", label: "Years", sub: "Hauling tractors" },
            { end: 8, decimals: 0, suffix: "K+", label: "Tractors", sub: "Delivered safely" },
            { end: 50, decimals: 0, suffix: "", label: "States", sub: "Nationwide coverage" },
          ].map((s) => (
            <div key={s.label}>
              <div className="stencil text-3xl sm:text-4xl text-primary">
                <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} duration={2000} />
              </div>
              <div className="font-bold uppercase tracking-wider text-sm text-white mt-1">{s.label}</div>
              <div className="text-xs text-white/60 uppercase tracking-widest mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Why Choose Us</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              Why Shippers Pick Us For <span className="text-primary">Tractor Transport</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map(({ icon: Icon, t, d }) => (
              <div key={t} className="bg-card border border-border rounded-md p-6 hover:border-primary hover:shadow-card transition-all">
                <span className="inline-flex h-11 w-11 rounded-full bg-primary/15 text-primary items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display uppercase text-base mb-1.5">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHIPPER'S GUIDE */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="container-tight grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">The Shipper's Guide</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase mb-5">
              What Drives <span className="text-primary">Your Tractor Quote</span>
            </h2>
            <div className="space-y-4 text-foreground/85">
              <p>
                Tractor shipping rates come down to four variables: <strong>dimensions</strong>, <strong>weight</strong>, <strong>route</strong>, and <strong>trailer type</strong>. A 60 HP Kubota on a hot shot is a completely different load than a 620 HP Case IH Steiger that needs an RGN, two pilot cars, and bridge clearances mapped from origin to destination.
              </p>
              <p>
                Most row-crop tractors hit the 8'6" legal width with duals on — pulling the outer wheels usually saves several hundred dollars in permits. Articulated 4WDs almost always require overweight permits and frequently overheight, depending on the cab.
              </p>
              <p>
                We ship from <strong>dealers</strong>, <strong>auction yards</strong> (Ritchie Bros., Purple Wave, IronPlanet), <strong>private farms</strong>, and across the border to Canada and Mexico. Same-week pickup is standard on every U.S. lane.
              </p>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-md p-4"><Ruler className="h-5 w-5 text-primary mb-2" /><div className="font-display uppercase text-sm">Dimensions</div><div className="text-xs text-muted-foreground">Width, height, length with duals & weights.</div></div>
              <div className="bg-card border border-border rounded-md p-4"><Gauge className="h-5 w-5 text-primary mb-2" /><div className="font-display uppercase text-sm">Weight</div><div className="text-xs text-muted-foreground">Loaded weight drives axle & permit costs.</div></div>
              <div className="bg-card border border-border rounded-md p-4"><Wrench className="h-5 w-5 text-primary mb-2" /><div className="font-display uppercase text-sm">Prep</div><div className="text-xs text-muted-foreground">Duals off, weights pulled, fluids capped.</div></div>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <img src={loadedTractor} alt="Tractor secured on heavy haul trailer" loading="lazy" width={1024} height={768} className="w-full rounded-md border border-border object-cover aspect-[4/3]" />
            <div className="mt-5 bg-secondary text-secondary-foreground rounded-md p-6 border-l-4 border-primary">
              <p className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Nationwide Tractor Lanes
              </p>
              <p className="text-white/85">
                Top tractor lanes we run weekly: <strong>IA → TX</strong>, <strong>NE → CA</strong>, <strong>IL → GA</strong>, <strong>ND → OK</strong>, and every dealer-to-farm route in between.
              </p>
              <Link to="/lanes" className="mt-3 inline-flex items-center gap-2 text-primary font-bold uppercase text-sm hover:underline">
                Browse Shipping Lanes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* CONVERSION CTA BANNER */}
      <section className="relative overflow-hidden bg-gradient-amber text-primary-foreground">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(0,0,0,0.18) 14px, rgba(0,0,0,0.18) 28px)" }} />
        <div className="relative container-tight py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-40" />
              <Phone className="relative h-5 w-5" />
            </span>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] opacity-90">Dispatcher Online Now</div>
              <div className="font-display uppercase text-2xl sm:text-3xl leading-tight">
                Get Your Tractor Quote In 60 Seconds
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${PHONE}`}>
              <Button variant="call" size="xl" className="hover-scale"><Phone /> Call {DISPLAY}</Button>
            </a>
            <a href="#quote">
              <Button size="xl" className="bg-secondary text-white hover:bg-secondary/90 hover-scale font-bold uppercase tracking-wide">
                Get Free Quote <ArrowRight />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* STATE LOCATIONS with real state flags */}
      <section className="py-14 sm:py-20 bg-muted/40 border-t border-border">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Service Locations</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              Tractor Shipping <span className="text-primary">By State</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              We dispatch tractor loads in every U.S. state. Click your state for lane-specific tractor shipping details.
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {states.map((st) => (
              <li key={st.slug}>
                <Link
                  to={`/services/${cat.slug}/state/${st.slug}`}
                  className="group flex items-center gap-3 bg-card border border-border rounded-md px-3 py-2.5 hover:border-primary hover:shadow-card transition-all"
                >
                  <img
                    src={`https://flagcdn.com/w80/us-${st.abbr.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w160/us-${st.abbr.toLowerCase()}.png 2x`}
                    alt={`${st.name} state flag`}
                    loading="lazy"
                    width={40}
                    height={26}
                    className="h-7 w-10 shrink-0 object-cover rounded-sm border border-border bg-secondary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-foreground group-hover:text-primary truncate leading-tight">
                      {st.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Tractor Shipping
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container-tight max-w-4xl">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Tractor Shipping FAQ</p>
          <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-8">
            Straight Answers <span className="text-primary">From Dispatch</span>
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="bg-card border border-border rounded-md px-5">
                <AccordionTrigger className="font-display uppercase text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default TractorPage;
