import { Truck, MapPin, CheckCircle2 } from "lucide-react";

const SHIPMENTS = [
  { equipment: "CAT D6 Bulldozer", from: "Dallas, TX", to: "Atlanta, GA", ago: "12 min ago" },
  { equipment: "John Deere Combine", from: "Des Moines, IA", to: "Lincoln, NE", ago: "34 min ago" },
  { equipment: "Bobcat T595 Loader", from: "Chicago, IL", to: "Detroit, MI", ago: "1 hr ago" },
  { equipment: "Kenworth T800 Semi", from: "Phoenix, AZ", to: "Las Vegas, NV", ago: "2 hr ago" },
  { equipment: "CAT 320 Excavator", from: "Houston, TX", to: "New Orleans, LA", ago: "3 hr ago" },
  { equipment: "Komatsu PC290", from: "Denver, CO", to: "Salt Lake City, UT", ago: "4 hr ago" },
  { equipment: "Hitachi ZX350", from: "Seattle, WA", to: "Portland, OR", ago: "5 hr ago" },
  { equipment: "New Holland Tractor", from: "Omaha, NE", to: "Kansas City, MO", ago: "6 hr ago" },
  { equipment: "Volvo L90H Loader", from: "Cleveland, OH", to: "Pittsburgh, PA", ago: "7 hr ago" },
  { equipment: "Mack Dump Truck", from: "Tampa, FL", to: "Charlotte, NC", ago: "8 hr ago" },
];

const RecentShipmentsTicker = () => {
  // Duplicate for seamless loop
  const items = [...SHIPMENTS, ...SHIPMENTS];

  return (
    <div className="bg-secondary text-white border-y border-white/10 overflow-hidden">
      <div className="container-tight flex items-center gap-4 py-3">
        <div className="hidden sm:flex items-center gap-2 shrink-0 pr-4 border-r border-white/15">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary whitespace-nowrap">Live Shipments</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {items.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <Truck className="h-3.5 w-3.5 text-white/60 shrink-0" />
                <span className="font-bold text-white">{s.equipment}</span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1 text-white/70">
                  <MapPin className="h-3 w-3" />
                  {s.from} → {s.to}
                </span>
                <span className="text-white/40">·</span>
                <span className="text-primary uppercase tracking-wider text-[10px] font-bold">Delivered {s.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentShipmentsTicker;
