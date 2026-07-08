import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { Boxes, Truck, DollarSign, Clock, CheckCircle2, ArrowRight, Phone } from "lucide-react";

const benefits = [
  { icon: DollarSign, title: "Pay Only For Your Space", desc: "Share trailer capacity and cut shipping costs up to 40% vs. full truckload." },
  { icon: Clock, title: "Flexible Pickup Windows", desc: "Same-week dispatch on most LTL and partial heavy loads, coast to coast." },
  { icon: Truck, title: "Step Deck, Flatbed & RGN", desc: "Right trailer for partial oversize, machinery, pallets and crated freight." },
  { icon: Boxes, title: "Consolidated Routes", desc: "We combine compatible loads on the same lane, faster, greener, cheaper." },
];

const PartialLoad = () => (
  <section className="py-16 sm:py-24 bg-background">
    <div className="container-tight grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-7">
        <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
          <span className="h-px w-8 bg-primary" /> Partial Load Shipping
        </p>
        <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
          LTL Hauling <span className="text-primary">Solutions</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
          Not a full load? No problem. Our partial load and Less-Than-Truckload (LTL) program
          consolidates freight nationwide, so you only pay for the trailer space you actually use.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-4 rounded-md border border-border bg-card hover:border-primary transition-colors">
              <span className="h-10 w-10 shrink-0 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display uppercase text-base">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-6 grid sm:grid-cols-2 gap-2">
          {[
            "Pallets, crates & machinery parts",
            "Partial oversize & wide loads",
            "Construction & ag attachments",
            "Cross-country lane consolidation",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link to="/contact#quote">
            <Button variant="hero" size="xl">Get LTL Quote <ArrowRight /></Button>
          </Link>
          <a href={`tel:${PHONE}`}>
            <Button variant="outline" size="xl" className="font-bold uppercase">
              <Phone /> {DISPLAY}
            </Button>
          </a>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="relative rounded-md overflow-hidden shadow-card border border-border">
          <div className="bg-secondary text-secondary-foreground p-7">
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2">Save Up To</div>
            <div className="stencil text-7xl text-primary leading-none">40%</div>
            <p className="mt-2 text-white/70 text-sm">on shipping costs vs. full truckload by sharing trailer space on partial loads.</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { v: "LTL", l: "Pallets" },
                { v: "Partial", l: "Oversize" },
                { v: "Full", l: "Truckload" },
              ].map((x) => (
                <div key={x.v} className="bg-white/5 border border-white/10 rounded p-3">
                  <div className="stencil text-base text-primary">{x.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/55">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-2 bg-gradient-stripe" />
          <div className="bg-card p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Response in under 10 minutes</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
);

export default PartialLoad;
