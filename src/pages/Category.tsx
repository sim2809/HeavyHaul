import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, ChevronRight, Phone, ShieldCheck, Truck, CheckCircle2, MapPin, Clock, DollarSign, Users, FileCheck, Headphones, Star, TrendingUp, Zap, Award, BadgeCheck, Gavel, Package, Building2, HardHat } from "lucide-react";
import RecentShipmentsTicker from "@/components/RecentShipmentsTicker";
import CountUp from "@/components/CountUp";
import { Reveal } from "@/hooks/useInView";
import { findCategory, findState, categories, states } from "@/data/categories";
import SEO from "@/components/SEO";
import InstantQuoteCalculator from "@/components/InstantQuoteCalculator";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import NotFound from "./NotFound";
import ServiceDetail, { NON_FREIGHT_SLUGS } from "./ServiceDetail";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import loadedBobcat from "@/assets/gallery/loaded-bobcat.jpg";
import loadedBulldozer from "@/assets/gallery/loaded-bulldozer.jpg";
import loadedCnc from "@/assets/gallery/loaded-cnc.jpg";
import loadedCombine from "@/assets/gallery/loaded-combine.jpg";
import loadedExcavator from "@/assets/gallery/loaded-excavator.jpg";
import loadedForklift from "@/assets/gallery/loaded-forklift.jpg";
import loadedLoader from "@/assets/gallery/loaded-loader.jpg";
import loadedTractor from "@/assets/gallery/loaded-tractor.jpg";
import truckSemi from "@/assets/truck-semi.jpg";
import truckDump from "@/assets/truck-dump.jpg";
import truckFire from "@/assets/truck-fire.jpg";
import truckTow from "@/assets/truck-tow.jpg";
import truckBus from "@/assets/truck-bus.jpg";
import indTransformer from "@/assets/industrial-transformer.jpg";
import indCnc from "@/assets/industrial-cnc.jpg";
import indGenerator from "@/assets/industrial-generator.jpg";
import indWindblade from "@/assets/industrial-windblade.jpg";

const ALL_GALLERY = [loadedExcavator, loadedBulldozer, loadedLoader, loadedBobcat, loadedCombine, loadedTractor, loadedCnc, loadedForklift];

const GALLERY_BY_CAT: Record<string, string[]> = {
  "construction-equipment-transport": [loadedExcavator, loadedBulldozer, loadedLoader, loadedBobcat, loadedForklift, loadedCnc, loadedTractor, loadedCombine],
  "agricultural-equipment-transport": [loadedCombine, loadedTractor, loadedBulldozer, loadedLoader, loadedForklift, loadedExcavator, loadedBobcat, loadedCnc],
  "industrial-machinery-transport": [indTransformer, indCnc, indGenerator, indWindblade, loadedCnc, loadedForklift, loadedLoader, loadedExcavator],
  "heavy-duty-truck-transport": [truckSemi, truckDump, truckFire, truckTow, truckBus, loadedBulldozer, loadedLoader, loadedExcavator],
};

