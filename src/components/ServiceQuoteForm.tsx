import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  ArrowRight, ShieldCheck, Clock, CheckCircle2, Loader2,
  Phone, Mail, User, Send, Gift, AlertTriangle,
} from "lucide-react";

type FieldType = "text" | "textarea" | "select" | "tel" | "date";
type Field = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  half?: boolean;
};

export type QuoteVariant = {
  badge: string;
  title: string;
  titleAccent: string;
  cta: string;
  fields: Field[];
  callbackPromise?: string;
};

export const QUOTE_VARIANTS: Record<string, QuoteVariant> = {
  "pilot-car-service": {
    badge: "Pilot Car Quote · Permits Ready",
    title: "Book A",
    titleAccent: "Pilot Car",
    cta: "Get Pilot Car Rate",
    callbackPromise: "Routing specialist will call within 10 min.",
    fields: [
      { id: "origin", label: "Origin (City, State or ZIP)", type: "text", placeholder: "Dallas, TX 75201", required: true },
      { id: "destination", label: "Destination", type: "text", placeholder: "Denver, CO 80202", required: true },
      { id: "loadDims", label: "Load Dimensions (L × W × H)", type: "text", placeholder: "75 ft × 14 ft × 15 ft", required: true },
      { id: "cars", label: "Pilot Cars Needed", type: "select", options: ["1 (Lead OR Chase)", "2 (Lead + Chase)", "3+ (with Pole Car / Steer)", "Not sure — advise"], required: true, half: true },
      { id: "date", label: "Move Date", type: "date", required: true, half: true },
      { id: "permits", label: "Permit Status", type: "select", options: ["Permits in hand", "Need help with permits", "Routing only"], required: true },
    ],
  },
  "rigging-and-lifting-service": {
    badge: "Rigging & Lift Quote · Engineered",
    title: "Plan Your",
    titleAccent: "Lift",
    cta: "Get Rigging Quote",
    callbackPromise: "A rigging supervisor will call within 15 min.",
    fields: [
      { id: "siteAddress", label: "Job Site Address", type: "text", placeholder: "Street, City, State", required: true },
      { id: "equipment", label: "Item / Equipment To Lift", type: "text", placeholder: "e.g. CNC Mill, Transformer, Generator", required: true },
      { id: "weight", label: "Approx Weight (lbs)", type: "text", placeholder: "45,000", required: true, half: true },
      { id: "dimensions", label: "Dimensions (L × W × H)", type: "text", placeholder: "12 × 6 × 8 ft", required: true, half: true },
      { id: "liftType", label: "Type Of Work", type: "select", options: ["Crane Lift", "Forklift / Skating", "Machinery Move / Set", "Plant Relocation", "Unload Only"], required: true, half: true },
      { id: "date", label: "Target Date", type: "date", required: true, half: true },
      { id: "notes", label: "Site Access / Ceiling Height / Notes", type: "textarea", placeholder: "Indoor lift, 18 ft ceiling, dock available…" },
    ],
  },
  "catastrophic-recovery": {
    badge: "Emergency Recovery · 24/7 Response",
    title: "Request Emergency",
    titleAccent: "Recovery",
    cta: "Dispatch Recovery Now",
    callbackPromise: "On-call recovery dispatcher will call within 5 min.",
    fields: [
      { id: "incidentLocation", label: "Incident Location (Address / Mile Marker)", type: "text", placeholder: "I-40 EB · Mile 142 · Amarillo, TX", required: true },
      { id: "vehicleType", label: "Vehicle / Equipment Type", type: "select", options: ["Semi Tractor", "Loaded Trailer", "Heavy Equipment (Dozer/Excavator)", "Tanker", "Multiple Units", "Other"], required: true, half: true },
      { id: "incidentType", label: "Incident Type", type: "select", options: ["Overturned / Rollover", "Off-Road / Ditch", "Cargo Spill", "Submerged", "Collision Recovery", "Other"], required: true, half: true },
      { id: "urgency", label: "Urgency", type: "select", options: ["IMMEDIATE — Roadway Blocked", "Within 2 Hours", "Today", "Tomorrow / Scheduled"], required: true, half: true },
      { id: "authority", label: "On Scene", type: "select", options: ["Police / DOT On Scene", "Driver Only", "Owner / Insurance Adjuster", "No One Yet"], required: true, half: true },
      { id: "notes", label: "Cargo / Hazards / Details", type: "textarea", placeholder: "Loaded with steel coils, fluids leaking…" },
    ],
  },
  "heavy-machinery-towing": {
    badge: "Heavy Tow Quote · 24/7 Rolling",
    title: "Get Heavy",
    titleAccent: "Tow Service",
    cta: "Request Heavy Tow",
    callbackPromise: "Heavy tow dispatcher will call within 10 min.",
    fields: [
      { id: "breakdown", label: "Breakdown Location", type: "text", placeholder: "I-70 · Mile 218 · Topeka, KS", required: true },
      { id: "destination", label: "Tow To (Shop / Yard)", type: "text", placeholder: "Repair shop or destination address", required: true },
      { id: "vehicle", label: "Vehicle / Equipment Type", type: "select", options: ["Semi Tractor", "Tractor + Loaded Trailer", "Box Truck / Vocational", "Heavy Equipment", "Bus / RV", "Other"], required: true, half: true },
      { id: "weight", label: "GVW (Approx)", type: "select", options: ["Under 26k", "26k – 40k", "40k – 60k", "60k – 80k", "Over 80k / Oversize"], required: true, half: true },
      { id: "wheels", label: "Wheels Rolling?", type: "select", options: ["Yes — Rolls Freely", "No — Drive Axle Locked", "No — Steer Damaged", "Rollover / On Side", "Unknown"], required: true, half: true },
      { id: "urgency", label: "Urgency", type: "select", options: ["ASAP — Roadside", "Within 4 Hours", "Today", "Scheduled"], required: true, half: true },
    ],
  },
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().min(10, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(120),
});

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const ServiceQuoteForm = ({ slug }: { slug: string }) => {
  const variant = QUOTE_VARIANTS[slug];
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });

  if (!variant) return null;
  const isEmergency = slug === "catastrophic-recovery";

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = variant.fields.find((f) => f.required && !job[f.id]?.trim());
    if (missing) {
      toast({ title: "Missing detail", description: `Please complete: ${missing.label}`, variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      toast({ title: "Request received!", description: variant.callbackPromise ?? "A dispatcher will call you shortly." });
    }, 700);
  };

  const renderField = (f: Field) => {
    const common = "h-12 font-medium";
    if (f.type === "textarea") {
      return (
        <Textarea
          id={f.id}
          value={job[f.id] ?? ""}
          onChange={(e) => setJob({ ...job, [f.id]: e.target.value })}
          placeholder={f.placeholder}
          rows={3}
          maxLength={500}
        />
      );
    }
    if (f.type === "select") {
      return (
        <select
          id={f.id}
          value={job[f.id] ?? ""}
          onChange={(e) => setJob({ ...job, [f.id]: e.target.value })}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required={f.required}
        >
          <option value="">Select…</option>
          {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    return (
      <Input
        id={f.id}
        type={f.type}
        value={job[f.id] ?? ""}
        onChange={(e) => setJob({ ...job, [f.id]: e.target.value })}
        placeholder={f.placeholder}
        required={f.required}
        className={common}
        autoComplete="off"
        maxLength={120}
      />
    );
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border-t-4 border-primary shadow-card overflow-hidden">
      <div className={`${isEmergency ? "bg-red-900" : "bg-secondary"} text-secondary-foreground px-5 sm:px-6 py-4`}>
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          <span className="flex items-center gap-1.5">
            {isEmergency ? <AlertTriangle className="h-3.5 w-3.5" /> : <Gift className="h-3.5 w-3.5" />} {variant.badge}
          </span>
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            {isEmergency ? "On-Call Now" : "Dispatchers Online"}
          </span>
        </div>
        <h2 className="mt-1.5 stencil text-2xl sm:text-3xl font-bold uppercase leading-tight">
          {step === 1 && <>{variant.title} <span className="text-primary">{variant.titleAccent}</span></>}
          {step === 2 && <>Almost Done — <span className="text-primary">Your Contact</span></>}
          {step === 3 && <>Dispatched — <span className="text-primary">Standby</span></>}
        </h2>
        <div className="mt-3 flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${step >= n ? "bg-primary" : "bg-white/15"}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={next} className="p-5 sm:p-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {variant.fields.map((f) => (
              <div key={f.id} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                <Label htmlFor={f.id} className="text-[11px] font-bold uppercase tracking-wider">
                  {f.label}{f.required && " *"}
                </Label>
                {renderField(f)}
              </div>
            ))}
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full mt-2">
            Continue <ArrowRight />
          </Button>
          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-primary" /> No spam</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> 60 seconds</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-primary" /> Free</span>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="p-5 sm:p-6 space-y-3">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-2 border-primary/40 rounded-lg p-4 text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-1">A Dispatcher Will Call You</div>
            <div className="stencil text-xl text-foreground leading-tight">{variant.callbackPromise}</div>
          </div>
          <div>
            <Label htmlFor="cname" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><User className="h-3 w-3 text-primary" /> Your Name *</Label>
            <Input id="cname" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="John Smith" required className="h-12" autoFocus maxLength={80} />
          </div>
          <div>
            <Label htmlFor="cphone" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Phone className="h-3 w-3 text-primary" /> Phone *</Label>
            <Input id="cphone" type="tel" inputMode="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: formatPhone(e.target.value) })} placeholder="(555) 123-4567" required className="h-12" />
          </div>
          <div>
            <Label htmlFor="cemail" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Mail className="h-3 w-3 text-primary" /> Email *</Label>
            <Input id="cemail" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@company.com" required className="h-12" maxLength={120} />
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            {loading ? "Sending..." : variant.cta}
          </Button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition">
            ← Edit details
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="p-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h3 className="stencil text-2xl text-foreground">Thanks, {contact.name.split(" ")[0]}!</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {variant.callbackPromise} Expect a call at <strong className="text-foreground">{contact.phone}</strong>.
          </p>
          <Button onClick={() => { setStep(1); setJob({}); setContact({ name: "", phone: "", email: "" }); }} variant="outline" size="lg" className="mt-5">
            Submit Another
          </Button>
        </div>
      )}

      <div className="border-t border-border bg-muted/30 px-5 py-3 grid grid-cols-3 gap-2 text-center">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-primary" /> Fully Insured
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="h-3 w-3 text-primary" /> 24/7 Dispatch
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-primary" /> $1M Cargo
        </div>
      </div>
    </div>
  );
};

export default ServiceQuoteForm;
