import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2, ShieldCheck, Clock, PhoneCall } from "lucide-react";

const BRANDS = [
  "Caterpillar", "John Deere", "Komatsu", "Volvo", "Kenworth", "Peterbilt",
  "Freightliner", "Mack", "Hitachi", "Kubota", "Case", "New Holland",
  "Bobcat", "JCB", "Doosan", "Liebherr",
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  pickup: z.string().trim().min(2, "Required").max(120),
  delivery: z.string().trim().min(2, "Required").max(120),
  brand: z.string().trim().max(80).optional(),
  model: z.string().trim().max(120).optional(),
});

interface QuoteFormProps {
  variant?: "card" | "bare";
}

const BrandDatalist = () => (
  <datalist id="equipment-brands">
    {BRANDS.map((b) => <option key={b} value={b} />)}
  </datalist>
);

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const QuoteForm = ({ variant = "card" }: QuoteFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", phone: "", pickup: "", delivery: "", brand: "", model: "" });

  const onChange = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = k === "phone" ? formatPhone(e.target.value) : e.target.value;
    setData({ ...data, [k]: v });
  };


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast({ title: "Quote request received", description: "A dispatcher will call you within 10 minutes." });
    setData({ name: "", phone: "", pickup: "", delivery: "", brand: "", model: "" });
  };

  if (variant === "bare") {
    return (
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <BrandDatalist />
        <Input value={data.name} onChange={onChange("name")} placeholder="Full Name" required className="sm:col-span-2 h-12" />
        <Input type="tel" value={data.phone} onChange={onChange("phone")} placeholder="Phone Number" required className="sm:col-span-2 h-12" />
        <Input value={data.pickup} onChange={onChange("pickup")} placeholder="Pickup City, State" required className="h-12" />
        <Input value={data.delivery} onChange={onChange("delivery")} placeholder="Delivery City, State" required className="h-12" />
        <Input list="equipment-brands" value={data.brand} onChange={onChange("brand")} placeholder="Equipment Brand (optional)" className="h-12" />
        <Input value={data.model} onChange={onChange("model")} placeholder="Model (optional, e.g. 320, D6)" className="h-12" />
        <Button type="submit" variant="hero" size="xl" className="sm:col-span-2 w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : null} Get My Free Quote In 60 Seconds
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-md border-t-4 border-primary shadow-card overflow-hidden">
      <BrandDatalist />
      <div className="bg-secondary text-secondary-foreground px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Clock className="h-3.5 w-3.5" /> Free · No Obligation · 10-Min Response
        </div>
        <h2 className="mt-1 stencil text-2xl sm:text-3xl font-bold uppercase">Request A Shipping Quote</h2>
      </div>

      <form onSubmit={submit} className="p-6 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Full Name *</Label>
            <Input id="name" value={data.name} onChange={onChange("name")} placeholder="John Smith" required className="h-11" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">Phone *</Label>
            <Input id="phone" type="tel" value={data.phone} onChange={onChange("phone")} placeholder="(555) 123-4567" required className="h-11" />
          </div>
          <div>
            <Label htmlFor="pickup" className="text-xs font-bold uppercase tracking-wider">Pickup *</Label>
            <Input id="pickup" value={data.pickup} onChange={onChange("pickup")} placeholder="Dallas, TX" required className="h-11" />
          </div>
          <div>
            <Label htmlFor="delivery" className="text-xs font-bold uppercase tracking-wider">Delivery *</Label>
            <Input id="delivery" value={data.delivery} onChange={onChange("delivery")} placeholder="Denver, CO" required className="h-11" />
          </div>
          <div>
            <Label htmlFor="brand" className="text-xs font-bold uppercase tracking-wider">Equipment Brand <span className="text-muted-foreground font-normal normal-case">(optional)</span></Label>
            <Input id="brand" list="equipment-brands" value={data.brand} onChange={onChange("brand")} placeholder="Type or pick (Caterpillar, John Deere…)" className="h-11" />
          </div>
          <div>
            <Label htmlFor="model" className="text-xs font-bold uppercase tracking-wider">Model <span className="text-muted-foreground font-normal normal-case">(optional)</span></Label>
            <Input id="model" value={data.model} onChange={onChange("model")} placeholder="320, D6, 9R…" className="h-11" />
          </div>
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full mt-5" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <PhoneCall />} Get My Free Quote In 60 Seconds
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Your information is secure. We never share data.
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
