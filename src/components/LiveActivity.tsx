import { useEffect, useState } from "react";
import { CheckCircle2, X, Truck } from "lucide-react";

const events = [
  { name: "Mike R.", city: "Dallas, TX", action: "requested a quote", ago: "2 min ago" },
  { name: "Sarah L.", city: "Phoenix, AZ", action: "booked a CAT 320 haul", ago: "6 min ago" },
  { name: "Carlos M.", city: "Houston, TX", action: "requested a quote", ago: "9 min ago" },
  { name: "Jenna K.", city: "Denver, CO", action: "scheduled a bulldozer move", ago: "14 min ago" },
  { name: "Tom B.", city: "Atlanta, GA", action: "requested a quote", ago: "21 min ago" },
  { name: "Rachel D.", city: "Chicago, IL", action: "booked a combine transport", ago: "28 min ago" },
  { name: "Greg P.", city: "Memphis, TN", action: "requested a quote", ago: "34 min ago" },
  { name: "Amir N.", city: "Las Vegas, NV", action: "booked a wheel loader haul", ago: "42 min ago" },
];

const LiveActivity = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    const first = setTimeout(() => setShow(true), 4000);
    const cycle = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % events.length);
        setShow(true);
      }, 500);
    }, 9000);
    return () => { clearTimeout(first); clearInterval(cycle); };
  }, [closed]);

  if (closed) return null;
  const e = events[idx];

  return (
    <div
      className={`fixed bottom-4 left-4 z-[90] max-w-[320px] transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-card text-card-foreground border border-border shadow-card rounded-lg p-3 pr-9 flex items-start gap-3 relative">
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Truck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight">
            {e.name} from {e.city}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            <CheckCircle2 className="inline h-3 w-3 text-primary mr-1 -mt-0.5" />
            {e.action}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mt-1">
            {e.ago}
          </div>
        </div>
        <button
          onClick={() => setClosed(true)}
          aria-label="Dismiss"
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default LiveActivity;
