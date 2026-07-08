import { Link } from "react-router-dom";
import {
  ArrowRight, ChevronRight, Phone, ShieldCheck, CheckCircle2, MapPin, Clock,
  FileCheck, Headphones, Star, Zap, Award, BadgeCheck, Truck, Globe, AlertTriangle,
  Wrench, Anchor, Languages, FileText, Building2, Compass, LifeBuoy, Radio, Users,
  HardHat, Package, Forklift, DollarSign, TrendingDown, PiggyBank, Percent,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SEO from "@/components/SEO";
import InstantQuoteCalculator from "@/components/InstantQuoteCalculator";
import ServiceQuoteForm, { QUOTE_VARIANTS } from "@/components/ServiceQuoteForm";
import { Reveal } from "@/hooks/useInView";
import CountUp from "@/components/CountUp";
import RecentShipmentsTicker from "@/components/RecentShipmentsTicker";
import CrossBorderRoute from "@/components/CrossBorderRoute";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import type { Category } from "@/data/categories";
import { categories } from "@/data/categories";
import heroCanada from "@/assets/hero-canada.jpg";
import heroMexico from "@/assets/hero-mexico.jpg";
import heroCatastrophicAsset from "@/assets/hero-catastrophic.jpg.asset.json";
const heroCatastrophic = heroCatastrophicAsset.url;
import heroRigging from "@/assets/hero-rigging.jpg";
import heroPilot from "@/assets/hero-pilot.jpg";
import heroTowing from "@/assets/hero-towing.jpg";
import heroPartial from "@/assets/hero-partial.jpg";
import recovery1 from "@/assets/recovery-1.jpg";
import recovery2 from "@/assets/recovery-2.jpg";
import recovery3 from "@/assets/recovery-3.jpg";
import recovery4 from "@/assets/recovery-4.jpg";
import canada1 from "@/assets/canada-1.jpg";
import canada2 from "@/assets/canada-2.jpg";
import canada3 from "@/assets/canada-3.jpg";
import canada4 from "@/assets/canada-4.jpg";
import mexico1 from "@/assets/mexico-1.jpg";
import mexico2 from "@/assets/mexico-2.jpg";
import mexico3 from "@/assets/mexico-3.jpg";
import mexico4 from "@/assets/mexico-4.jpg";
import rigging1 from "@/assets/rigging-1.jpg";
import rigging2 from "@/assets/rigging-2.jpg";
import rigging3 from "@/assets/rigging-3.jpg";
import pilot1 from "@/assets/pilot-1.jpg";
import pilot2 from "@/assets/pilot-2.jpg";
import pilot3 from "@/assets/pilot-3.jpg";
import towing1 from "@/assets/towing-1.jpg";
import towing2 from "@/assets/towing-2.jpg";
import towing3 from "@/assets/towing-3.jpg";
import partial1 from "@/assets/partial-1.jpg";
import partial2 from "@/assets/partial-2.jpg";
import partial3 from "@/assets/partial-3.jpg";

const HERO_IMAGES: Record<string, string> = {
  "canada-shipping-service": heroCanada,
  "mexico-shipping-service": heroMexico,
  "catastrophic-recovery": heroCatastrophic,
  "rigging-and-lifting-service": heroRigging,
  "pilot-car-service": heroPilot,
  "heavy-machinery-towing": heroTowing,
  "partial-load-shipping": heroPartial,
};

type GalleryItem = { src: string; title: string; desc: string };
const GALLERIES: Record<string, { eyebrow: string; title: string; accent: string; sub: string; items: GalleryItem[] }> = {
  "catastrophic-recovery": {
    eyebrow: "Recovery In Action",
    title: "Every Scenario",
    accent: "Covered",
    sub: "From overturns and floods to highway incidents and wildfire zones — our crews and gear are built for the worst days on the job.",
    items: [
      { src: recovery1, title: "Overturn & Rollover", desc: "Lifting equipment back upright with rotators and cranes." },
      { src: recovery2, title: "Flood & Storm Response", desc: "Recovering iron from flooded sites and storm aftermath." },
      { src: recovery3, title: "Highway Incidents", desc: "Fast-clear recoveries on active highways and interstates." },
      { src: recovery4, title: "Wildfire & Hazard Zones", desc: "Loading damaged equipment from fire and hazard zones." },
    ],
  },
  "canada-shipping-service": {
    eyebrow: "USA ↔ Canada Lanes",
    title: "Border To Border —",
    accent: "Coast To Coast",
    sub: "From the Pacific Highway crossing to Detroit–Windsor and out to the Maritimes — bonded heavy haul wherever your equipment needs to go.",
    items: [
      { src: canada1, title: "Pacific Highway Crossing", desc: "Daily lanes BC ↔ WA with CTPAT / FAST carriers staged at the border." },
      { src: canada2, title: "Alberta & Prairie Lanes", desc: "Heavy iron into Edmonton, Calgary, Saskatoon and back south for oil & gas." },
      { src: canada3, title: "CBSA Bonded Paperwork", desc: "ACI / ACE filings, PARS / PAPS labels, B3 entries — handled in-house." },
      { src: canada4, title: "Detroit ↔ Windsor", desc: "Ambassador & Gordie Howe crossings — Ontario, Quebec and the U.S. Midwest." },
    ],
  },
  "mexico-shipping-service": {
    eyebrow: "USA ↔ Mexico Lanes",
    title: "Bonded Drayage,",
    accent: "Bilingual Dispatch",
    sub: "Laredo, Otay Mesa, El Paso, Pharr & Eagle Pass — we coordinate U.S. carriers, bonded drayage and OEA-certified Mexican carriers under one file.",
    items: [
      { src: mexico1, title: "Laredo World Trade Bridge", desc: "The busiest commercial crossing on the southern border — daily heavy haul lanes." },
      { src: mexico2, title: "Monterrey & Maquiladora Lanes", desc: "Production equipment into IMMEX facilities under temporary import provisions." },
      { src: mexico3, title: "El Paso ↔ Ciudad Juárez", desc: "Bonded drayage and southbound Mexican carrier handoff coordinated end-to-end." },
      { src: mexico4, title: "Pedimento & SAT Clearance", desc: "Coordinated with your agente aduanal — or we introduce you to one of ours." },
    ],
  },
  "rigging-and-lifting-service": {
    eyebrow: "Rigging In Action",
    title: "Engineered Lifts,",
    accent: "Executed Right",
    sub: "Mobile cranes, crawler cranes, hydraulic gantries and Versa-Lifts — sized to the load, planned to the inch.",
    items: [
      { src: rigging1, title: "Heavy Mobile Crane Picks", desc: "50T–500T+ mobile cranes for plant moves, machinery installs and load-outs." },
      { src: rigging2, title: "Hydraulic Gantry Systems", desc: "In-plant lifts where cranes can't fit — gantries, jacking and air skates." },
      { src: rigging3, title: "Crawler Crane Operations", desc: "Tandem picks and confined-site lifts with full engineered lift plans." },
    ],
  },
  "pilot-car-service": {
    eyebrow: "Escort In Action",
    title: "Lead, Chase,",
    accent: "High-Pole",
    sub: "Certified pilot car operators in all 50 states — bundled with your heavy haul booking or dispatched standalone.",
    items: [
      { src: pilot1, title: "Lead Pilot Cars", desc: "OVERSIZE LOAD banners, flashing lights, warning traffic ahead of your load." },
      { src: pilot2, title: "High-Pole Verification", desc: "Adjustable height poles physically test every overhead obstruction first." },
      { src: pilot3, title: "Chase & Long-Haul Escort", desc: "Chase units stay with your load coast-to-coast through every state." },
    ],
  },
  "heavy-machinery-towing": {
    eyebrow: "Recovery In Action",
    title: "When Standard",
    accent: "Tow Trucks Can't",
    sub: "75-ton-plus rotators, integrated heavy wreckers and multi-axle lowboys — dispatched 24/7 nationwide.",
    items: [
      { src: towing1, title: "Rotator Lift & Upright", desc: "Overturned semis and wrecked equipment uprighted with 75T+ rotators." },
      { src: towing2, title: "Integrated Heavy Wreckers", desc: "Disabled tractors, dumps and vocational vehicles back to the shop." },
      { src: towing3, title: "Lowboy Equipment Recovery", desc: "Stuck or disabled construction iron loaded onto multi-axle lowboys." },
    ],
  },
  "partial-load-shipping": {
    eyebrow: "Partial Loads In Action",
    title: "Pay Only For",
    accent: "Your Space",
    sub: "Pallets, attachments, single machines — consolidated on shared trailers so you never pay for empty deck.",
    items: [
      { src: partial1, title: "Consolidated Flatbeds", desc: "Multiple shippers, one lane — costs split by linear feet." },
      { src: partial2, title: "Single-Machine Partials", desc: "Skid steers, mini excavators and attachments at LTL rates." },
      { src: partial3, title: "Palletized LTL Freight", desc: "Crated machinery parts, tooling and dealer inventory." },
    ],
  },
};

const PARTIAL_BENEFITS = [
  { icon: Percent, big: "40%", label: "Average Cost Savings", desc: "vs. paying for a full truckload when you only need part of the trailer." },
  { icon: TrendingDown, big: "$1.8K", label: "Avg. Saved Per Load", desc: "on a typical 1,000-mile partial haul instead of booking a dedicated truck." },
  { icon: PiggyBank, big: "1/3", label: "Pay Just A Third", desc: "of trailer linear feet — perfect for single machines or palletized freight." },
  { icon: DollarSign, big: "$0", label: "Hidden Fees", desc: "One all-in quote — fuel, permits, insurance bundled. No surprises at delivery." },
];

type Pillar = { icon: any; title: string; desc: string };
type Step = { n: string; t: string; d: string };
type Stat = { v: string; l: string };

interface Content {
  eyebrow: string;
  heroBadge: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroSub: string;
  introTitle: string;
  introBody: string[];
  pillars: Pillar[];
  steps: Step[];
  highlights: string[];
  stats: Stat[];
  factsTitle: string;
  facts: string[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
}

const CONTENT: Record<string, Content> = {
  "canada-shipping-service": {
    eyebrow: "Cross-Border · USA ↔ Canada",
    heroBadge: "CBSA Bonded · ACI / PARS · CTPAT / FAST",
    heroTitleLead: "USA – Canada",
    heroTitleAccent: "Heavy Haul Shipping",
    heroSub:
      "Bonded heavy haul between every U.S. state and every Canadian province — for importers, exporters, dealers, auction buyers, and OEMs. We handle the customs paperwork, the permits on both sides of the border, and the bonded carrier handoff so your equipment clears without sitting at the line.",
    introTitle: "Full-Service Cross-Border Equipment Transport",
    introBody: [
      "Whether you bought a piece at a Ritchie Bros sale in Canada and need it on a U.S. jobsite by next week, or you're shipping a Caterpillar dozer north to a mining operation in Alberta, we move it end-to-end. One dispatcher, one quote, one invoice — covering both the U.S. and Canadian legs of the move.",
      "We file ACI eManifests northbound and ACE eManifests southbound, prepare PARS/PAPS for customs pre-clearance, and coordinate with licensed customs brokers on both sides. Our bonded carrier network is staged near every major crossing — Pacific Highway, Sweetgrass / Coutts, Pembina / Emerson, Detroit / Windsor, Buffalo / Fort Erie, Champlain / Lacolle, and more.",
      "Importers and exporters get a single point of contact, real-time GPS tracking, and full visibility into customs status — no chasing brokers, no surprise demurrage charges at the border.",
    ],
    pillars: [
      { icon: FileText, title: "Customs Documentation Handled", desc: "Commercial invoice, bill of lading, B3 entry, BSF715, ACI / ACE eManifest, PARS/PAPS labels — prepared and filed in-house." },
      { icon: ShieldCheck, title: "Bonded & CTPAT-Compliant Carriers", desc: "All cross-border carriers are CTPAT/PIP partners and FAST-approved for expedited clearance lanes." },
      { icon: Globe, title: "Every Major Border Crossing", desc: "Pacific Hwy, Sweetgrass, Pembina, Sault Ste. Marie, Detroit-Windsor, Buffalo, Champlain — staged carriers at all of them." },
      { icon: Truck, title: "Oversize Permits Both Sides", desc: "U.S. state permits plus provincial permits (MTO, SAAQ, Alberta TRAVIS) and pilot car coordination — one file, one team." },
      { icon: Building2, title: "For Importers & Exporters", desc: "Equipment dealers, auction buyers, OEM fleets, mining and oil & gas operators — Net-30 terms for qualified accounts." },
      { icon: Radio, title: "Live Border Status Updates", desc: "Our dispatchers monitor each crossing and message you the moment your load is cleared and rolling." },
    ],
    steps: [
      { n: "01", t: "Quote & Documents", d: "Send make, model, serial, value, origin and destination. We return an all-in cross-border quote and a documents checklist." },
      { n: "02", t: "Customs Pre-Clearance", d: "We prepare ACI/ACE filings, PARS/PAPS labels, and coordinate with your broker (or ours) for a clean entry." },
      { n: "03", t: "Permits & Pilot Cars", d: "U.S. state and Canadian provincial oversize permits, pilot cars, route surveys — all booked in-house." },
      { n: "04", t: "Pickup & Border Crossing", d: "Bonded carrier picks up, runs the lane, and clears the border — you get live GPS and status updates the whole way." },
      { n: "05", t: "Delivery & POD", d: "Equipment delivered to final destination with signed POD, customs entry copies, and any provincial permit receipts." },
    ],
    highlights: [
      "All U.S. states ↔ all Canadian provinces",
      "CBSA bonded carriers · CTPAT / FAST",
      "ACI / ACE eManifest filing in-house",
      "PARS / PAPS pre-clearance labels",
      "U.S. + provincial oversize permits",
      "Real-time GPS + border status tracking",
      "Bilingual dispatch (English / French Canada)",
      "Net-30 terms for qualified importers/exporters",
    ],
    stats: [
      { v: "13", l: "Major Border Crossings Covered" },
      { v: "50", l: "U.S. States" },
      { v: "10", l: "Canadian Provinces" },
      { v: "24/7", l: "Cross-Border Dispatch" },
    ],
    factsTitle: "What You Should Know About U.S. – Canada Equipment Shipping",
    facts: [
      "All commercial equipment crossing the border requires an ACI eManifest (northbound) or ACE eManifest (southbound) filed at least one hour before arrival.",
      "PARS (Pre-Arrival Review System) and PAPS (Pre-Arrival Processing System) barcodes let customs review documents before the truck arrives — cutting wait times from hours to minutes.",
      "Used equipment may require EPA, Transport Canada, or environmental compliance documentation in addition to standard customs entry.",
      "Oversize loads need separate U.S. state permits AND Canadian provincial permits — both must be in hand before crossing.",
      "CTPAT (U.S.) and PIP (Canada) certified carriers move through FAST lanes for expedited clearance.",
      "Duties and taxes (GST/HST) are typically the responsibility of the importer of record — we'll connect you with a licensed customs broker if you don't already have one.",
    ],
    faqs: [
      { q: "Do I need a customs broker to ship equipment from the U.S. to Canada?", a: "Most commercial shipments require a licensed Canadian customs broker (or self-clearance with a CBSA business number). We work with several preferred brokers and can introduce you — or work seamlessly with your existing broker." },
      { q: "How long does customs clearance at the border take?", a: "With PARS/PAPS pre-clearance and CTPAT/FAST carriers, most loads clear in 15–45 minutes. Without pre-clearance, expect 2–6 hours depending on the crossing and time of day." },
      { q: "Can you ship oversize loads across the border?", a: "Yes — we handle U.S. state permits, Canadian provincial permits (MTO Ontario, SAAQ Quebec, Alberta TRAVIS, BC, etc.), pilot cars, and route surveys end-to-end." },
      { q: "Which border crossings do you use most?", a: "Pacific Highway (BC/WA), Sweetgrass-Coutts (MT/AB), Pembina-Emerson (ND/MB), Sault Ste. Marie (MI/ON), Detroit-Windsor (MI/ON), Buffalo-Fort Erie (NY/ON), Champlain-Lacolle (NY/QC). We choose the crossing based on routing, hours, and load size." },
      { q: "Do you provide cross-border insurance?", a: "Yes — up to $1M cargo coverage valid on both sides of the border, plus full liability. COIs naming your customs broker, lender, or buyer issued in 15 minutes." },
    ],
    ctaTitle: "Get Your Cross-Border Quote",
  },

  "mexico-shipping-service": {
    eyebrow: "Cross-Border · USA ↔ Mexico",
    heroBadge: "Bonded Carriers · SAT / Aduanas · CBP",
    heroTitleLead: "USA – Mexico",
    heroTitleAccent: "Heavy Haul Shipping",
    heroSub:
      "Bilingual cross-border heavy haul between the U.S. and Mexico. We coordinate U.S. permits, CBP clearance, bonded drayage across the line, and the Mexican carrier handoff — built for importers, exporters, OEM plants, and equipment dealers shipping into and out of Mexico.",
    introTitle: "End-to-End USA – Mexico Equipment Logistics",
    introBody: [
      "Shipping equipment to a maquiladora in Monterrey? Importing a Caterpillar excavator back from a Mexican job? Buying at an auction in Mexico for resale in the U.S.? We move it bonded, documented, and delivered — coordinating U.S. carriers, Mexican carriers, and customs on both sides.",
      "Our bilingual dispatch team is staged near the busiest commercial crossings — Laredo / Nuevo Laredo (World Trade Bridge & Colombia), Otay Mesa / Tijuana, El Paso / Ciudad Juárez, Pharr / Reynosa, and Eagle Pass. We file U.S. ACE eManifests, coordinate Pedimento with your Mexican customs broker, and run bonded drayage across the line.",
      "Importers and exporters get one quote, one bilingual point of contact, real-time GPS, and full transparency on customs status — no broken handoffs, no language barriers, no surprise charges.",
    ],
    pillars: [
      { icon: Languages, title: "Bilingual Dispatch (EN / ES)", desc: "Native Spanish-speaking dispatchers coordinate directly with Mexican carriers, brokers, and shippers." },
      { icon: FileText, title: "Pedimento & Customs Coordination", desc: "We work with your Mexican customs broker (or introduce you to one) for clean Pedimento entry and IMMEX compliance." },
      { icon: Anchor, title: "Bonded Drayage Across the Line", desc: "Bonded transfer at Laredo, Otay Mesa, El Paso, Pharr, and Eagle Pass — your equipment never sits unattended." },
      { icon: ShieldCheck, title: "CTPAT / OEA-Certified Carriers", desc: "U.S. CTPAT and Mexican OEA partner carriers move through FAST lanes for faster clearance." },
      { icon: Building2, title: "Maquiladora & IMMEX-Ready", desc: "We ship into and out of IMMEX/maquiladora facilities daily — production equipment, tooling, and finished goods." },
      { icon: Radio, title: "Live Crossing Status", desc: "Real-time updates as your load moves through the U.S. port, the bridge, and Mexican customs." },
    ],
    steps: [
      { n: "01", t: "Quote & Compliance Check", d: "Equipment specs, origin/destination, value, and a documents checklist (commercial invoice, packing list, certificate of origin, USMCA cert if applicable)." },
      { n: "02", t: "U.S. Carrier & ACE Filing", d: "U.S. CTPAT carrier dispatched to origin. ACE eManifest filed in advance for fast CBP processing." },
      { n: "03", t: "Bonded Drayage & Pedimento", d: "Bonded drayage carrier crosses the bridge. Your Mexican broker files Pedimento for SAT/Aduanas clearance." },
      { n: "04", t: "Mexican Carrier Handoff", d: "OEA-certified Mexican carrier picks up south of the border and delivers to final destination — Monterrey, Saltillo, CDMX, Guadalajara, anywhere." },
      { n: "05", t: "Delivery & POD", d: "Signed proof of delivery, customs entry copies, and Pedimento receipts returned to you with the final invoice." },
    ],
    highlights: [
      "Bilingual dispatch (EN / ES)",
      "Laredo · Otay Mesa · El Paso · Pharr · Eagle Pass",
      "ACE filing + Pedimento coordination",
      "USMCA / T-MEC certificate of origin",
      "CTPAT (U.S.) + OEA (Mexico) carriers",
      "Bonded drayage across the line",
      "IMMEX / maquiladora-ready",
      "Real-time GPS both sides of the border",
    ],
    stats: [
      { v: "5", l: "Major Commercial Crossings" },
      { v: "32", l: "Mexican States Served" },
      { v: "EN/ES", l: "Bilingual Dispatch" },
      { v: "24/7", l: "Cross-Border Support" },
    ],
    factsTitle: "What You Should Know About U.S. – Mexico Equipment Shipping",
    facts: [
      "Commercial equipment crossing into Mexico requires a Pedimento (Mexican customs declaration) filed by a licensed Mexican customs broker (agente aduanal).",
      "USMCA (T-MEC) certificate of origin can eliminate or reduce duties on qualifying equipment — we'll help you confirm eligibility.",
      "Most freight enters Mexico via bonded drayage — a short-haul carrier moves the load across the bridge before a long-haul Mexican carrier takes it inland.",
      "Maquiladora / IMMEX facilities can import production equipment under temporary import provisions, with the right documentation.",
      "U.S. CBP requires ACE eManifest at least one hour before truck arrival. Mexican SAT requires Pedimento before crossing.",
      "Northbound (Mexico → U.S.) returns work the same way in reverse — Pedimento de exportación, bonded drayage, CBP entry, U.S. carrier final delivery.",
    ],
    faqs: [
      { q: "Do you handle Mexican customs paperwork?", a: "We coordinate with your Mexican customs broker (agente aduanal) — or introduce you to one of our preferred partners. Pedimento, USMCA certificate of origin, and IMMEX paperwork are all coordinated through that relationship." },
      { q: "Which crossings do you use most?", a: "Laredo / Nuevo Laredo (World Trade Bridge and Colombia Solidarity Bridge) handles the majority of our heavy haul traffic. We also run Otay Mesa, El Paso, Pharr, and Eagle Pass depending on origin and destination." },
      { q: "Can you ship into a maquiladora?", a: "Yes — we deliver into IMMEX / maquiladora facilities daily, including temporary import shipments for production equipment, tooling, and machinery." },
      { q: "How long does Mexican customs take?", a: "With Pedimento filed in advance and a CTPAT/OEA carrier, most loads clear in 1–4 hours at Laredo. Random inspections can extend that — we monitor and update you live." },
      { q: "Is my equipment insured on both sides of the border?", a: "Yes — up to $1M cargo on the U.S. leg, and we confirm equivalent Mexican carrier cargo coverage before the handoff. COIs available for both legs." },
    ],
    ctaTitle: "Get Your Mexico Shipping Quote",
  },

  "catastrophic-recovery": {
    eyebrow: "24/7 Emergency Response",
    heroBadge: "Rapid Response · Cranes · Rotators · Bonded",
    heroTitleLead: "Catastrophic",
    heroTitleAccent: "Recovery Services",
    heroSub:
      "Professional catastrophic recovery services for heavy equipment caught in accidents, rollovers, severe weather, and high-stakes incidents. When standard towing can't handle it, we mobilize cranes, rotators, winches, and multi-axle transport — fast, safe, and fully insured.",
    introTitle: "When Every Minute Counts — We're Already Moving",
    introBody: [
      "Catastrophic recovery is the urgent response, removal, and transport of large or damaged equipment that can't be moved using standard towing methods. Whether your iron is overturned on a remote highway, half-submerged after a flood, or sitting in the path of an active wildfire — fast, professional recovery is the difference between prolonged downtime and getting your business back on track.",
      "Heavy Haul Group delivers catastrophic recovery designed for speed, safety, and efficiency. We coordinate every step, handling complex equipment safely while minimizing disruption to your operation. Our recovery specialists are trained, our fleet is fully equipped, and our dispatch never closes.",
      "Whether you're an individual owner-operator, a fleet manager, an insurance adjuster, or a Fortune-500 operations team — when you need catastrophic recovery, you need it now. One call, one team, one invoice.",
    ],
    pillars: [
      { icon: Compass, title: "Fast, Detailed Project Planning", desc: "Site evaluation to assess the best recovery approach based on equipment type, location, and condition. Customized strategy for lifting, positioning, and transport." },
      { icon: FileCheck, title: "Local, State & Federal Compliance", desc: "We manage all permits and regulatory requirements — public roads, restricted areas, environmental zones. All paperwork handled in-house." },
      { icon: Wrench, title: "Fully Equipped Recovery Fleet", desc: "Cranes, rotators, winches, flatbeds, lowboys, and multi-axle transport units to handle oversized or damaged equipment safely." },
      { icon: Radio, title: "Real-Time Communication", desc: "Your logistics coordinator provides live updates on recovery progress — you know exactly what's happening at every moment." },
      { icon: HardHat, title: "Trained Recovery Specialists", desc: "Drivers and recovery specialists trained to safely lift, stabilize, and transport damaged or unstable machinery." },
      { icon: ShieldCheck, title: "Transparent, Upfront Pricing", desc: "Clear, no-surprise cost estimates. We pride ourselves on no hidden fees, even on emergency response calls." },
    ],
    steps: [
      { n: "01", t: "Emergency Call & Triage", d: "24/7 dispatch answers, captures location, equipment type, and incident details. Recovery team mobilized within the hour." },
      { n: "02", t: "Site Assessment", d: "On-site recovery specialist evaluates the situation, hazards, ground conditions, and recommends the safest lift and transport plan." },
      { n: "03", t: "Permits & Authority Coordination", d: "Permits filed, local DOT and law enforcement coordinated, road closures arranged if needed." },
      { n: "04", t: "Lift, Stabilize, Load", d: "Crane or rotator lift, stabilization of damaged equipment, and secured loading onto the appropriate transport trailer." },
      { n: "05", t: "Transport to Repair or Storage", d: "Delivery to your repair facility, storage yard, insurance lot, or wherever the equipment needs to go next." },
    ],
    highlights: [
      "24/7 emergency dispatch — always answered",
      "Rollover and overturn recovery",
      "Flood, storm, and wildfire response",
      "Crane and rotator lifts on-site",
      "Multi-axle transport for damaged iron",
      "Insurance & adjuster coordination",
      "Environmental compliance",
      "Hazmat-aware recovery teams",
    ],
    stats: [
      { v: "<60", l: "Min. Dispatch Time" },
      { v: "24/7", l: "Live Operators" },
      { v: "75T+", l: "Rotator Capacity" },
      { v: "50", l: "States Covered" },
    ],
    factsTitle: "What is Catastrophic Recovery Equipment Shipping?",
    facts: [
      "Catastrophic recovery covers any incident where standard towing won't work — rollovers, accidents, weather damage, sinkholes, fires.",
      "Speed matters: every hour of equipment downtime can cost a contractor thousands in lost production and rental.",
      "Damaged equipment often requires custom rigging — direct lifting points may be compromised, and load shifts are a real safety risk.",
      "Insurance carriers and adjusters need clean documentation: photos, weights, damage reports, and a clear chain of custody.",
      "Many recoveries require local DOT, state police, and environmental agency coordination — all handled in-house by our team.",
      "Recoveries on private property, jobsites, and public roadways all have different permitting and access requirements.",
    ],
    faqs: [
      { q: "How fast can you respond to an emergency recovery?", a: "Our dispatch is staffed 24/7/365 and answers within seconds. We mobilize a recovery team typically within 30–60 minutes of the call, with on-site arrival depending on distance — most U.S. metros within 2–4 hours." },
      { q: "Do you work directly with insurance companies?", a: "Yes — we coordinate with insurance adjusters, provide photo documentation, damage assessments, and clean invoicing for claims. We've worked with every major commercial carrier." },
      { q: "What if my equipment is on a busy highway?", a: "We coordinate directly with local DOT and state police to set up safe road closures, traffic control, and lane shifts. Our recovery specialists are trained for high-traffic incident response." },
      { q: "Can you recover equipment in remote or off-road locations?", a: "Yes — we have crawler cranes, winches, and off-road recovery rigs for jobsite, off-highway, mining, and pipeline recoveries." },
      { q: "How much does catastrophic recovery cost?", a: "It varies with equipment size, location, damage, and required rigging — but we provide a clear upfront estimate before mobilizing. No hidden fees, no surprise charges. Insurance often covers most or all of the cost." },
    ],
    ctaTitle: "Need Emergency Recovery Now?",
  },

  "rigging-and-lifting-service": {
    eyebrow: "Plant Moves · Machinery Installs · Heavy Lifts",
    heroBadge: "Millwright · Cranes · Jacking & Skating",
    heroTitleLead: "Rigging &",
    heroTitleAccent: "Lifting Services",
    heroSub:
      "Heavy rigging, lifting, and millwright services for plant relocations, machinery installations, oversize loading, and precision equipment placement. Mobile cranes, crawler cranes, hydraulic gantries, jacking & skating, and full-service rigging crews — all under one roof.",
    introTitle: "Precision Rigging for Heavy & Sensitive Equipment",
    introBody: [
      "Rigging and lifting is more than picking something up with a crane — it's engineered planning, certified rigging crews, the right gear for the lift, and a complete understanding of weights, centers of gravity, and ground conditions. Whether you're loading a 100-ton press onto a multi-axle trailer or moving a CNC machine into a new plant, we plan and execute the lift end-to-end.",
      "Our rigging and millwright teams handle plant relocations, machinery installs, oversize loading and unloading, and precision equipment placement inside facilities. We bring our own cranes, hydraulic gantries, Versa-Lifts, jacking and skating equipment, riggers, and a project manager who owns the move from quote to sign-off.",
      "Manufacturers, machine shops, power plants, and contractors trust us because we plan the lift, engineer the rigging, pull the permits, coordinate with the millwrights, and put the iron exactly where it needs to go — on time, in spec, with zero damage.",
    ],
    pillars: [
      { icon: HardHat, title: "Mobile & Crawler Crane Lifts", desc: "Hydraulic mobile cranes (50T–500T+) and crawler cranes for confined sites, multi-pick lifts, and tandem operations." },
      { icon: Wrench, title: "Jacking & Skating", desc: "Hydraulic jacks, air skates, and rolling systems to move equipment inside facilities where cranes can't reach." },
      { icon: Forklift, title: "Versa-Lifts & Hydraulic Gantries", desc: "Up to 60-ton Versa-Lifts and hydraulic gantry systems for in-plant heavy moves and tight-clearance lifts." },
      { icon: Truck, title: "Loading & Unloading", desc: "Oversize and overweight loading onto lowboys, RGNs, step decks, and Schnabel trailers." },
      { icon: Building2, title: "Millwright & Plant Rigging", desc: "Full plant relocations, machine line moves, anchor bolt installs, and precision leveling." },
      { icon: FileCheck, title: "Engineered Lift Plans", desc: "Stamped lift plans, rigging calculations, ground bearing analysis, and OSHA-compliant lift documentation." },
    ],
    steps: [
      { n: "01", t: "Site Walk & Lift Engineering", d: "Site walk, weights/CG verification, crane selection, rigging design, and an engineered lift plan." },
      { n: "02", t: "Permits & Coordination", d: "Road closures, building permits, coordination with facility EHS, electrical, and HVAC trades." },
      { n: "03", t: "Mobilization", d: "Cranes, riggers, gantries, jacks, and rigging gear delivered to the site on schedule." },
      { n: "04", t: "Execute the Lift", d: "Pre-lift safety briefing, signal-coordinated lift, precise placement or load-out onto transport." },
      { n: "05", t: "Demobilize & Document", d: "Clean demob, sign-off documentation, photos, and lift records delivered to the client." },
    ],
    highlights: [
      "Mobile cranes 50T – 500T+",
      "Crawler cranes for confined sites",
      "Hydraulic gantries to 250T",
      "Versa-Lift 25T / 40T / 60T",
      "Jacking, skating, and rolling",
      "Engineered lift plans (stamped)",
      "Millwright & plant rigging crews",
      "OSHA-compliant safety program",
    ],
    stats: [
      { v: "500T+", l: "Crane Capacity" },
      { v: "OSHA", l: "Compliant Safety" },
      { v: "NCCCO", l: "Certified Operators" },
      { v: "24/7", l: "Project Dispatch" },
    ],
    factsTitle: "Why Engineered Rigging Matters",
    facts: [
      "Every lift over a critical threshold (typically 75% of crane capacity or any lift over $1M asset value) should have an engineered, stamped lift plan.",
      "NCCCO-certified crane operators and qualified riggers/signalpersons are required by OSHA 1926 Subpart CC for most commercial lifts.",
      "Ground bearing pressure matters — crane mats and outrigger pads are calculated from soil bearing capacity, not just crane weight.",
      "Sensitive equipment (CNCs, transformers, presses) often has manufacturer-specified lift points and rigging requirements — we follow them.",
      "Tandem lifts (two cranes lifting one load) require engineered load distribution and synchronized signals.",
      "In-plant moves often beat crane lifts on cost when jacking and skating can do the job — we'll recommend the right method.",
    ],
    faqs: [
      { q: "Do you provide engineered lift plans?", a: "Yes — for any critical or oversize lift we provide a stamped engineered lift plan covering crane selection, rigging design, ground bearing, and step-by-step procedure." },
      { q: "Can you handle full plant relocations?", a: "Yes — from disconnect through reinstall, including millwrighting, rigging, transport, anchor bolt installs, leveling, and final reconnection coordination." },
      { q: "Do you have your own cranes or do you sub them?", a: "We operate our own fleet of mobile cranes, crawler cranes, hydraulic gantries, and Versa-Lifts, and partner with specialty crane companies for ultra-heavy or specialty lifts (500T+, ringer cranes, etc.)." },
      { q: "Are your operators and riggers certified?", a: "All crane operators are NCCCO-certified, and all riggers/signalpersons hold current rigging and signal certifications. We carry full OSHA, MSHA, and contractor safety documentation." },
      { q: "Can you lift inside a building with low clearance?", a: "Yes — that's exactly where Versa-Lifts, hydraulic gantries, and jacking-and-skating systems shine. We've executed in-plant moves under 12 ft of clearance." },
    ],
    ctaTitle: "Plan Your Heavy Lift With Us",
  },

  "pilot-car-service": {
    eyebrow: "Escort Vehicles for Wide Loads",
    heroBadge: "Certified Operators · All 50 States",
    heroTitleLead: "Pilot Car &",
    heroTitleAccent: "Escort Vehicle Service",
    heroSub:
      "Certified pilot cars and escort vehicles for oversize and superload moves across all fifty states. Lead, chase, high-pole, and route survey services — all coordinated through one dispatch so your oversize load moves safely, legally, and on schedule.",
    introTitle: "Escort Vehicles for Wide Loads Available in All Fifty States",
    introBody: [
      "Each state has various laws and regulations about when pilot cars are necessary for oversize loads. When you transport freight with Heavy Haul Group, our logistics agents make sure your load is safely and legally transported based on the requirements of each state. This ensures the safety of your heavy equipment, along with the team transporting it.",
      "Escort vehicles and pilot cars help navigate your load through traffic, reducing the risk of hazards or dangerous obstacles in the road. They make the heavy transport safer for everyone — your driver, your equipment, and the public driving alongside.",
      "While you can use an independent pilot car directory to find drivers in your area, at Heavy Haul Group we only work with the best. Our escort vehicle drivers are vetted to ensure they know the proper regulations and have the experience to move your oversize load safely. One call, one dispatcher — we book the haul and the pilot cars together.",
    ],
    pillars: [
      { icon: Compass, title: "Lead & Chase Pilot Cars", desc: "Certified pilot operators positioned ahead of and behind your load to warn traffic, watch clearances, and signal the driver." },
      { icon: AlertTriangle, title: "High-Pole Pilot Cars", desc: "Adjustable height-pole vehicles that verify every overhead obstruction — bridges, signs, utility lines — before your load reaches them." },
      { icon: MapPin, title: "Route Surveys", desc: "Pre-trip route surveys identifying low bridges, sharp turns, weight-restricted bridges, and required detours for superloads." },
      { icon: ShieldCheck, title: "Certified & Vetted Operators", desc: "Every pilot car operator is certified to the state requirements they work in — Florida, Utah, Washington, and others have strict certification standards." },
      { icon: Radio, title: "Police Escort Coordination", desc: "For superloads requiring law enforcement escort, we coordinate state police, county, and local agency escorts." },
      { icon: Truck, title: "One-Call Bundled Dispatch", desc: "Book the heavy haul and the pilot cars together — one quote, one dispatcher, one invoice. No coordination headaches." },
    ],
    steps: [
      { n: "01", t: "Quote With Pilot Cars Bundled", d: "Send your load dimensions and lane — we quote the haul and the required pilot cars together based on each state's rules." },
      { n: "02", t: "Route Survey (If Required)", d: "For superloads, a pre-trip route survey identifies low bridges, sharp curves, and required detours." },
      { n: "03", t: "Permits & Escort Booking", d: "Permits filed for each state. Certified pilot car operators booked and confirmed for every leg of the move." },
      { n: "04", t: "Roll", d: "Lead, chase, and high-pole pilots in position. Live coordination between drivers and dispatch through the whole haul." },
      { n: "05", t: "Delivery & Paperwork", d: "Signed POD, pilot car logs, and any state-required documentation returned with the final invoice." },
    ],
    highlights: [
      "Lead pilot cars",
      "Chase pilot cars",
      "High-pole / height verification",
      "Route surveys for superloads",
      "Police escort coordination",
      "Certified in all 50 states",
      "State-specific certification (FL, UT, WA, NY)",
      "Bundled with heavy haul booking",
    ],
    stats: [
      { v: "50", l: "States Covered" },
      { v: "100%", l: "Certified Operators" },
      { v: "24/7", l: "Dispatch" },
      { v: "1-Call", l: "Bundled Booking" },
    ],
    factsTitle: "Facts to Know About Pilot Car & Escort Vehicle Regulations",
    facts: [
      "Pilot car regulations vary by state, but must be adhered to in order to comply with traffic laws.",
      "Escort vehicles help oversize and wide loads avoid any hazards on the road.",
      "Pilot car drivers contribute to road safety as they are authorized to stop traffic and direct the movement of oversize loads through high-traffic areas that may cause a danger to the public.",
      "Escort vehicles are a signal to other drivers of an oversize or wide load, so they can also take precautions when driving near.",
      "Pilot car drivers must be certified to know the laws of the road and ensure they are providing the best possible safety measures.",
      "Pilot cars and escort vehicles add overall safety — not only for the heavy equipment transport, but for the team hauling and the public driving around it.",
    ],
    faqs: [
      { q: "When do I need a pilot car?", a: "Requirements vary by state, but generally any load over 12 ft wide, 14 ft 6 in tall, or 90 ft long needs at least one pilot car. Superloads (over 16 ft wide or 16 ft tall) typically require lead AND chase pilot cars plus possible high-pole and police escort." },
      { q: "Do you provide pilot cars in every state?", a: "Yes — our network covers all 50 states. We match pilot car operators who hold the specific certifications required by each state (Florida, Utah, Washington, New York, and others have unique requirements)." },
      { q: "What is a high-pole pilot car?", a: "A high-pole vehicle has an adjustable height pole set to the height of your load. It drives ahead and physically tests every overhead obstruction — bridges, signs, utilities — to verify clearance before your load arrives." },
      { q: "Can I book pilot cars without booking the haul through you?", a: "Yes — we provide pilot car services standalone if you only need escort vehicles. Just send your route, load dimensions, and dates." },
      { q: "How much do pilot cars cost?", a: "Typically $1.75 – $2.75 per mile per pilot car, with state-specific minimums and additional fees for high-pole or specialty escorts. We quote it bundled with the haul or standalone — your choice." },
    ],
    ctaTitle: "Book Pilot Cars With Your Haul",
  },

  "heavy-machinery-towing": {
    eyebrow: "Heavy-Duty Wrecker & Rotator Service",
    heroBadge: "Rotators · Heavy Wreckers · Lowboy Recovery",
    heroTitleLead: "Heavy Machinery",
    heroTitleAccent: "Towing & Recovery",
    heroSub:
      "Heavy-duty wrecker and rotator service for stranded construction equipment, semi trucks, and oversize loads. 75-ton-plus rotators, integrated heavy wreckers, and lowboy recovery — dispatched 24/7 across the country.",
    introTitle: "When It's Too Big For a Tow Truck — Call Us",
    introBody: [
      "Standard tow trucks can't handle a loaded semi on its side, an overturned excavator, or a disabled lowboy in the median. Heavy machinery towing is a different category — rotators, heavy wreckers, multi-axle lowboys, and rigging crews trained to recover the big stuff safely.",
      "Our heavy recovery fleet runs 75-ton-plus rotators, integrated heavy wreckers, and recovery lowboys for disabled or wrecked equipment. We respond to highway incidents, jobsite breakdowns, and remote recoveries — fast, insured, and with the right gear for the lift.",
      "Insurance adjusters, fleet managers, contractors, and DOTs call us because we recover the load, document the scene, and get the road or jobsite back open — without secondary damage and without the runaround.",
    ],
    pillars: [
      { icon: LifeBuoy, title: "Rotator Towing (75T+)", desc: "Heavy rotators for overturned semis, wrecked equipment, and complex lift-and-set recoveries." },
      { icon: Truck, title: "Heavy & Integrated Wreckers", desc: "Tandem-steer integrated wreckers for disabled tractors, dumps, garbage trucks, and vocational vehicles." },
      { icon: Wrench, title: "Lowboy Recovery", desc: "Disabled construction equipment loaded onto multi-axle lowboys for transport to a repair facility or yard." },
      { icon: Compass, title: "Off-Road & Jobsite Recovery", desc: "Stuck dozers, stuck cranes, ditch recoveries — winches, mats, and tracked recovery rigs for off-highway work." },
      { icon: Radio, title: "24/7 Live Dispatch", desc: "Our heavy recovery line is always answered. Average dispatch time under one hour for highway incidents." },
      { icon: ShieldCheck, title: "Insurance-Friendly Documentation", desc: "Photos, weight tickets, scene reports, and clean invoicing — we work directly with adjusters and fleet managers." },
    ],
    steps: [
      { n: "01", t: "Emergency Call", d: "24/7 dispatch captures location, equipment, and incident details. Recovery rig assigned within minutes." },
      { n: "02", t: "On-Site Assessment", d: "Recovery specialist evaluates the safest recovery method — winch, rotator lift, or lowboy load." },
      { n: "03", t: "Traffic Control & Permits", d: "Coordination with state police, DOT, and local agencies for safe lane closures and recovery." },
      { n: "04", t: "Recover & Transport", d: "Equipment safely uprighted, secured, and transported to your repair facility or storage yard." },
      { n: "05", t: "Documentation & Invoice", d: "Photo documentation, recovery report, and clean invoicing for insurance or fleet records." },
    ],
    highlights: [
      "75-ton + rotator service",
      "Integrated heavy wreckers",
      "Multi-axle lowboy recovery",
      "Highway and jobsite response",
      "Off-road / ditch recovery",
      "Insurance documentation",
      "24/7 live dispatch",
      "Nationwide coverage",
    ],
    stats: [
      { v: "75T+", l: "Rotator Capacity" },
      { v: "<60", l: "Min. Dispatch" },
      { v: "24/7", l: "Live Operators" },
      { v: "50", l: "States" },
    ],
    factsTitle: "Heavy Recovery vs. Standard Towing",
    facts: [
      "Anything over 26,000 lbs GVW or oversize equipment requires a heavy wrecker — standard rollback tow trucks aren't rated for it.",
      "Rotators (75-ton+) are required for upright recoveries of loaded semis, tankers, and overturned equipment.",
      "Secondary damage during recovery is a major risk — using the wrong gear can turn a $50K repair into a $250K total loss.",
      "Most heavy recoveries on public roads require coordination with state DOT and law enforcement.",
      "Insurance carriers prefer documented, professional heavy recovery — clean scene reports speed up claims processing.",
      "Off-road recoveries often need crane mats, winch tractors, and rigging gear that standard tow operators don't carry.",
    ],
    faqs: [
      { q: "What's the difference between a rotator and a heavy wrecker?", a: "A rotator has a rotating boom (like a small crane) that can lift and reposition heavy loads from any angle — essential for overturned trucks. A heavy wrecker is built for pulling disabled trucks but doesn't have the same lift-and-reposition flexibility." },
      { q: "Can you recover equipment off-road?", a: "Yes — we have winch tractors, crawler recovery rigs, and crane mats for ditches, mud, soft ground, and remote jobsite recoveries." },
      { q: "Do you work with insurance companies?", a: "Yes — we provide clean photo documentation, scene reports, and invoicing that insurance adjusters and fleet managers can submit directly." },
      { q: "How fast can you arrive?", a: "Highway incidents in major metros typically see a recovery rig on-site within 60–90 minutes. Remote or off-road incidents depend on staging — call dispatch for an exact ETA." },
      { q: "Do you provide secondary transport after recovery?", a: "Yes — once recovered, we can transport the equipment on our own lowboys directly to your repair facility, dealer, or storage yard. One call covers recovery and transport." },
    ],
    ctaTitle: "Need Heavy Recovery Now?",
  },

  "partial-load-shipping": {
    eyebrow: "LTL & Partial Truckload Heavy Haul",
    heroBadge: "Pay Only For the Space You Use",
    heroTitleLead: "Partial Load",
    heroTitleAccent: "Heavy Haul Shipping",
    heroSub:
      "LTL and partial truckload heavy haul service — pay only for the space your equipment uses. Step deck, flatbed, and RGN consolidations with the same insurance, tracking, and dispatch as a full truckload.",
    introTitle: "Why Pay For a Whole Truck When You Only Need Half?",
    introBody: [
      "Shipping a small skid steer, a mini excavator, a piece of attachment, or any equipment that doesn't fill a 48 ft trailer? Partial load shipping is the smart move — you pay only for the linear feet of trailer your load takes up, and we consolidate it with other freight running the same lane.",
      "Our LTL and partial truckload network runs daily on every major heavy haul lane in the country. You get the same $1M cargo insurance, real-time GPS tracking, and dedicated dispatcher as a full truckload — at a fraction of the cost.",
      "Dealers, auction buyers, contractors, and rental yards lean on partial loads to control freight spend without sacrificing service. We match your load to the right consolidation and quote you a transparent, all-in rate — no hidden fees, no broker games.",
    ],
    pillars: [
      { icon: Package, title: "Pay For What You Use", desc: "Linear-foot or per-cube pricing — only pay for the trailer space your equipment actually takes up." },
      { icon: Truck, title: "Step Deck, Flatbed, RGN", desc: "Right trailer for the load — step decks for taller equipment, flatbeds for standard, RGNs for tracked/heavy partials." },
      { icon: Clock, title: "Daily Lane Consolidations", desc: "We consolidate partial loads on every major U.S. lane daily — your equipment ships within days, not weeks." },
      { icon: ShieldCheck, title: "Full $1M Cargo Coverage", desc: "Same insurance, same tracking, same dispatcher as a full truckload — even when you're sharing trailer space." },
      { icon: Building2, title: "Dealer & Auction-Friendly", desc: "Frequent partial freight from Ritchie Bros, IronPlanet, Purple Wave, and dealer yards across the country." },
      { icon: Radio, title: "Real-Time GPS Tracking", desc: "Live load tracking from pickup through delivery, regardless of consolidation stops." },
    ],
    steps: [
      { n: "01", t: "Send Load Details", d: "Equipment dimensions, weight, origin, destination — we calculate linear feet and quote the partial rate." },
      { n: "02", t: "Match To A Consolidation", d: "We match your load to a trailer running your lane within a few days — or stage a dedicated partial run if needed." },
      { n: "03", t: "Pickup", d: "Our driver picks up at your origin and either consolidates en route or heads straight to the next pickup." },
      { n: "04", t: "Track & Deliver", d: "Real-time GPS through the whole haul. Delivery scheduled with your contact at destination." },
      { n: "05", t: "POD & Invoice", d: "Signed proof of delivery and a clean, itemized invoice — same paperwork as a full truckload." },
    ],
    highlights: [
      "Linear-foot pricing",
      "Daily lane consolidations",
      "Step deck · flatbed · RGN options",
      "$1M cargo insured",
      "Real-time GPS tracking",
      "Dealer & auction-friendly",
      "Same-week dispatch on most lanes",
      "Net-30 terms available",
    ],
    stats: [
      { v: "Daily", l: "Lane Consolidations" },
      { v: "$1M", l: "Cargo Insured" },
      { v: "50", l: "States" },
      { v: "30-50%", l: "Typical Savings vs. FTL" },
    ],
    factsTitle: "When Partial Load Makes Sense",
    facts: [
      "Partial loads typically save 30–50% vs. booking a full truckload when your equipment is under 20–25 linear feet.",
      "Skid steers, mini excavators, small dozers, attachments, and parts pallets are all ideal partial-load freight.",
      "Linear-foot pricing means a 10 ft load pays for 10 ft of trailer, not the whole 48 ft.",
      "Transit times are typically 1–3 days longer than a dedicated full truckload because of consolidation stops.",
      "All partial loads carry the same $1M cargo insurance and the same dispatcher accountability as a full truckload.",
      "Auction buyers love partial loads — winning one machine doesn't justify a whole trailer, and we move auction freight daily.",
    ],
    faqs: [
      { q: "How is partial-load pricing calculated?", a: "By linear feet of trailer space your load occupies, plus weight if your load is unusually heavy for its footprint. We quote one all-in number — no hidden fees." },
      { q: "How long does partial shipping take?", a: "Most partials dispatch within 2–5 business days and transit 1–3 days longer than a full truckload depending on consolidation route." },
      { q: "Is my equipment insured on a partial load?", a: "Yes — full $1M cargo coverage on every load, partial or full. COIs available in 15 minutes." },
      { q: "Can I ship from an auction on a partial load?", a: "Absolutely — auction loads are some of our most common partial freight. We pick up at Ritchie Bros, IronPlanet, Purple Wave, and dealer yards daily." },
      { q: "What trailers do you use for partials?", a: "Step decks for taller equipment, flatbeds for standard, and RGNs for tracked or heavy partials. We match the right trailer to your specific load." },
    ],
    ctaTitle: "Get Your Partial Load Quote",
  },
};

export const NON_FREIGHT_SLUGS = Object.keys(CONTENT);

const ServiceDetail = ({ cat }: { cat: Category }) => {
  const c = CONTENT[cat.slug];
  if (!c) return null;

  // Animated progress bar — visual flourish along the "How It Works" timeline
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const seen = Math.min(total, Math.max(0, vh - rect.top));
      setProgress(Math.min(100, Math.max(0, (seen / total) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: cat.name,
    provider: { "@type": "MovingCompany", name: "Heavy Haul Group", telephone: "+1-800-555-0199" },
    areaServed: "United States",
    description: cat.blurb,
  };

  return (
    <>
      <SEO
        title={`${cat.name} | ${c.eyebrow} - Heavy Haul Group`}
        description={`${cat.blurb} ${c.heroBadge}.`}
        path={`/services/${cat.slug}`}
        image={cat.image}
        jsonLd={jsonLd}
      />

      {/* HERO with quote form */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <img
          src={HERO_IMAGES[cat.slug] ?? cat.image}
          alt={cat.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          width={1920}
          height={900}
        />
        {/* Softer overlays so the background photo stays clearly visible while the headline remains readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/75 via-secondary/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-secondary/10" />

        <div className="relative container-tight py-14 lg:py-24">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 mb-5">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{cat.short}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm bg-primary/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                <ShieldCheck className="h-3.5 w-3.5" /> {c.heroBadge}
              </div>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">{c.eyebrow}</p>
              <h1 className="stencil text-4xl sm:text-6xl lg:text-7xl font-bold uppercase max-w-3xl leading-[0.95]">
                {c.heroTitleLead} <span className="text-primary">{c.heroTitleAccent}</span>
              </h1>
              <p className="mt-5 text-lg text-white/85 max-w-2xl">{c.heroSub}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={`tel:${PHONE}`}><Button variant="hero" size="xl"><Phone /> Call {DISPLAY}</Button></a>
                <a href="#quote"><Button variant="call" size="xl">Get Free Quote <ArrowRight /></Button></a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-white/80">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Fully Insured</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 24/7 Dispatch</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Nationwide</span>
              </div>
            </div>
            <aside id="quote" className="lg:col-span-5 scroll-mt-24">
              {QUOTE_VARIANTS[cat.slug] ? <ServiceQuoteForm slug={cat.slug} /> : <InstantQuoteCalculator />}
            </aside>
          </div>
        </div>

        <div className="relative h-[3px] w-full overflow-hidden bg-secondary-foreground/10">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_hsl(var(--primary))] animate-sweep-x" />
        </div>
      </section>

      <RecentShipmentsTicker />

      {/* INTRO — full long-form */}
      {(() => {
        const isBorder = cat.slug === "canada-shipping-service" || cat.slug === "mexico-shipping-service";
        return (
      <section className="py-14 sm:py-20 bg-background">
        <div className={`container-tight ${isBorder ? "" : "grid lg:grid-cols-12 gap-10"}`}>
          <div className={isBorder ? "" : "lg:col-span-8"}>
            <Reveal>
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">About This Service</p>
              <h2 className="stencil text-3xl sm:text-5xl font-bold uppercase mb-5 leading-[0.95]">
                {c.introTitle}
              </h2>
            </Reveal>

            {isBorder ? (
              <>
                <Reveal>
                  <p className="text-muted-foreground leading-relaxed text-[15px] max-w-3xl">
                    {c.introBody[0]}
                  </p>
                </Reveal>

                {(() => {
                  const isCanada = cat.slug === "canada-shipping-service";
                  const highlights = isCanada
                    ? [
                        { k: "Northbound", v: "ACE eManifest + PARS pre-cleared. Ritchie Bros / IronPlanet wins delivered to ON, AB, BC, QC." },
                        { k: "Southbound", v: "PAPS sticker, bonded driver. Cat dozers & ag iron to U.S. jobsites — no broker chasing." },
                        { k: "One Point", v: "One dispatcher, one quote (CAD/USD), one invoice. Live GPS pickup → drop." },
                      ]
                    : [
                        { k: "Southbound", v: "Pedimento + bonded drayage to maquiladoras in MTY, Saltillo, Querétaro, CDMX." },
                        { k: "Northbound", v: "ACE eManifest, EPA & DOT prepped before the bridge. MX auction iron rolled north." },
                        { k: "Bilingual", v: "EN/ES dispatch staged at Laredo, Otay Mesa, El Paso, Pharr, Eagle Pass." },
                      ];

                  return (
                    <div className="mt-10 grid lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-7">
                        <CrossBorderRoute
                          from={{ code: "USA", name: "United States", flag: "🇺🇸" }}
                          to={isCanada
                            ? { code: "CAN", name: "Canada", flag: "🇨🇦" }
                            : { code: "MEX", name: "Mexico", flag: "🇲🇽" }}
                          crossings={isCanada
                            ? ["Pacific Hwy", "Sweetgrass", "Pembina", "Detroit–Windsor", "Buffalo", "Champlain"]
                            : ["Laredo", "Otay Mesa", "El Paso", "Pharr", "Eagle Pass"]}
                        />
                      </div>
                      <Reveal className="lg:col-span-5">
                        <ul className="divide-y divide-border border-2 border-border bg-card rounded-md">
                          {highlights.map((h) => (
                            <li key={h.k} className="p-4 sm:p-5">
                              <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1.5">{h.k}</div>
                              <p className="text-[13.5px] text-muted-foreground leading-relaxed">{h.v}</p>
                            </li>
                          ))}
                        </ul>
                      </Reveal>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="text-muted-foreground leading-relaxed text-[15px] space-y-4">
                {c.introBody.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {isBorder && (
              <Reveal>
                <div className="mt-10 bg-secondary text-secondary-foreground rounded-md p-6 sm:p-7 border-t-4 border-primary shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary">What's Included</div>
                    <a href="#quote" className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
                      Request Quote <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-[13px] text-white/90">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="font-medium">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
          {!isBorder && (
            <aside className="lg:col-span-4">
              <Reveal>
                <div className="bg-secondary text-secondary-foreground rounded-md p-6 border-t-4 border-primary shadow-card sticky top-24">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">What's Included</div>
                  <ul className="space-y-2.5">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-[13px] text-white/90">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="font-medium">{h}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#quote" className="mt-5 inline-flex items-center justify-between w-full gap-2 rounded-sm bg-primary px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
                    Request Quote <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            </aside>
          )}
        </div>
      </section>
        );
      })()}

      {/* PILLARS — what we deliver */}
      <section className="py-14 sm:py-20 bg-muted/40 border-y border-border">
        <div className="container-tight">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">What We Deliver</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              {cat.short} <span className="text-primary">Done Right</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.pillars.map((p) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title}>
                  <div className="h-full bg-card border-2 border-border rounded-md p-6 hover:border-primary hover:shadow-card transition-all">
                    <span className="inline-flex h-12 w-12 rounded-md bg-primary text-primary-foreground items-center justify-center mb-4">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="font-display uppercase text-lg mb-2 leading-tight">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY — per-service (moved up) */}
      {GALLERIES[cat.slug] && (
        <section className="py-14 sm:py-20 bg-background">
          <div className="container-tight">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">{GALLERIES[cat.slug].eyebrow}</p>
              <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
                {GALLERIES[cat.slug].title} <span className="text-primary">{GALLERIES[cat.slug].accent}</span>
              </h2>
              <p className="mt-3 text-muted-foreground text-[15px]">{GALLERIES[cat.slug].sub}</p>
            </Reveal>
            <div className={`grid gap-5 ${GALLERIES[cat.slug].items.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {GALLERIES[cat.slug].items.map((g, i) => (
                <Reveal key={g.title}>
                  <div className="group relative overflow-hidden rounded-md border-2 border-border hover:border-primary transition-all shadow-card">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={g.src}
                        alt={g.title}
                        loading="lazy"
                        width={1280}
                        height={960}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1">{String(i + 1).padStart(2, "0")} · {GALLERIES[cat.slug].eyebrow.split(" ").pop()}</div>
                      <h3 className="font-display uppercase text-base text-white leading-tight">{g.title}</h3>
                      <p className="text-[12px] text-white/80 mt-1 leading-snug">{g.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      <section className="py-10 sm:py-12 bg-gradient-dark border-y border-white/10">
        <div className="container-tight grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {c.stats.map((s) => (
            <div key={s.l}>
              <div className="stencil text-3xl sm:text-4xl text-primary">{s.v}</div>
              <div className="font-bold uppercase tracking-wider text-xs sm:text-sm text-white mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTIAL LOAD — revenue & cost benefits */}
      {cat.slug === "partial-load-shipping" && (
        <section className="py-14 sm:py-20 bg-gradient-dark text-white border-y border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 14px, hsl(var(--primary)) 14px, hsl(var(--primary)) 28px)" }} />
          <div className="relative container-tight">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Revenue & Cost Benefits</p>
              <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
                Why Partial Loads <span className="text-primary">Win On Cost</span>
              </h2>
              <p className="mt-3 text-white/75 text-[15px]">
                Booking a full truck for a single machine or a few pallets is money on the table. Partial loads share trailer space so your freight only pays for what it uses — and the savings compound on every lane.
              </p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PARTIAL_BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <Reveal key={b.label}>
                    <div className="h-full bg-white/[0.04] border border-white/10 rounded-md p-6 hover:border-primary transition-all">
                      <span className="inline-flex h-11 w-11 rounded-md bg-primary text-primary-foreground items-center justify-center mb-4">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="stencil text-4xl sm:text-5xl text-primary leading-none">{b.big}</div>
                      <div className="font-display uppercase text-sm tracking-wider mt-2 text-white">{b.label}</div>
                      <p className="text-[13px] text-white/70 mt-2 leading-relaxed">{b.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal>
              <div className="mt-10 grid lg:grid-cols-2 gap-5">
                <div className="bg-white/[0.04] border border-white/10 rounded-md p-6">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">Full Truckload</div>
                  <div className="flex items-baseline gap-2"><span className="stencil text-4xl text-white/40 line-through">$4,500</span><span className="text-xs text-white/50">1,000 mi · single machine</span></div>
                  <ul className="mt-4 space-y-1.5 text-[13px] text-white/70">
                    <li>· Pay for 53 ft of empty deck</li>
                    <li>· Wait for dedicated dispatch</li>
                    <li>· Full insurance & fuel on you</li>
                  </ul>
                </div>
                <div className="bg-primary/15 border-2 border-primary rounded-md p-6 relative">
                  <span className="absolute -top-3 right-4 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm">You Save 40%</span>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">Partial Load</div>
                  <div className="flex items-baseline gap-2"><span className="stencil text-5xl text-primary">$2,700</span><span className="text-xs text-white/70">same 1,000 mi · same machine</span></div>
                  <ul className="mt-4 space-y-1.5 text-[13px] text-white/90">
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Pay only the linear feet you use</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Dispatched in 2–5 business days</li>
                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> $1M cargo insurance included</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* HOW IT WORKS — vertical timeline (moved down) */}
      <section className="py-14 sm:py-20 bg-background" ref={timelineRef}>
        <div className="container-tight max-w-4xl">
          <Reveal className="text-center mb-12">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">How It Works</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              From Call To <span className="text-primary">Completed</span>
            </h2>
          </Reveal>
          <div className="relative pl-8 sm:pl-12">
            <div className="absolute left-3 sm:left-5 top-0 bottom-0 w-0.5 bg-border" />
            <div
              className="absolute left-3 sm:left-5 top-0 w-0.5 bg-primary shadow-[0_0_12px_hsl(var(--primary))] transition-[height] duration-200"
              style={{ height: `${progress}%` }}
            />
            <ol className="space-y-7">
              {c.steps.map((s) => (
                <Reveal key={s.n}>
                  <li className="relative">
                    <span className="absolute -left-8 sm:-left-12 top-0 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs font-extrabold ring-4 ring-background">
                      {s.n}
                    </span>
                    <div className="bg-card border border-border rounded-md p-5 hover:border-primary transition-colors">
                      <h3 className="font-display uppercase text-lg mb-1.5">{s.t}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FACTS — informational block */}
      <section className="py-14 sm:py-20 bg-secondary text-secondary-foreground">
        <div className="container-tight max-w-5xl">
          <Reveal className="mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Good To Know</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              {c.factsTitle}
            </h2>
          </Reveal>
          <ul className="grid sm:grid-cols-2 gap-4">
            {c.facts.map((f, i) => (
              <Reveal key={i}>
                <li className="flex gap-3 bg-background/[0.04] border border-white/10 rounded-md p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-extrabold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] text-white/90 leading-relaxed">{f}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-background border-y border-border">
        <div className="container-tight py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" /> FMCSA Licensed</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> $1M Cargo Insured</span>
          <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> Bonded & Compliant</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> 50-State Authority</span>
          <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary fill-primary" /> BBB A+ Rated</span>
        </div>
      </section>

      {/* CTA BANNER */}
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
              <div className="font-display uppercase text-2xl sm:text-3xl leading-tight">{c.ctaTitle}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${PHONE}`}><Button variant="call" size="xl" className="hover-scale"><Phone /> Call {DISPLAY}</Button></a>
            <a href="#quote"><Button size="xl" className="bg-secondary text-white hover:bg-secondary/90 hover-scale font-bold uppercase tracking-wide">Get Free Quote <ArrowRight /></Button></a>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container-tight max-w-4xl">
          <Reveal className="text-center mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">FAQs</p>
            <h2 className="stencil text-3xl sm:text-4xl font-bold uppercase">
              {cat.short} <span className="text-primary">FAQs</span>
            </h2>
          </Reveal>
          <Accordion type="single" collapsible defaultValue="sd-0" className="space-y-3">
            {c.faqs.map((f, i) => (
              <AccordionItem key={i} value={`sd-${i}`} className="bg-card border border-border rounded-md px-5 shadow-sm hover:border-primary/50 transition-colors">
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

      {/* RELATED */}
      <section className="py-14 bg-muted/40 border-t border-border">
        <div className="container-tight">
          <Reveal><p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4">Related Services</p></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.filter((x) => x.slug !== cat.slug).slice(0, 6).map((x) => {
              // Use service-specific hero image when available, fall back to category image
              const img = HERO_IMAGES[x.slug] ?? x.image;
              return (
                <Link key={x.slug} to={`/services/${x.slug}`} className="group flex items-center gap-4 bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                  <img src={img} alt={x.name} loading="lazy" className="h-16 w-20 object-cover rounded-sm" width={80} height={64} />
                  <div className="flex-1">
                    <div className="font-display uppercase text-sm">{x.name}</div>
                    <div className="text-xs text-muted-foreground">Heavy haul service</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
