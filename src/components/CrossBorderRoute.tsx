import { Truck, MapPin, Plane } from "lucide-react";

type Props = {
  from: { code: string; name: string; flag: string };
  to: { code: string; name: string; flag: string };
  crossings: string[];
  eyebrow?: string;
};

/** Abstract hub badge — not a country map. */
const CountryHub = ({ code }: { code: string }) => {
  return (
    <g>
      {/* outer ring */}
      <circle cx="50" cy="30" r="26" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {/* inner accent */}
      <circle cx="50" cy="30" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.7" />
      {/* corner ticks */}
      <path d="M28 16 L24 16 L24 20 M72 16 L76 16 L76 20 M28 44 L24 44 L24 40 M72 44 L76 44 L76 40"
        fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" strokeLinecap="round" />
      {/* code label */}
      <text x="50" y="34" textAnchor="middle" fill="hsl(var(--secondary-foreground))" fontSize="13" fontWeight="900" style={{ letterSpacing: "2px" }}>
        {code}
      </text>
    </g>
  );
};

const CrossBorderRoute = ({ from, to, crossings, eyebrow = "Live Cross-Border Lane" }: Props) => {
  return (
    <div className="relative rounded-md border-2 border-border bg-card overflow-hidden shadow-card">
      {/* header */}
      <div className="flex items-center justify-between gap-4 p-5 bg-secondary text-secondary-foreground">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
          <div className="font-display uppercase text-lg sm:text-xl mt-1">
            {from.name} <span className="text-primary">↔</span> {to.name}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-primary">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          Live Dispatch
        </div>
      </div>

      {/* animated map */}
      <div className="relative bg-gradient-to-b from-muted/30 to-muted/60 p-4 sm:p-6">
        <svg viewBox="0 0 900 360" className="w-full h-auto" role="img" aria-label={`${from.name} to ${to.name} route`}>
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <path
              id="cbr-route"
              d="M 170 230 C 330 40, 570 40, 730 230"
              fill="none"
            />
          </defs>

          {/* faint background grid */}
          <g opacity="0.18" stroke="hsl(var(--border))" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`h${i}`} x1="0" x2="900" y1={50 + i * 55} y2={50 + i * 55} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={`v${i}`} y1="0" y2="360" x1={100 + i * 100} x2={100 + i * 100} />
            ))}
          </g>

          {/* FROM hub */}
          <g transform="translate(70 195)" opacity="0.95">
            <CountryHub code={from.code} />
          </g>

          {/* TO hub */}
          <g transform="translate(730 195)" opacity="0.95">
            <CountryHub code={to.code} />
          </g>

          {/* route — base + animated dash */}
          <use href="#cbr-route" stroke="hsl(var(--border))" strokeWidth="6" strokeLinecap="round" />
          <use href="#cbr-route" stroke="url(#routeGrad)" strokeWidth="3.5"
            strokeDasharray="12 10" strokeLinecap="round" filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="44" to="0" dur="1.2s" repeatCount="indefinite" />
          </use>

          {/* border marker at apex */}
          <g>
            <line x1="450" y1="30" x2="450" y2="80" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="416" y="14" width="68" height="22" rx="4" fill="hsl(var(--primary))" />
            <text x="450" y="29" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="11" fontWeight="800"
              style={{ letterSpacing: "1.8px" }}>BORDER</text>
          </g>

          {/* outbound truck */}
          <g>
            <circle r="18" fill="hsl(var(--primary))" filter="url(#glow)">
              <animateMotion dur="5s" repeatCount="indefinite" rotate="0">
                <mpath href="#cbr-route" />
              </animateMotion>
            </circle>
            <g transform="translate(-10 -10)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#cbr-route" />
              </animateMotion>
            </g>
          </g>

          {/* return truck (opposite direction) */}
          <g>
            <circle r="18" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="2" filter="url(#glow)">
              <animateMotion dur="5s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#cbr-route" />
              </animateMotion>
            </circle>
            <g transform="translate(-10 -10)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <animateMotion dur="5s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#cbr-route" />
              </animateMotion>
            </g>
          </g>
        </svg>
      </div>


      {/* footer stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-background">
        <div className="p-4 text-center">
          <div className="stencil text-2xl text-primary leading-none">24/7</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">Bonded Dispatch</div>
        </div>
        <div className="p-4 text-center">
          <div className="stencil text-2xl text-primary leading-none">Live</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">GPS Tracking</div>
        </div>
        <div className="p-4 text-center">
          <div className="stencil text-2xl text-primary leading-none">1 PT</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">Of Contact</div>
        </div>
      </div>
    </div>
  );
};

export default CrossBorderRoute;