// Long-tail equipment lists for SEO / readability
const EQUIPMENT_LIST_BY_CAT: Record<string, string[]> = {
  "construction-equipment-transport": [
    "Air Curtain Destructor Transport","Amphibious Excavator Shipping","Arrow Boards Transport","Asphalt Plant Shipping","Asphalt Storage Tank Transport","Backhoe Shipping Services","Boom Lift Shipping Services","Bulldozer Hauling","Cable Plow Shipping","Cement Mill Transport","Clamshell Bucket Shipping","Cold Planer Delivery","Compact Demolition Robot Shipping","Concrete Laser Screed Machine Shipping","Construction Attachment Shipping","Construction Hoist Shipping","Conveyor Bridge Shipping","Crane Shipping","Crawler Carrier Shipping","Crawler Loader Hauling","Crushing Plant Shipping","Demolition Machine Transport","Drifter Drill Transport","Dumper & Mini Dumper Transport","Excavator Shipments","Forklift Shipping","Gravel Plant Shipping","Grinder Hauling","Hydraulic Gantry Shipping","Hydraulic Lift Transport","Industrial Rigging","Motor Grader Shipping","Oil Field / Gas Plant Equipment Shipping","Oversize Pump Transport","Paving Equipment Hauling","Paver Finisher Shipping","Pile Driver Shipping","Piling & Drilling Equipment Shipping","Pipelayer Vehicle Shipping","Prestressed Concrete Shipping","Pugmill Mixer Transport","Road Widener Shipping","Rock Wheel Shipping","Road Roller Shipping","Roadheader Shipping","Roofing Material Shipping","Scissor Lift Shipping","Scraper Transport","Skid-Steer Transport","Slipformer Paver Transport","Stabilized Soil Mixing Plant Transport","Surface Drill Shipping","Telescopic Handler Shipping","Trencher Shipping","Wheel Loader Shipping","Wheel Tractor Scraper Shipping",
  ],
  "agricultural-equipment-transport": [
    "Tractor Shipping Services","Row-Crop Tractor Transport","High-Horsepower Tractor Hauling","Articulated 4WD Tractor Shipping","Utility Tractor Transport","Compact Tractor Shipping","John Deere Combine Transport","Combine Harvester Transport","Combine Machinery Shipping","Corn Header Shipping","Grain Header Hauling","Harvesting Equipment Transport","Forage Harvester Hauling","Self-Propelled Sprayer Transport","Water Spraying Systems Transport","Dry Box Floater Shipping","Planting Machine Transport","Air Seeder Transport","Folding Planter Shipping","No-Till Drill Shipping","Grain Drill Transport","Strip-Till Bar Transport","Strip Till Rig Transport","Tillage Machine Transport Services","Disc Harrow Shipping","Disc Trencher Transport","Chisel Plow Transport","Field Cultivator Shipping","Vertical Tillage Tool Transport","Tandem Aerator Shipping Services","Roller Chopper Shipping","Ripper Transport","Round Baler Transport","Square Baler Shipping","Hay and Hay Equipment Transport","Self-Propelled Windrower Transport","Swather Transport","Mower Conditioner Shipping","Mower Shipping","Reaper Transport","Feed Mixer Transport","Feed Truck Trailer Shipping","Manure Spreader Shipping","Manure Tank Shipping","Grain Cart Transport","Auger Wagon Shipping","Auger Transport","Grain Bin Shipping","Grain Bin Hauling","Silo Transport","Bagger Transport","Irrigation Pivot Shipping","Pivot Transport","Hydraulic Power Pack Transport","Cotton Picker Transport","Cotton Stripper Shipping","Sugar Beet Harvester Transport","Potato Harvester Shipping","Shaker Equipment Transport","Bark Blower Shipping","Chip Spreader Hauling","Packer Transport","Lister Transport","Harrow Transport","Chopper Transport","Skid Steer for Farms","Compact Track Loader Shipping","Telehandler Transport","Loader Shipping","Barn Transport Services","Dairy Parlor Equipment Shipping","Livestock Trailer Transport","Poultry Equipment Shipping","Windmill Transport",
  ],
  "industrial-machinery-transport": [
    "CNC Machining Center Transport","Horizontal Mill Shipping","Vertical Mill Hauling","CNC Lathe Transport","Swiss-Type Lathe Shipping","5-Axis Machining Center Shipping","EDM Machine Transport","Surface Grinder Shipping","Stamping Press Hauling","Hydraulic Press Transport","Injection Molding Machine Shipping","Blow Molding Machine Transport","Industrial Generator Transport","Diesel Genset Shipping","Natural Gas Genset Hauling","Power Transformer Transport","Substation Transformer Shipping","Switchgear Transport","Boiler Shipping","Pressure Vessel Transport","Heat Exchanger Shipping","Industrial Compressor Transport","Air Handler Shipping","Chiller Transport","Cooling Tower Shipping","Distillation Column Transport","Reactor Vessel Shipping","Storage Tank Transport","Silo Shipping","Wind Turbine Blade Transport","Wind Turbine Nacelle Shipping","Wind Tower Section Transport","Solar Panel Bulk Shipping","Frac Pump Transport","Drilling Rig Shipping","Mud Pump Transport","Mining Truck Hauling","Rock Crusher Shipping","Conveyor System Transport","Plant Relocation Services",
  ],
  "heavy-duty-truck-transport": [
    "Sleeper Cab Semi Truck Transport","Day Cab Truck Shipping","Drive-Away Tractor Service","Single-Axle Dump Truck Hauling","Tandem-Axle Dump Truck Transport","Tri-Axle Dump Truck Shipping","Articulated Hauler Transport","Off-Highway Truck Shipping","Box Truck Transport","Straight Truck Shipping","Refrigerated Truck Transport","Flatbed Truck Hauling","Rollback Tow Truck Shipping","Wrecker Truck Transport","Heavy Wrecker Hauling","Rotator Tow Truck Shipping","Integrated Tow Truck Transport","Pumper Fire Truck Shipping","Ladder Fire Truck Transport","Aerial Apparatus Shipping","ARFF Fire Truck Hauling","Ambulance Transport","School Bus Shipping","Transit Bus Transport","Motorcoach Hauling","Shuttle Bus Shipping","Garbage Truck Transport","Front Loader Refuse Truck Shipping","Roll-Off Truck Hauling","Cement Mixer Truck Transport","Concrete Pumper Truck Shipping","Boom Truck Transport","Bucket Truck Shipping","Service Body Truck Transport","Fuel Tanker Truck Shipping","Vacuum Truck Hauling","Sweeper Truck Transport","Snow Plow Truck Shipping","Military Truck Transport","Specialty Vocational Truck Shipping",
  ],
};

