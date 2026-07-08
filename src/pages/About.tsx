import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Award, Users, Truck, MapPin, BadgeCheck, Mail, Phone,
  Heart, Target, Compass, HandshakeIcon, ArrowRight, Quote, Star,
  CheckCircle2, Clock, FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import mikeImg from "@/assets/dispatcher-mike.jpg";
import sarahImg from "@/assets/dispatcher-sarah.jpg";
import carlosImg from "@/assets/dispatcher-carlos.jpg";
import dannyImg from "@/assets/dispatcher-danny.jpg";
import trailerLowboy from "@/assets/trailer-lowboy.jpg";
import trailerStepdeck from "@/assets/trailer-stepdeck.jpg";
import trailerFlatbed from "@/assets/trailer-flatbed.jpg";
import trailerMultiaxle from "@/assets/trailer-multiaxle.jpg";
import trailerStretch from "@/assets/trailer-stretch.jpg";
import trailerHotshot from "@/assets/trailer-hotshot.jpg";
import magTruck from "@/assets/truck-semi.jpg";
import magTransformer from "@/assets/industrial-transformer.jpg";
import magHero from "@/assets/hero-trucks.jpg";
import { EC } from "@/hooks/useSiteContent";

const US_STATES: { name: string; abbr: string }[] = [
  ["Alabama","AL"],["Alaska","AK"],["Arizona","AZ"],["Arkansas","AR"],["California","CA"],
  ["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["Florida","FL"],["Georgia","GA"],
  ["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],["Indiana","IN"],["Iowa","IA"],
  ["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],["Maine","ME"],["Maryland","MD"],
  ["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],["Mississippi","MS"],["Missouri","MO"],
  ["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],["New Hampshire","NH"],["New Jersey","NJ"],
  ["New Mexico","NM"],["New York","NY"],["North Carolina","NC"],["North Dakota","ND"],["Ohio","OH"],
  ["Oklahoma","OK"],["Oregon","OR"],["Pennsylvania","PA"],["Rhode Island","RI"],["South Carolina","SC"],
  ["South Dakota","SD"],["Tennessee","TN"],["Texas","TX"],["Utah","UT"],["Vermont","VT"],
  ["Virginia","VA"],["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"],
].map(([name, abbr]) => ({ name, abbr }));

const team = [
  { id: "m1", img: mikeImg },
  { id: "m2", img: sarahImg },
  { id: "m3", img: carlosImg },
  { id: "m4", img: dannyImg },
];
const teamDefaults: Record<string, { name: string; role: string; years: string; quote: string }> = {
  m1: { name: "Mike Reilly",     role: "Senior Dispatcher",   years: "12 yrs", quote: '"Every load is personal."' },
  m2: { name: "Sarah Coleman",   role: "Permits & Routing",   years: "9 yrs",  quote: '"Paperwork before pavement."' },
  m3: { name: "Carlos Alvarez",  role: "Oversize Specialist", years: "15 yrs", quote: '"If it\'s wide, I\'ve moved it."' },
  m4: { name: "Danny Williams",  role: "Heavy Haul Lead",     years: "11 yrs", quote: '"On time. Every time."' },
};

const trailers = [
  { id: "t1", img: trailerLowboy,    name: "Lowboy / RGN",         cap: "Up to 150,000 lbs",  desc: "Removable goosenecks for dozers, cranes, transformers." },
  { id: "t2", img: trailerStepdeck,  name: "Step Deck",            cap: "Up to 48,000 lbs",   desc: "Drop deck for tall loads — legal to 10'2\" without permits." },
  { id: "t3", img: trailerFlatbed,   name: "Flatbed (48' / 53')",  cap: "Up to 48,000 lbs",   desc: "Workhorse for machinery, steel, pipe, lumber, building materials." },
  { id: "t4", img: trailerMultiaxle, name: "Multi-Axle",           cap: "Up to 500,000 lbs",  desc: "Beam, jeep & booster combos for super-loads and heavy iron." },
  { id: "t5", img: trailerStretch,   name: "Stretch / Extendable", cap: "Up to 80' long",     desc: "Extendable decks for over-length loads beyond 53 ft." },
  { id: "t6", img: trailerHotshot,   name: "Hot Shot / Gooseneck", cap: "Up to 40,000 lbs",   desc: "Fast, flexible smaller loads — same-day pickup available." },
];

const values = [
  { id: "v1", icon: HandshakeIcon, title: "Honest",         desc: "Straight rates. No bait-and-switch. We quote what we mean." },
  { id: "v2", icon: ShieldCheck,   title: "Dependable",     desc: "We show up on time, with the right trailer, every single time." },
  { id: "v3", icon: Heart,         title: "Customer First", desc: "Your load is treated like it's our own — from quote to delivery." },
  { id: "v4", icon: Target,        title: "Accountable",    desc: "One dispatcher owns your load end-to-end. No call-center hand-offs." },
];

const trustCards = [
  { id: "tc1", icon: ShieldCheck, title: "Fully Insured",      desc: "$1M cargo + liability on every single load." },
  { id: "tc2", icon: BadgeCheck,  title: "DOT Compliant",      desc: "MC & USDOT authority. Every carrier vetted before dispatch." },
  { id: "tc3", icon: Users,       title: "Expert Dispatchers", desc: "Decades of heavy haul experience — answering on the second ring." },
  { id: "tc4", icon: Truck,       title: "Right Trailers",     desc: "Lowboys, RGNs, step decks, multi-axles — always in stock." },
  { id: "tc5", icon: MapPin,      title: "All 50 States",      desc: "Coast to coast. Door to door. Port pickups and cross-border too." },
  { id: "tc6", icon: Award,       title: "4.9★ Avg. Rating",   desc: "From 2,400+ verified shippers and equipment dealers." },
];

const trustStrip = [
  { id: "ts1", icon: ShieldCheck, top: "$1,000,000", bot: "Cargo Insurance" },
  { id: "ts2", icon: FileCheck,   top: "MC & USDOT", bot: "Fully Authorized" },
  { id: "ts3", icon: Award,       top: "A+ BBB",     bot: "Accredited" },
  { id: "ts4", icon: Clock,       top: "24 / 7",     bot: "Live Dispatch" },
];

const insideIssue = [
  { id: "io1", n: "01", l: "Who We Are",       href: "who-we-are" },
  { id: "io2", n: "02", l: "Mission & Values", href: "mission" },
  { id: "io3", n: "03", l: "The Dispatch Floor", href: "our-team" },
  { id: "io4", n: "04", l: "Our Trailers",     href: "trailers" },
  { id: "io5", n: "05", l: "Coast To Coast",   href: "states-we-serve" },
  { id: "io6", n: "06", l: "Get In Touch",     href: "contact-us" },
];

const stats = [
  { id: "st1", v: "18",     l: "Years on the road" },
  { id: "st2", v: "2,400+", l: "Verified shippers" },
  { id: "st3", v: "50",     l: "States covered" },
];

const promiseList = [
  { id: "pl1", t: "One dispatcher per load — no hand-offs, no confusion." },
  { id: "pl2", t: "Permits & escorts handled in-house for oversize moves." },
  { id: "pl3", t: "Photo updates at pickup, in-transit checkpoints, and delivery." },
  { id: "pl4", t: "Bonded for cross-border into Canada and Mexico." },
  { id: "pl5", t: "Catastrophic & emergency recovery available 24/7." },
];

const About = () => {
  return (
  <>
    <SEO
      title="About Heavy Haul Group | Heavy Haul & Oversize Load Carriers"
      description="Heavy Haul Group is a nationwide heavy haul and oversize load transport network — honest, dependable, fully insured, DOT compliant, with vetted carriers in all 50 states."
      path="/about"
    />

    {/* COVER */}
    <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={magHero} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.3),transparent_55%)]" />

      <div className="container-tight relative py-16 lg:py-24">
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-white/70">
          <EC page="about" k="masthead_left"   defaultText="Heavy Haul Group · The Magazine" as="span" className="text-primary" />
          <EC page="about" k="masthead_center" defaultText="Issue No. 01 · 2026" as="span" className="hidden sm:inline" />
          <EC page="about" k="masthead_right"  defaultText="Vol. XVIII · Nationwide Edition" as="span" />
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <EC page="about" k="cover_eyebrow" defaultText="Cover Feature · About Us" as="p" className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4" />
            <h1 className="stencil text-5xl sm:text-7xl lg:text-[7.5rem] font-bold uppercase leading-[0.88]">
              <EC page="about" k="cover_title_1" defaultText="Honest." /> <br />
              <EC page="about" k="cover_title_2" defaultText="Dependable." /> <br />
              <EC page="about" k="cover_title_3" defaultText="Customer-First." as="span" className="text-primary" />
            </h1>
            <EC page="about" k="cover_subtitle" kind="textarea"
              defaultText="A nationwide heavy haul network moving oversize loads, construction equipment, agricultural machinery, industrial freight, and heavy duty trucks across all 50 states."
              as="p" className="mt-7 text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed" />
          </div>
          <aside className="lg:col-span-4 space-y-3">
            <div className="bg-white/5 backdrop-blur border border-white/15 rounded-md p-5">
              <EC page="about" k="cover_aside_heading" defaultText="Inside This Issue" as="p" className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-3" />
              <ol className="space-y-2 text-sm">
                {insideIssue.map((io) => (
                  <li key={io.id}>
                    <a href={`#${io.href}`} className="group flex items-baseline justify-between gap-3 hover:text-primary transition">
                      <span className="flex items-baseline gap-3 min-w-0">
                        <EC page="about" k={`${io.id}_n`} defaultText={io.n} as="span" className="stencil text-primary text-base shrink-0" />
                        <EC page="about" k={`${io.id}_l`} defaultText={io.l} as="span" className="font-display uppercase truncate" />
                      </span>
                      <span className="flex-1 border-b border-dotted border-white/20 mb-1" />
                      <ArrowRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <a href={`tel:${PHONE}`} className="block bg-primary text-secondary rounded-md p-4 shadow-cta hover:shadow-lg transition">
              <EC page="about" k="cover_phone_label" defaultText="24/7 Direct Line" as="div" className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-70" />
              <div className="stencil text-2xl flex items-center gap-2 mt-1"><Phone className="h-5 w-5" />
                <EC page="about" k="cover_phone_number" defaultText={DISPLAY} as="span" />
              </div>
            </a>
          </aside>
        </div>
      </div>

      {/* Trust strip */}
      <div className="relative border-t border-white/15 bg-black/30">
        <div className="container-tight grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
          {trustStrip.map(({ id, icon: Icon, top, bot }) => (
            <div key={id} className="flex items-center gap-2.5 px-3 sm:px-5 py-3.5">
              <span className="h-8 w-8 rounded-md bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <div className="leading-tight min-w-0">
                <EC page="about" k={`${id}_top`} defaultText={top} as="div" className="font-extrabold text-sm truncate" />
                <EC page="about" k={`${id}_bot`} defaultText={bot} as="div" className="text-[10px] uppercase tracking-wider text-white/60 font-bold truncate" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CHAPTER 01 */}
    <section id="who-we-are" className="py-16 lg:py-24 bg-background scroll-mt-24 relative overflow-hidden">
      <div className="container-tight relative">
        <div className="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
          <div>
            <EC page="about" k="ch1_kicker" defaultText="Our Story" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <p className="font-display uppercase text-xs text-muted-foreground tracking-widest">Chapter <EC page="about" k="ch1_num" defaultText="01" /></p>
          </div>
          <span className="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">01</span>
        </div>
        <h2 className="stencil text-4xl sm:text-6xl lg:text-7xl uppercase font-bold leading-[0.92] max-w-5xl">
          <EC page="about" k="ch1_title" defaultText="Built On Trust. Forged In Iron. Driven By People." kind="textarea" />
        </h2>
        <EC page="about" k="ch1_intro" kind="textarea"
          defaultText="A heavy haul transport company built around customer trust — with a dispatch floor that picks up on the second ring, any hour of the day."
          as="p" className="mt-5 text-muted-foreground text-lg max-w-3xl leading-relaxed" />

        <div className="mt-12 grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <article className="text-foreground text-[16px] leading-[1.8] sm:columns-2 sm:gap-10 [column-fill:_balance]">
              <EC page="about" k="ch1_p1" kind="textarea"
                defaultText="We're a heavy haul transport company built around customer trust. We listen to your specific shipping needs and take our expertise and professionalism to the next level — giving you the best transportation experience on the road."
                as="p" className="first-letter:stencil first-letter:text-primary first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]" />
              <EC page="about" k="ch1_p2" kind="textarea"
                defaultText="Whether it's a farming & agriculture vehicle, industrial machinery, vocational freight, a full truck fleet or any oversize cargo — Heavy Haul Group can and will get it where it needs to be. Fill out our free estimate form or call us anytime, day or night."
                as="p" className="mt-4" />
              <EC page="about" k="ch1_p3" kind="textarea"
                defaultText="We started with one dispatcher and one phone line in 2008. Today our 50-state network moves thousands of loads a year for equipment dealers, auction buyers, OEM plants, contractors, and farmers — but the rule hasn't changed: one dispatcher owns your load, end to end."
                as="p" className="mt-4" />
              <EC page="about" k="ch1_p4" kind="textarea"
                defaultText="No call-center hand-offs. No mystery surcharges at delivery. Just iron moved right, on time, every time."
                as="p" className="mt-4" />
            </article>

            <figure className="mt-10 border-l-4 border-primary pl-6">
              <Quote className="h-7 w-7 text-primary mb-2" />
              <blockquote className="font-display uppercase text-2xl sm:text-3xl leading-tight text-foreground">
                <EC page="about" k="ch1_quote" kind="textarea" defaultText={`"If it rolls, tracks, lifts, drills or hauls — we'll get it where it needs to be."`} />
              </blockquote>
              <EC page="about" k="ch1_quote_attr" defaultText="— The Dispatch Floor" as="figcaption" className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground font-bold" />
            </figure>
          </div>

          <aside className="lg:col-span-5">
            <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[480px] sm:h-[560px]">
              <figure className="col-span-6 row-span-4 relative overflow-hidden rounded-md border border-border group">
                <img src={magHero} alt="Heavy haul fleet at sunset" loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent" />
                <figcaption className="absolute bottom-3 left-3 right-3">
                  <EC page="about" k="ch1_cover_eyebrow" defaultText="Cover Story" as="p" className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary" />
                  <EC page="about" k="ch1_cover_title"   defaultText="Heavy Iron, Moved Right" as="p" className="font-display uppercase text-white text-lg leading-tight" />
                </figcaption>
              </figure>
              <figure className="col-span-3 row-span-2 relative overflow-hidden rounded-md border border-border group">
                <img src={magTruck} alt="Semi truck on the highway" loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                <EC page="about" k="ch1_fig_fleet" defaultText="Fleet" as="figcaption" className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest font-bold text-white bg-secondary/80 px-2 py-0.5 rounded-sm" />
              </figure>
              <figure className="col-span-3 row-span-2 relative overflow-hidden rounded-md border border-border group">
                <img src={magTransformer} alt="Industrial transformer on multi-axle trailer" loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                <EC page="about" k="ch1_fig_oversize" defaultText="Oversize" as="figcaption" className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest font-bold text-white bg-secondary/80 px-2 py-0.5 rounded-sm" />
              </figure>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.id} className="bg-secondary text-secondary-foreground rounded-md p-4 text-center border-t-4 border-primary">
                  <EC page="about" k={`${s.id}_v`} defaultText={s.v} as="div" className="stencil text-primary text-3xl leading-none" />
                  <EC page="about" k={`${s.id}_l`} defaultText={s.l} as="div" className="mt-1.5 text-[10px] uppercase tracking-widest text-white/80 font-bold" />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3 bg-card border border-border rounded-md p-4">
              <div className="flex">
                {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 text-primary fill-primary" />)}
              </div>
              <div className="text-xs">
                <EC page="about" k="ch1_rating_score" defaultText="4.9 / 5" as="span" className="font-bold text-foreground" />
                <EC page="about" k="ch1_rating_meta"  defaultText=" · 2,400+ verified loads" as="span" className="text-muted-foreground" />
              </div>
            </div>
          </aside>
        </div>

        {/* By the numbers */}
        <div className="mt-16 pt-10 border-t border-border">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <EC page="about" k="trust_eyebrow" defaultText="Sidebar · Why Shippers Trust Us" as="p" className="text-primary font-bold uppercase tracking-[0.3em] text-[11px] mb-1" />
              <h3 className="stencil text-2xl sm:text-3xl uppercase font-bold">
                <EC page="about" k="trust_title_1" defaultText="By The " />
                <EC page="about" k="trust_title_2" defaultText="Numbers" as="span" className="text-primary" />
              </h3>
            </div>
            <EC page="about" k="trust_meta" defaultText="Verified · Licensed · Insured" as="p" className="text-xs uppercase tracking-widest text-muted-foreground font-bold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustCards.map(({ id, icon: Icon, title, desc }) => (
              <div key={id} className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-card transition-all overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-12 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="flex items-start gap-4">
                  <span className="h-12 w-12 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <EC page="about" k={`${id}_title`} defaultText={title} as="h4" className="font-display uppercase text-lg leading-tight" />
                    <EC page="about" k={`${id}_desc`}  defaultText={desc} kind="textarea" as="p" className="text-sm text-muted-foreground leading-relaxed mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CHAPTER 02 — MISSION */}
    <section id="mission" className="py-16 lg:py-24 bg-secondary text-secondary-foreground scroll-mt-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.18),transparent_55%)]" />
      <div className="container-tight relative">
        <div className="flex items-end justify-between gap-4 border-b-2 border-white/30 pb-4 mb-8">
          <div>
            <EC page="about" k="ch2_kicker"  defaultText="The Code We Run By" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <EC page="about" k="ch2_chapter" defaultText="Chapter 02 · Mission & Values" as="p" className="font-display uppercase text-xs text-white/50 tracking-widest" />
          </div>
          <span className="stencil text-5xl sm:text-7xl text-white/10 leading-none select-none">02</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
              <EC page="about" k="ch2_title_1" defaultText="Move Heavy." /> <br />
              <EC page="about" k="ch2_title_2" defaultText="Move Right." as="span" className="text-primary" />
            </h2>
            <EC page="about" k="ch2_intro" kind="textarea"
              defaultText="Get heavy iron from point A to point B safely, legally, and on time — while treating every shipper like our most important customer. We earn trust load by load."
              as="p" className="text-white/75 mt-5 leading-relaxed text-lg" />
            <figure className="mt-8 border-l-4 border-primary pl-5">
              <Quote className="h-6 w-6 text-primary mb-2" />
              <blockquote className="font-display uppercase text-xl leading-tight">
                <EC page="about" k="ch2_quote" kind="textarea" defaultText={`"Your load is our reputation. We don't ship anything we wouldn't sign our name to."`} />
              </blockquote>
              <EC page="about" k="ch2_quote_attr" defaultText="— Mike Reilly, Senior Dispatcher" as="figcaption" className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/50 font-bold" />
            </figure>
            <div className="mt-6 flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
              <Compass className="h-5 w-5" /> <EC page="about" k="ch2_principles_label" defaultText="Four Guiding Principles" />
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {values.map(({ id, icon: Icon, title, desc }, idx) => (
              <div key={id} className="bg-white/5 backdrop-blur border border-white/10 rounded-md p-6 hover:border-primary hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-3">
                  <Icon className="h-7 w-7 text-primary" />
                  <span className="stencil text-2xl text-white/20 group-hover:text-primary/40 transition">0{idx + 1}</span>
                </div>
                <EC page="about" k={`${id}_title`} defaultText={title} as="h3" className="font-display uppercase text-xl" />
                <EC page="about" k={`${id}_desc`}  defaultText={desc} kind="textarea" as="p" className="text-sm text-white/70 mt-2 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CHAPTER 03 — TEAM */}
    <section id="our-team" className="py-16 lg:py-24 bg-background scroll-mt-24">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
          <div>
            <EC page="about" k="ch3_kicker"  defaultText="Profile" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <EC page="about" k="ch3_chapter" defaultText="Chapter 03 · The Dispatch Floor" as="p" className="font-display uppercase text-xs text-muted-foreground tracking-widest" />
          </div>
          <span className="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">03</span>
        </div>
        <h2 className="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92] max-w-4xl">
          <EC page="about" k="ch3_title_1" defaultText="The People " />
          <EC page="about" k="ch3_title_2" defaultText="Behind The Load." as="span" className="text-primary" />
        </h2>
        <EC page="about" k="ch3_intro" kind="textarea"
          defaultText="Real dispatchers, not call-center reps. Each load gets one direct contact — from quote to delivery. Combined, our team has moved heavy iron for more than 47 years."
          as="p" className="text-muted-foreground max-w-2xl mt-5 mb-12 leading-relaxed text-lg" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((p, idx) => {
            const d = teamDefaults[p.id];
            return (
              <article key={p.id} className="bg-card border border-border rounded-md overflow-hidden group hover:border-primary hover:shadow-card transition">
                <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                  <img src={p.img} alt={d.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 grayscale group-hover:grayscale-0" />
                  <span className="absolute top-3 left-3 stencil text-3xl text-white drop-shadow-lg">0{idx + 1}</span>
                  <EC page="about" k={`${p.id}_years`} defaultText={d.years} as="span" className="absolute top-3 right-3 bg-primary text-secondary text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-sm" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 to-transparent p-4">
                    <EC page="about" k={`${p.id}_quote`} kind="textarea" defaultText={d.quote} as="p" className="font-display uppercase text-xs italic text-white/90 leading-snug" />
                  </div>
                </div>
                <div className="p-5 border-t border-border">
                  <EC page="about" k={`${p.id}_name`} defaultText={d.name} as="h3" className="font-display uppercase text-lg leading-tight" />
                  <EC page="about" k={`${p.id}_role`} defaultText={d.role} as="p" className="text-xs uppercase tracking-wider text-primary mt-1 font-bold" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    {/* MID-CTA */}
    <section className="relative py-16 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img src={magHero} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]" />
      <div className="container-tight relative">
        <div className="border-y-2 border-primary py-10 sm:py-14 text-center max-w-3xl mx-auto">
          <EC page="about" k="cta_eyebrow" defaultText="A Word From Our Dispatch Floor" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-4" />
          <h2 className="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.95]">
            <EC page="about" k="cta_title_1" defaultText="Ready To Move" /> <br />
            <EC page="about" k="cta_title_2" defaultText="Heavy Iron?" as="span" className="text-primary" />
          </h2>
          <EC page="about" k="cta_subtitle" kind="textarea"
            defaultText="Call now or request a no-obligation quote — we'll beat any written rate."
            as="p" className="mt-5 text-white/80 text-lg" />
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <a href={`tel:${PHONE}`}><Button variant="hero" size="xl"><Phone /> <EC page="about" k="cta_call_label" defaultText={`Call ${DISPLAY}`} /></Button></a>
            <Link to="/#quote"><Button variant="call" size="xl"><EC page="about" k="cta_quote_label" defaultText="Get Free Quote" /> <ArrowRight /></Button></Link>
          </div>
        </div>
      </div>
    </section>

    {/* CHAPTER 04 — TRAILERS */}
    <section id="trailers" className="py-16 lg:py-24 bg-background scroll-mt-24">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
          <div>
            <EC page="about" k="ch4_kicker"  defaultText="Gallery Feature" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <EC page="about" k="ch4_chapter" defaultText="Chapter 04 · Our Trailers" as="p" className="font-display uppercase text-xs text-muted-foreground tracking-widest" />
          </div>
          <span className="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">04</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-end mb-10">
          <h2 className="lg:col-span-7 stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
            <EC page="about" k="ch4_title_1" defaultText="The Trailers " />
            <EC page="about" k="ch4_title_2" defaultText="We Use." as="span" className="text-primary" />
          </h2>
          <EC page="about" k="ch4_intro" kind="textarea"
            defaultText="From hot shots to multi-axle super-loads — the right trailer for every job. Owned and partner equipment, always inspected and ready to roll."
            as="p" className="lg:col-span-5 text-muted-foreground leading-relaxed" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trailers.map((t, idx) => (
            <article key={t.id} className={`bg-card border border-border rounded-lg overflow-hidden group hover:border-primary hover:shadow-card transition-all ${idx === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
              <div className={`overflow-hidden bg-muted relative ${idx === 0 ? "aspect-[16/10] lg:aspect-[16/11]" : "aspect-[16/10]"}`}>
                <img src={t.img} alt={t.name + " trailer"} loading="lazy" width={1280} height={800} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <EC page="about" k={`${t.id}_cap`} defaultText={t.cap} as="span" className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-primary/40" />
                <span className="absolute top-3 right-3 stencil text-2xl text-white drop-shadow-lg">0{idx + 1}</span>
              </div>
              <div className="p-5">
                <EC page="about" k={`${t.id}_name`} defaultText={t.name} as="h3" className={`font-display uppercase leading-tight ${idx === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`} />
                <EC page="about" k={`${t.id}_desc`} defaultText={t.desc} kind="textarea" as="p" className="text-sm text-muted-foreground mt-2 leading-relaxed" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* CHAPTER 05 — STATES */}
    <section id="states-we-serve" className="py-16 lg:py-24 bg-muted/40 scroll-mt-24">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
          <div>
            <EC page="about" k="ch5_kicker"  defaultText="The Atlas" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <EC page="about" k="ch5_chapter" defaultText="Chapter 05 · States We Serve" as="p" className="font-display uppercase text-xs text-muted-foreground tracking-widest" />
          </div>
          <span className="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">05</span>
        </div>

        <h2 className="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92] max-w-5xl">
          <EC page="about" k="ch5_title_1" defaultText="All 50 States · " />
          <EC page="about" k="ch5_title_2" defaultText="Coast To Coast." as="span" className="text-primary" />
        </h2>
        <EC page="about" k="ch5_intro" kind="textarea"
          defaultText="Door-to-door heavy haul coverage in every U.S. state — including Alaska & Hawaii. Local dispatchers, vetted carriers, and permit teams on the ground."
          as="p" className="text-muted-foreground mt-5 mb-10 max-w-2xl leading-relaxed text-lg" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {US_STATES.map((s) => (
            <div key={s.abbr} className="group flex items-center gap-3 bg-card border border-border rounded-md p-3 hover:border-primary hover:shadow-card transition">
              <div className="w-12 h-9 shrink-0 rounded-sm overflow-hidden border border-border bg-muted">
                <img
                  src={`https://flagcdn.com/w80/us-${s.abbr.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w160/us-${s.abbr.toLowerCase()}.png 2x`}
                  alt={`${s.name} state flag`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display uppercase text-sm leading-tight truncate">{s.name}</div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5 text-primary" /> {s.abbr}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CHAPTER 06 — CONTACT */}
    <section id="contact-us" className="py-16 lg:py-24 bg-background scroll-mt-24">
      <div className="container-tight">
        <div className="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
          <div>
            <EC page="about" k="ch6_kicker"  defaultText="From The Editor" as="p" className="text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1" />
            <EC page="about" k="ch6_chapter" defaultText="Chapter 06 · Get In Touch" as="p" className="font-display uppercase text-xs text-muted-foreground tracking-widest" />
          </div>
          <span className="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">06</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h2 className="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
              <EC page="about" k="ch6_title_1" defaultText="Our Promise:" /> <br />
              <EC page="about" k="ch6_title_2" defaultText="Safety, Speed, Straight Talk." as="span" className="text-primary" />
            </h2>
            <EC page="about" k="ch6_intro" kind="textarea"
              defaultText="Every load is treated like it's our own. Our dispatchers don't disappear once a quote is signed — they call you with updates, handle permit paperwork, and make sure your equipment arrives when it's supposed to. No surprises."
              as="p" className="text-muted-foreground mt-5 leading-relaxed text-lg" />
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <a href={`tel:${PHONE}`} className="flex items-center gap-3 bg-card border border-border rounded-md p-4 hover:border-primary transition">
                <span className="h-11 w-11 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta"><Phone className="h-5 w-5 text-secondary" /></span>
                <div>
                  <EC page="about" k="ch6_call_label"  defaultText="Call 24/7" as="div" className="text-[10px] uppercase tracking-widest text-muted-foreground" />
                  <EC page="about" k="ch6_call_number" defaultText={DISPLAY} as="div" className="stencil text-xl" />
                </div>
              </a>
              <a href="mailto:dispatch@heavyhaulgroup.com" className="flex items-center gap-3 bg-card border border-border rounded-md p-4 hover:border-primary transition">
                <span className="h-11 w-11 rounded-md bg-secondary text-primary flex items-center justify-center"><Mail className="h-5 w-5" /></span>
                <div>
                  <EC page="about" k="ch6_email_label" defaultText="Email" as="div" className="text-[10px] uppercase tracking-widest text-muted-foreground" />
                  <EC page="about" k="ch6_email_addr"  defaultText="dispatch@heavyhaulgroup.com" as="div" className="font-display uppercase text-sm" />
                </div>
              </a>
            </div>
            <a href={`tel:${PHONE}`}>
              <Button variant="hero" size="xl" className="mt-6">
                <EC page="about" k="ch6_btn_call" defaultText={`Call A Dispatcher · ${DISPLAY}`} />
              </Button>
            </a>
          </div>
          <div className="lg:col-span-5 bg-card border border-border rounded-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 stencil text-[8rem] text-foreground/[0.04] leading-none select-none">06</div>
            <h3 className="stencil text-2xl uppercase mb-4 relative">
              <EC page="about" k="ch6_side_title_1" defaultText="Why Shippers " />
              <EC page="about" k="ch6_side_title_2" defaultText="Stay With Us" as="span" className="text-primary" />
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground relative">
              {promiseList.map((p) => (
                <li key={p.id} className="flex gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <EC page="about" k={p.id} defaultText={p.t} kind="textarea" as="span" />
                </li>
              ))}
            </ul>
            <Link to="/services" className="relative">
              <Button variant="outline" size="lg" className="mt-6 w-full">
                <EC page="about" k="ch6_browse_btn" defaultText="Browse All Services" /> <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-16 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">
          <EC page="about" k="colophon_left"   defaultText="Heavy Haul Group · The Magazine" as="span" />
          <EC page="about" k="colophon_center" defaultText="End Of Issue · Thank You For Reading" as="span" />
          <EC page="about" k="colophon_right"  defaultText="Vol. XVIII · Nationwide Edition" as="span" />
        </div>
      </div>
    </section>
  </>
  );
};

export default About;
