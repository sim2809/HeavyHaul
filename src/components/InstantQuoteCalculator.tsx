import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { submitLead } from "@/lib/submitLead";
import {
  Truck, ArrowRight, ShieldCheck, Clock, CheckCircle2, Loader2,
  MapPin, Phone, Mail, User, Send, Gift,
} from "lucide-react";

const EQUIPMENT = [
  "Skid Steer / Bobcat",
  "Excavator (small/mid)",
  "Bulldozer / Loader",
  "Farm Tractor / Combine",
  "Crane / Boom Lift",
  "Semi / Dump / Vocational",
  "Industrial Machinery / CNC",
  "Other Heavy Equipment",
];

// Accept either a full "CITY, ST DDDDD" (auto-filled from ZIP lookup) or a bare 5-digit ZIP.
const CITY_RE = /^[A-Za-zÀ-ÿ' .\-]+,\s?[A-Z]{2}\s\d{5}$/;
const ZIP_RE = /^\d{5}$/;
const step1Schema = z.object({
  pickup: z.string().trim().refine((v) => CITY_RE.test(v) || ZIP_RE.test(v), "Enter a valid pickup ZIP code"),
  delivery: z.string().trim().refine((v) => CITY_RE.test(v) || ZIP_RE.test(v), "Enter a valid delivery ZIP code"),
  equipment: z.string().trim().min(2, "Pick or type equipment type"),
  model: z.string().trim().max(80).optional(),
});

const step2Schema = z.object({
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

type Suggestion = { label: string; zip: string; city: string; state: string };

// ZIP autocomplete using free Zippopotam API
const useZipSuggestions = (value: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 5) { setSuggestions([]); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`https://api.zippopotam.us/us/${digits}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled || !data?.places) { setSuggestions([]); return; }
        const list: Suggestion[] = data.places.map((p: any) => ({
          city: p["place name"],
          state: p["state abbreviation"],
          zip: digits,
          label: `${(p["place name"] as string).toUpperCase()}, ${p["state abbreviation"]} ${digits}`,
        }));
        setSuggestions(list);
      })
      .catch(() => setSuggestions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [value]);
  return { suggestions, loading };
};

const LocationInput = ({
  id, label, value, onChange, placeholder, autoFocus,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  placeholder: string; autoFocus?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { suggestions, loading } = useZipSuggestions(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Auto-fill the city as soon as a ZIP resolves to a place. User just types 5 digits
  // and the field becomes "CITY, ST 12345" automatically.
  useEffect(() => {
    if (/^\d{5}$/.test(value.trim()) && suggestions.length > 0) {
      onChange(suggestions[0].label);
      setOpen(false);
    }
  }, [suggestions, value, onChange]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <Label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
        <MapPin className="h-3 w-3 text-primary" /> {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="h-12 font-semibold tracking-wide"
      />
      {open && (suggestions.length > 0 || loading) && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-card border border-primary/40 rounded-md shadow-lg overflow-hidden">
          {loading && (
            <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" /> Searching ZIPs…
            </div>
          )}
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={i}
              onClick={() => { onChange(s.label); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 border-b border-border last:border-0 flex items-center gap-2"
            >
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-bold">{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InstantQuoteCalculator = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    pickup: "", delivery: "", equipment: "", model: "",
    name: "", phone: "", email: "",
  });

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = step1Schema.safeParse(data);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = step2Schema.safeParse(data);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await submitLead({
        name: data.name, email: data.email, phone: data.phone,
        origin: data.pickup, destination: data.delivery,
        equipment: data.equipment, message: data.model ? `Model: ${data.model}` : "",
        source: "instant_quote",
      });
      setStep(3);
      toast({ title: "Request received!", description: "A dispatcher will call you within 10 minutes with your best rate." });
    } catch (err: any) {
      toast({ title: "Could not send", description: err.message || "Please try again or call us.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg border-t-4 border-primary shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          <span className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" /> Free Quote · Best Rate Guaranteed</span>
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Dispatchers Online
          </span>
        </div>
        <h2 className="mt-1.5 stencil text-2xl sm:text-3xl font-bold uppercase leading-tight">
          {step === 1 && <>Get Your <span className="text-primary">Best Rate</span></>}
          {step === 2 && <>Almost Done — <span className="text-primary">Your Info</span></>}
          {step === 3 && <>You're <span className="text-primary">All Set!</span></>}
        </h2>
        <div className="mt-3 flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${step >= n ? "bg-primary" : "bg-white/15"}`} />
          ))}
        </div>
      </div>

      {/* STEP 1: Route + equipment */}
      {step === 1 && (
        <form onSubmit={next} className="p-5 sm:p-6 space-y-3">
          <LocationInput
            id="pickup"
            label="Pickup Location *"
            value={data.pickup}
            onChange={(v) => setData({ ...data, pickup: v })}
            placeholder="Enter ZIP — e.g. 75201"
            autoFocus
          />
          <LocationInput
            id="delivery"
            label="Delivery Location *"
            value={data.delivery}
            onChange={(v) => setData({ ...data, delivery: v })}
            placeholder="Enter ZIP — e.g. 80202"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <Label htmlFor="equipment" className="text-[11px] font-bold uppercase tracking-wider">Equipment Type *</Label>
              <Input
                id="equipment"
                list="equipment-types"
                value={data.equipment}
                onChange={(e) => setData({ ...data, equipment: e.target.value })}
                placeholder="Type or pick…"
                required
                className="h-12"
                autoComplete="off"
              />
              <datalist id="equipment-types">
                {EQUIPMENT.map((eq) => <option key={eq} value={eq} />)}
              </datalist>
            </div>
            <div>
              <Label htmlFor="model" className="text-[11px] font-bold uppercase tracking-wider">
                Model <span className="text-muted-foreground font-normal normal-case">(optional)</span>
              </Label>
              <Input
                id="model"
                value={data.model}
                onChange={(e) => setData({ ...data, model: e.target.value })}
                placeholder="e.g. CAT 320, D6"
                className="h-12"
                autoComplete="off"
              />
            </div>
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

      {/* STEP 2: Lead capture */}
      {step === 2 && (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Route summary */}
          <div className="bg-muted/40 border border-border rounded-md p-3 text-xs space-y-1">
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> <span className="font-bold">{data.pickup}</span> → <span className="font-bold">{data.delivery}</span></div>
            <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" /> <span className="font-bold">{data.equipment}{data.model ? ` · ${data.model}` : ""}</span></div>
          </div>

          {/* Value prop */}
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-2 border-primary/40 rounded-lg p-4 text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-1">A Dispatcher Will Call You</div>
            <div className="stencil text-2xl text-foreground leading-tight">
              Best Rate, <span className="text-primary">Guaranteed</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">We'll beat any written quote — call back within <strong className="text-foreground">10 minutes</strong>.</p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="lname" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><User className="h-3 w-3 text-primary" /> Your Name *</Label>
              <Input id="lname" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="John Smith" required className="h-12" autoFocus />
            </div>
            <div>
              <Label htmlFor="lphone" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Phone className="h-3 w-3 text-primary" /> Phone *</Label>
              <Input
                id="lphone"
                type="tel"
                inputMode="tel"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: formatPhone(e.target.value) })}
                placeholder="(555) 123-4567"
                required
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="lemail" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Mail className="h-3 w-3 text-primary" /> Email *</Label>
              <Input
                id="lemail"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="you@company.com"
                required
                className="h-12"
              />
            </div>
            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              {loading ? "Sending..." : "Get My Best Rate"}
            </Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition">
              ← Edit details
            </button>
            <p className="text-center text-[10px] text-muted-foreground">
              🔒 We never share your info. Used only to send your quote.
            </p>
          </form>
        </div>
      )}

      {/* STEP 3: Confirmation */}
      {step === 3 && (
        <div className="p-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h3 className="stencil text-2xl text-foreground">Thanks, {data.name.split(" ")[0]}!</h3>
          <p className="text-sm text-muted-foreground mt-2">
            A dispatcher is preparing your best rate for <strong className="text-foreground">{data.equipment}{data.model ? ` · ${data.model}` : ""}</strong> from <strong className="text-foreground">{data.pickup}</strong> → <strong className="text-foreground">{data.delivery}</strong>.
          </p>
          <p className="text-sm mt-2">
            Expect a call at <strong className="text-foreground">{data.phone}</strong> within <strong className="text-primary">10 minutes</strong>.
          </p>
          <Button onClick={() => { setStep(1); setData({ pickup: "", delivery: "", equipment: "", model: "", name: "", phone: "", email: "" }); }} variant="outline" size="lg" className="mt-5">
            Submit Another
          </Button>
        </div>
      )}

      {/* Trust footer */}
      <div className="border-t border-border bg-muted/30 px-5 py-3 grid grid-cols-3 gap-2 text-center">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-primary" /> Fully Insured
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <Truck className="h-3 w-3 text-primary" /> MC# 123456
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-primary" /> $1M Cargo
        </div>
      </div>
    </div>
  );
};

export default InstantQuoteCalculator;
