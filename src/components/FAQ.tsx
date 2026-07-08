import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { useSiteContent } from "@/hooks/useSiteContent";

// Default FAQs (used as fallback + for JSON-LD when CMS hasn't loaded)
export const FAQS = [
  { q: "How much does heavy haul shipping cost?", a: "Most heavy haul shipments range from $2.50 to $5.50 per mile, depending on equipment size, weight, distance, and required permits. Use our instant quote calculator above for a real estimate in 60 seconds. Final pricing always includes permits, pilot cars (if needed), and full insurance — no hidden fees." },
  { q: "Are my loads fully insured?", a: "Yes. Every shipment is covered by $1,000,000 in cargo insurance and $1,000,000 in liability coverage. We can provide certificates of insurance for your project or jobsite within 15 minutes of booking." },
  { q: "How fast can you pick up my equipment?", a: "Standard pickups happen within 24–48 hours. Urgent and same-day dispatch is available — we have 12,000+ vetted carriers across all 50 states, so there's almost always a rig within a few hours of your pickup location." },
  { q: "Do you handle permits and pilot cars?", a: "Yes — we handle all oversize/overweight permits, route surveys, and pilot car coordination for every state on your route. You don't lift a finger. Permit costs are included in your quote." },
  { q: "What if my equipment is damaged in transit?", a: "Damage during transit is extremely rare with our vetted carrier network, but if it ever happens, our $1M cargo insurance covers repairs. We document load condition with photos at pickup and delivery, and our claims team responds within 24 hours." },
  { q: "Can I cancel or reschedule my shipment?", a: "Yes. You can reschedule for free up to 24 hours before pickup. Cancellations more than 24 hours out are 100% refunded. Inside 24 hours, a small dispatch fee may apply to cover the carrier's reserved time." },
  { q: "Do you ship to Canada and Mexico?", a: "Yes. We're licensed for cross-border heavy haul into Canada and Mexico, including all customs brokerage, FAST/CTPAT clearance, and bilingual coordination." },
  { q: "What types of equipment can you haul?", a: "Construction equipment (excavators, dozers, cranes), agricultural machinery (combines, tractors), industrial equipment (CNC, generators), heavy-duty trucks (semis, dump trucks), and superloads up to 250,000+ lbs. If it fits on a lowboy, RGN, step deck, or specialized trailer — we move it." },
];

const FAQ = () => {
  const { get } = useSiteContent();
  const items = FAQS.map((f, i) => ({
    q: get("faq", `q${i + 1}`, f.q),
    a: get("faq", `a${i + 1}`, f.a),
  })).filter((f) => f.q && f.a);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <div className="container-tight grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
              <HelpCircle className="h-3.5 w-3.5" /> {get("faq","eyebrow","Frequently Asked")}
            </p>
            <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase leading-[0.95]">
              {get("faq","title_1","Got Questions?")}
              <br />{get("faq","title_2","We've Got Answers.")}
            </h2>
            <p className="text-muted-foreground mt-4">
              {get("faq","subtitle","Most shippers ask the same things before booking. Here are straight answers to the top 8 — pricing, insurance, timing, and more.")}
            </p>
            <div className="mt-6 bg-secondary text-white rounded-md p-5 border-t-4 border-primary">
              <p className="text-sm text-white/80 mb-3">{get("faq","side_note","Still have a question? Talk to a real dispatcher in under 60 seconds.")}</p>
              <a href={`tel:${PHONE}`}>
                <Button variant="hero" size="lg" className="w-full"><Phone /> Call {DISPLAY}</Button>
              </a>
              <Link to="/contact#quote" className="block mt-2">
                <Button variant="outline" size="lg" className="w-full bg-transparent border-white/20 text-white hover:bg-white hover:text-secondary">
                  {get("faq","side_email_label","Email Dispatch")} <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
            {items.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
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
      </div>
    </section>
  );
};

export default FAQ;
