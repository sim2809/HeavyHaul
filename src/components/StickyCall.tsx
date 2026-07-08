import { Phone, MessageSquare, Menu } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Fallback constants — used by pages that haven't been migrated to useSiteSettings yet.
const PHONE = "+18005550199";
const DISPLAY = "(800) 555-0199";

export const StickyCallBar = () => {
  const s = useSiteSettings();
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 shadow-glow border-t-2 border-primary">
      <a
        href={`tel:${s.phone_primary}`}
        className="bg-gradient-amber text-secondary py-3.5 px-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
        aria-label="Call now"
      >
        <Phone className="h-5 w-5" />
        Call Now
      </a>
      <a
        href="/#quote"
        className="bg-secondary text-primary py-3.5 px-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm border-l border-primary/40"
        aria-label="Get a free quote"
      >
        <MessageSquare className="h-5 w-5" />
        Free Quote
      </a>
    </div>
  );
};

export const TopAlertStrip = () => (
  <div className="bg-secondary text-secondary-foreground text-xs sm:text-sm border-b border-white/5">
    <div className="container-tight flex items-center justify-center gap-2 py-2 text-center">
      <span className="inline-flex items-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1 text-primary font-bold uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> We Are Open
        </span>
        <span className="text-white/70">Serving All 50 States</span>
      </span>
    </div>
  </div>
);

export { PHONE, DISPLAY };
export const MenuIcon = Menu;
