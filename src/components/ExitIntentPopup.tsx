import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Gift, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import { PHONE, DISPLAY } from "@/components/StickyCall";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "hhg_exit_intent_shown_v1";

const ExitIntentPopup = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    };

    // Desktop: detect mouse leaving top
    const onMouse = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    // Mobile: trigger after 35s on page if not converted
    const t = setTimeout(trigger, 35000);

    document.addEventListener("mouseleave", onMouse);
    return () => {
      document.removeEventListener("mouseleave", onMouse);
      clearTimeout(t);
    };
  }, []);

  if (!open) return null;

  const claim = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast({ title: "Enter a valid phone", variant: "destructive" });
      return;
    }
    toast({ title: "Discount locked!", description: "We'll call you within 10 minutes with your quote + $50 off." });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setOpen(false)}>
      <div
        className="relative bg-card text-card-foreground rounded-xl border-t-4 border-primary shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground flex items-center justify-center z-10 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-secondary text-secondary-foreground p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
            <Gift className="h-3 w-3" /> Wait! Don't Leave Yet
          </div>
          <h3 className="stencil text-3xl sm:text-4xl font-bold uppercase leading-tight">
            Get <span className="text-primary">$50 Off</span><br />Your First Haul
          </h3>
          <p className="mt-2 text-white/75 text-sm">
            Drop your number and we'll call back within 10 minutes with a quote + $50 instant discount.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={claim} className="space-y-3">
            <Input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
              className="h-12 text-center text-lg font-bold tracking-wider"
              autoFocus
            />
            <Button type="submit" variant="hero" size="xl" className="w-full">
              Claim My $50 Discount <ArrowRight />
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex-1 h-px bg-border" /> Or call now <span className="flex-1 h-px bg-border" />
          </div>

          <a href={`tel:${PHONE}`} className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3 rounded-md hover:bg-secondary/90 transition font-bold">
            <Phone className="h-4 w-4 text-primary" /> {DISPLAY}
          </a>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> No spam · One-time offer · Expires today
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