const WHY_US = [
  { icon: ShieldCheck, t: "Fully Insured & DOT Compliant", d: "Up to $1M cargo coverage and full liability on every load — including specialty oversize permits." },
  { icon: Clock, t: "Same-Day Dispatch", d: "Live dispatchers route your load within minutes, with same-week pickup on most lanes nationwide." },
  { icon: DollarSign, t: "Transparent Pricing", d: "No hidden permit fees, no fuel surprises. One quote, locked in, all-in." },
  { icon: Users, t: "Vetted Carrier Network", d: "Pre-screened heavy haul specialists with verified safety scores and equipment-specific experience." },
  { icon: FileCheck, t: "Permits & Route Surveys", d: "We handle all 50-state permits, pilot cars, escorts, and bridge analysis in-house." },
  { icon: Headphones, t: "24/7 Load Tracking", d: "Real-time GPS updates and a dispatcher on call from pickup to proof of delivery." },
];

const CategoryPage = () => {
  const { categorySlug = "", stateSlug } = useParams();
  const cat = findCategory(categorySlug);
  const st = stateSlug ? findState(stateSlug) : undefined;
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  if (!cat) return <NotFound />;
  if (stateSlug && !st) return <NotFound />;
  if (NON_FREIGHT_SLUGS.includes(cat.slug)) return <ServiceDetail cat={cat} />;

  const gallery = GALLERY_BY_CAT[cat.slug] ?? ALL_GALLERY;
  const equipmentList = EQUIPMENT_LIST_BY_CAT[cat.slug] ?? cat.subcategories.map((s) => s.name);
  const shortLower = cat.short.toLowerCase();
  const flagUrl = st ? `https://flagcdn.com/w1280/us-${st.abbr.toLowerCase()}.png` : "";
  const flagBadge = st ? `https://flagcdn.com/w80/us-${st.abbr.toLowerCase()}.png` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: cat.name,
    provider: { "@type": "MovingCompany", name: "Heavy Haul Group", telephone: "+1-800-555-0199" },
    areaServed: "United States",
    description: cat.blurb,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: cat.name,
      itemListElement: cat.subcategories.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name },
      })),
    },
  };

  return (
    <>
      <SEO
        title={st ? `${st.name} ${cat.short} Transport | Heavy Haul Group` : `${cat.name} | Nationwide Heavy Haul - Heavy Haul Group`}
        description={st
          ? `${st.name} ${shortLower} transport with same-day dispatch. Permits, pilot cars, and fully insured ${shortLower} carriers serving every ${st.name} city.`
          : `${cat.blurb} Same-day dispatch, fully insured, DOT compliant. Get your free ${shortLower} transport quote today.`}
        path={st ? `/services/${cat.slug}/state/${st.slug}` : `/services/${cat.slug}`}
        image={cat.image}
        jsonLd={jsonLd}
      />

      {/* HERO with embedded QUOTE FORM */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <img
          src={cat.image}
          alt={`${cat.name} loaded on heavy haul trailer`}
          className="absolute inset-0 h-full w-full object-cover opacity-95"
          loading="eager"
          width={1920}
          height={900}
        />
        {/* lighter overlay — much more visible imagery */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/20" />

        <div className="relative container-tight py-14 lg:py-24">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="h-3 w-3" />
            {st ? (
              <>
                <Link to={`/services/${cat.slug}`} className="hover:text-primary">{cat.short}</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{st.name}</span>
              </>
            ) : (
              <span className="text-primary">{cat.short}</span>
            )}
          </nav>

          {/* Giant ghost state flag watermark when on a state page */}
          {st && (
            <img
              src={flagUrl}
              alt=""
              aria-hidden
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-[520px] w-auto opacity-20 mix-blend-screen pointer-events-none"
            />
          )}

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                {st ? (
                  <>
                    <img
                      src={flagBadge}
                      alt={`${st.name} flag`}
                      className="h-3.5 w-5 object-cover rounded-[2px]"
                    />
                    Serving All Of {st.name} · {st.abbr}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" /> Nationwide · Fully Insured · 24/7 Dispatch
                  </>
                )}
              </div>
              <h1 className="stencil text-4xl sm:text-6xl lg:text-7xl font-bold uppercase max-w-3xl leading-[0.95]">
                {st ? (
                  <>{st.name} <span className="text-primary">{cat.short} Transport</span></>
                ) : (
                  <>{cat.name.split(" ").slice(0, -1).join(" ")} <span className="text-primary">{cat.name.split(" ").slice(-1)}</span></>
                )}
              </h1>
              <p className="mt-5 text-lg text-white/85 max-w-2xl">
                {st
                  ? `Nationwide ${shortLower} heavy haul carriers dispatching loads in and out of ${st.name} every day — permits, pilot cars, and oversize escorts handled in-house for every ${st.abbr} corridor.`
                  : cat.blurb}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${PHONE}`}>
                  <Button variant="hero" size="xl"><Phone /> Call {DISPLAY}</Button>
                </a>
                <a href="#quote">
                  <Button variant="call" size="xl">{st ? `Free ${st.abbr} Quote` : "Get Free Quote"} <ArrowRight /></Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-white/80">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> $1M Cargo Insured</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {st ? `All ${st.name} Counties` : "All 50 States"}</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Same-Day Dispatch</span>
              </div>
            </div>

            <aside id="quote" className="lg:col-span-5 scroll-mt-24">
              <InstantQuoteCalculator />
            </aside>
          </div>
        </div>

        {/* Animated divider line */}
        <div className="relative h-[3px] w-full overflow-hidden bg-secondary-foreground/10">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_hsl(var(--primary))] animate-sweep-x" />
        </div>
      </section>

      <RecentShipmentsTicker />


      {/* WHO WE ARE — two-column with image */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Reveal>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">{st ? `${st.name} Heavy Haul` : "Who We Are"}</p>
              <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-5 leading-[0.95]">
                {st ? (
                  <>{cat.short} Shipping <span className="text-primary">In {st.name}</span></>
                ) : (
                  <>Reliable {cat.short} <span className="text-primary">Heavy Haul Carriers</span></>
                )}
              </h2>
            </Reveal>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>
                {st
                  ? `Heavy Haul Group is the ${st.name} ${shortLower} transport company shippers call when the load matters. We move ${shortLower} equipment to, from, and within every ${st.name} county — same-day dispatch, ${st.abbr} state permits filed in-house, and a dispatcher you can reach 24/7.`
                  : `Heavy Haul Group is a nationwide ${shortLower} transport company dispatching ${shortLower} loads across all 50 states every single day. From single-piece moves to multi-load fleet relocations, our specialists handle permits, pilot cars, route surveys, bridge analysis, and oversize escorts — start to finish.`}
              </p>
              <p>
                {st
                  ? `From dealer-to-jobsite deliveries inside ${st.name} to multi-state ${shortLower} fleet relocations out of ${st.abbr}, our carriers run RGN, lowboy, step deck, flatbed, and multi-axle trailers permitted for every ${st.name} corridor. Whether you need ${shortLower} hauling across ${st.name} or coast-to-coast, we quote in minutes and pick up in days.`
                  : `We move ${shortLower} equipment for contractors, dealers, rental yards, OEM manufacturers, auction houses, and Fortune-500 operators. Emergency breakdown haul or recurring monthly fleet rotations — our dispatchers match your load to the closest available ${shortLower} carrier and quote in minutes.`}
              </p>
              <p className="text-foreground font-medium">
                Every shipment is backed by up to $1M in cargo coverage, full DOT/MC compliance, real-time GPS tracking, and a dedicated dispatcher you can reach 24/7.
              </p>
            </div>
            <ul className="mt-7 grid sm:grid-cols-2 gap-2.5">
              {[
                "Permits, pilot cars & route surveys",
                "$1M cargo & full liability insured",
                "Vetted heavy haul carrier network",
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
                src={cat.image}
                alt={`${cat.name} on the road`}
                loading="lazy"
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-1">Trusted Nationwide</div>
                <div className="font-display uppercase text-lg leading-tight">{cat.name}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST CERTIFICATION STRIP */}
      <section className="bg-secondary border-y border-white/10">
        <div className="container-tight py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/70">
          <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> FMCSA Licensed</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> $1M Cargo Insured</span>
          <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> Bonded & Compliant</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> 50-State Authority</span>
          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" /> BBB A+ Rated</span>
        </div>
      </section>


      {/* WHO WE SERVE — audience cards */}
      <section className="py-14 sm:py-20 bg-background border-t border-border">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Who We Haul For</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              One Load Or A <span className="text-primary">Full Fleet</span> — We Handle It
            </h2>
            <p className="text-muted-foreground mt-3">
              From a single auction win to year-round dealer freight, our {shortLower} dispatch team is built to scale with you.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                img: gallery[0],
                icon: Gavel,
                tag: "Auction Buyers",
                title: "Bought At Auction",
                subtitle: "Ritchie Bros · IronPlanet · Purple Wave",
                desc: `Won a piece at auction? We pick up directly from the auction yard and deliver to your jobsite — title, gate pass, and load-out handled.`,
                bullets: ["Yard pickup coordination", "Same-week dispatch", "Pay-after-pickup options"],
                cta: "Quote My Auction Win",
              },
              {
                img: gallery[1],
                icon: Package,
                tag: "One-Time Shipper",
                title: "Single Move",
                subtitle: "Private sellers · Owner-operators",
                desc: `Selling, relocating, or moving one machine? You get the same white-glove dispatch as a fleet customer — no minimums, no runaround.`,
                bullets: ["No volume required", "Insured door-to-door", "Real human dispatcher"],
                cta: "Ship One Machine",
              },
              {
                img: gallery[2],
                icon: Building2,
                tag: "Dealers & Rentals",
                title: "Consistent Freight",
                subtitle: "Dealers · Rental yards · OEMs",
                desc: `Ship with us week after week. Dedicated account reps, custom lane pricing, fleet portal, and Net-30 terms for qualified accounts.`,
                bullets: ["Dedicated account rep", "Volume lane pricing", "Net-30 billing"],
                cta: "Open A Dealer Account",
              },
              {
                img: gallery[3],
                icon: HardHat,
                tag: "Contractors & Fleets",
                title: "Construction Co. Fleets",
                subtitle: "GCs · Site contractors · Public works",
                desc: `Contractors moving iron between jobsites get same-day dispatch, project-based COIs, and a dispatcher who knows your foreman by name.`,
                bullets: ["Jobsite-to-jobsite moves", "Project COIs in 15 min", "24/7 emergency dispatch"],
                cta: "Move My Fleet",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
              <Reveal key={card.title}>
                <div className="group relative h-full bg-card border-2 border-border rounded-md overflow-hidden hover:border-primary hover:shadow-card transition-all flex flex-col">
                  {/* Top accent bar with big label */}
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
                    <img
                      src={card.img}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent" />
                    {/* Big watermark icon */}
                    <Icon className="absolute top-3 right-3 h-14 w-14 text-primary/30" strokeWidth={1.5} />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1">For {card.tag}</div>
                      <div className="font-display uppercase text-white text-xl leading-tight">{card.title}</div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                    <ul className="mt-4 space-y-1.5">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[13px]">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="font-medium">{b}</span>
                        </li>
                      ))}
                    </ul>
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


      {/* GALLERY + EQUIPMENT LIST side by side */}
      <section className="py-14 sm:py-20 bg-secondary text-secondary-foreground">
        <div className="container-tight">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Recent Loads</p>
              <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
                {cat.short} <span className="text-primary">On The Road</span>
              </h2>
            </div>
            <p className="text-white/70 text-sm max-w-md md:text-right">
              A snapshot of recent {shortLower} hauls — properly strapped, permitted, and delivered on schedule.
            </p>
          </Reveal>

          <div className="space-y-8">
            {/* Equipment list — now appears FIRST */}
            <div className="bg-background/[0.04] border border-white/10 rounded-md p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                  <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-1">Equipment We Transport</p>
                  <h3 className="font-display uppercase text-xl leading-tight">
                    Common {cat.short} Equipment <span className="text-primary">We Ship</span>
                  </h3>
                </div>
                <a href="#quote" className="inline-flex items-center gap-2 text-primary font-bold uppercase text-sm hover:underline">
                  Don't see your equipment? Get a quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-1.5">
                {equipmentList.map((item) => {
                  const isTractor = item === "Tractor Shipping Services";
                  const href = isTractor ? `/services/agricultural-equipment-transport/tractor-transport` : "#quote";
                  return (
                    <li key={item}>
                      <Link
                        to={href}
                        className="group flex items-start gap-1.5 text-[13px] text-white/85 hover:text-primary transition-colors py-0.5"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-primary/70 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition" />
                        <span className="leading-snug">{item}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Full-width sliding gallery — 4 visible (now appears AFTER the equipment list) */}
            <Carousel
              opts={{ loop: true, align: "start", watchFocus: false }}
              plugins={[autoplay.current]}
              className="relative"
            >
              <CarouselContent className="-ml-3">
                {gallery.map((src, i) => (
                  <CarouselItem key={i} className="pl-3 basis-full sm:basis-1/2 lg:basis-1/4">
                    <div className="group relative overflow-hidden rounded-sm aspect-[4/3] border border-white/10">
                      <img
                        src={src}
                        alt={`${cat.short} transport example ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/10 to-transparent" />
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-lg">
                        <CheckCircle2 className="h-3 w-3" /> Delivered
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Load #{String(1240 + i * 37).padStart(4, "0")}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-white/80">
                          {["TX → CO","FL → GA","CA → AZ","IL → OH","NY → PA","WA → ID","NC → VA","MI → IN"][i % 8]}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" />
              <CarouselNext className="right-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" />
            </Carousel>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/70">
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" /> 4.9 / 5 · 2,400+ Reviews</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-primary" /> 18,000+ Loads Delivered</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> 60-Sec Quote Response</span>
            </div>
          </div>

        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-10 sm:py-12 bg-gradient-dark border-y border-white/10">
        <div className="container-tight grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { end: 4.9, decimals: 1, suffix: "", label: "Avg. Rating", sub: "2,400+ shippers" },
            { end: 15, decimals: 0, suffix: "+", label: "Years", sub: "In heavy haul" },
            { end: 18, decimals: 0, suffix: "K+", label: "Loads", sub: "Delivered safely" },
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

      {/* WHY CHOOSE US */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Why Choose Us</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              Why Shippers Pick Us For <span className="text-primary">{cat.short} Transport</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              Specialist carriers, in-house permits, and a dispatch team that actually answers the phone — built for {shortLower} freight.
            </p>
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
                Get Your {cat.short} Quote In 60 Seconds
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
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">{st ? "Other Locations" : "Service Locations"}</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              {st ? (
                <>{cat.short} Transport In <span className="text-primary">Other States</span></>
              ) : (
                <>{cat.name} <span className="text-primary">By State</span></>
              )}
            </h2>
            <p className="text-muted-foreground mt-3">
              We dispatch {shortLower} loads in every U.S. state. Click your state for lane-specific {cat.name.toLowerCase()} details.
            </p>
          </Reveal>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {states.filter((s) => !st || s.slug !== st.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  to={`/services/${cat.slug}/state/${other.slug}`}
                  className="group flex items-center gap-3 bg-card border border-border rounded-md px-3 py-2.5 hover:border-primary hover:shadow-card transition-all"
                >
                  <img
                    src={`https://flagcdn.com/w80/us-${other.abbr.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w160/us-${other.abbr.toLowerCase()}.png 2x`}
                    alt={`${other.name} state flag`}
                    loading="lazy"
                    width={40}
                    height={26}
                    className="h-7 w-10 shrink-0 object-cover rounded-sm border border-border bg-secondary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold text-foreground group-hover:text-primary truncate leading-tight">
                      {other.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {cat.short} Transport
                    </div>
                  </div>
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CATEGORY FAQs */}
      <section className="py-14 sm:py-20 bg-background border-t border-border">
        <div className="container-tight max-w-4xl">
          <Reveal className="text-center mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">FAQs</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              {cat.name} <span className="text-primary">FAQs</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              Straight answers to the questions {shortLower} shippers ask most before booking.
            </p>
          </Reveal>
          <Accordion type="single" collapsible defaultValue="cf-0" className="space-y-3">
            {[
              {
                q: `How much does ${shortLower} transport cost?`,
                a: `Most ${shortLower} loads run $2.50–$5.50 per mile depending on weight, dimensions, distance, and oversize permits. Send your equipment make, model, and lane for a locked-in all-in quote in under 10 minutes.`,
              },
              {
                q: `How fast can you pick up my ${shortLower} equipment?`,
                a: `Standard pickups dispatch within 24–48 hours. Same-day and emergency ${shortLower} dispatch is available — we have vetted carriers staged in every region of the U.S.`,
              },
              {
                q: `Do you handle permits, pilot cars, and route surveys?`,
                a: `Yes — every oversize/overweight ${shortLower} load gets full in-house permit handling, route surveys, bridge analysis, and pilot car / escort coordination across all 50 states.`,
              },
              {
                q: `Is my ${shortLower} equipment insured in transit?`,
                a: `Every load carries up to $1M in cargo coverage plus $1M liability. Certificates of insurance are issued within 15 minutes of booking — name your project, jobsite, or lender as additional insured at no charge.`,
              },
              {
                q: `What trailers do you use for ${shortLower} transport?`,
                a: `Depending on your load: RGN/lowboy for tall and tracked equipment, step deck for medium height, flatbed for standard, and multi-axle/perimeter trailers for superloads. We match the right trailer to your exact spec.`,
              },
              {
                q: `Do you ship ${shortLower} to Canada or Mexico?`,
                a: `Yes — fully licensed cross-border ${shortLower} transport with customs brokerage, FAST/CTPAT clearance, and bilingual dispatch for Canada and Mexico lanes.`,
              },
            ].map((f, i) => (
              <AccordionItem
                key={i}
                value={`cf-${i}`}
                className="bg-card border border-border rounded-md px-5 shadow-sm hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-sans font-extrabold text-base sm:text-lg text-foreground hover:no-underline hover:text-primary py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* RELATED CATEGORIES */}
      <section className="py-14 bg-background border-t border-border">
        <div className="container-tight">
          <Reveal>
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4">Related Services</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.filter((c) => c.slug !== cat.slug).slice(0, 6).map((c) => (
              <Link key={c.slug} to={`/services/${c.slug}`} className="group flex items-center gap-4 bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                <img src={c.image} alt={c.name} loading="lazy" className="h-16 w-20 object-cover rounded-sm" width={80} height={64} />
                <div className="flex-1">
                  <div className="font-display uppercase text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.subcategories.length} sub-services</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
