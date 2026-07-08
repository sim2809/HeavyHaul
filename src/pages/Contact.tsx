import SEO from "@/components/SEO";
import InstantQuoteCalculator from "@/components/InstantQuoteCalculator";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { PHONE, DISPLAY } from "@/components/StickyCall";

const Contact = () => (
  <>
    <SEO
      title="Contact Heavy Haul Group | 24/7 Dispatch · Free Quote"
      description="Speak with a heavy haul dispatcher 24/7. Call (800) 555-0199 or request a free quote online. Response in under 10 minutes."
      path="/contact"
    />
    <section className="bg-secondary text-secondary-foreground py-14 lg:py-20">
      <div className="container-tight max-w-4xl">
        <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Contact Dispatch</p>
        <h1 className="stencil text-4xl sm:text-6xl font-bold uppercase">
          Get Your <span className="text-primary">Best Rate.</span>
        </h1>
        <p className="mt-4 text-white/80 text-lg">Available 24/7 · Response in under 10 minutes</p>
      </div>
    </section>

    <section className="py-14 bg-background">
      <div className="container-tight grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-4">
          <a href={`tel:${PHONE}`} className="flex items-center gap-4 bg-card border border-border rounded-md p-5 hover:border-primary transition">
            <span className="h-12 w-12 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta"><Phone className="h-6 w-6 text-secondary" /></span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Call 24/7</div>
              <div className="stencil text-2xl text-foreground">{DISPLAY}</div>
            </div>
          </a>
          <a href="mailto:dispatch@heavyhaulgroup.com" className="flex items-center gap-4 bg-card border border-border rounded-md p-5 hover:border-primary transition">
            <span className="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><Mail className="h-6 w-6" /></span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
              <div className="font-display uppercase text-base">dispatch@heavyhaulgroup.com</div>
            </div>
          </a>
          <div className="flex items-center gap-4 bg-card border border-border rounded-md p-5">
            <span className="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><Clock className="h-6 w-6" /></span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Hours</div>
              <div className="font-display uppercase text-base">24 / 7 · 365 Days</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-card border border-border rounded-md p-5">
            <span className="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><MapPin className="h-6 w-6" /></span>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Service Area</div>
              <div className="font-display uppercase text-base">All 50 States · Cross-Border</div>
            </div>
          </div>
        </div>
        <div id="quote" className="lg:col-span-7 scroll-mt-24">
          <InstantQuoteCalculator />
        </div>
      </div>
    </section>
  </>
);

export default Contact;
