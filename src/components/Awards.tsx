import { Award, Trophy, Star, BadgeCheck } from "lucide-react";

const features = [
  {
    name: "Forbes",
    quote: "A standout in the nationwide heavy haul space.",
    year: "2025",
    className: "font-serif italic text-4xl tracking-tight",
    style: { fontFamily: "Georgia, 'Times New Roman', serif" },
  },
  {
    name: "Inc.",
    quote: "Top 500 fastest-growing logistics companies in America.",
    year: "2024",
    className: "font-black text-4xl tracking-tighter",
    style: { fontFamily: "Georgia, serif", letterSpacing: "-0.04em" },
  },
  {
    name: "Bloomberg",
    quote: "Setting the bar for oversize freight reliability.",
    year: "2025",
    className: "font-sans font-extrabold text-3xl uppercase tracking-tight",
    style: { fontFamily: "Helvetica, Arial, sans-serif" },
  },
  {
    name: "FORTUNE",
    quote: "Industry leader in equipment transport innovation.",
    year: "2024",
    className: "font-serif font-bold text-3xl uppercase tracking-[0.18em]",
    style: { fontFamily: "Georgia, serif" },
  },
  {
    name: "FreightWaves",
    quote: "Top-rated heavy haul carrier network of the year.",
    year: "2025",
    className: "font-sans font-extrabold text-2xl uppercase",
    style: { fontFamily: "Arial, sans-serif", letterSpacing: "-0.02em" },
  },
  {
    name: "Transport Topics",
    quote: "Recognized for safety excellence two years running.",
    year: "2024",
    className: "font-serif font-bold text-2xl",
    style: { fontFamily: "Georgia, serif" },
  },
];

const badges = [
  { icon: Trophy, label: "Top 500 Inc. 2024" },
  { icon: Award, label: "Forbes Featured 2025" },
  { icon: Star, label: "FreightWaves Carrier Of The Year" },
  { icon: BadgeCheck, label: "BBB Accredited A+" },
];

const Awards = () => {
  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary/40" /> Recognized Industry Leader <span className="h-px w-8 bg-primary/40" />
          </p>
          <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
            As Featured In <span className="text-primary">Top Journals</span>
          </h2>
          <p className="text-muted-foreground mt-3">
            Heavy Haul Group has been recognized by the country's leading business publications.
          </p>
        </div>

        {/* Publication logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {features.map((f) => (
            <article
              key={f.name}
              className="group bg-card border border-border rounded-md p-6 sm:p-7 shadow-card hover:shadow-glow hover:border-primary/60 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className={`text-secondary ${f.className}`} style={f.style}>
                  {f.name}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 px-2 py-1 rounded-sm">
                  {f.year}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">
                "{f.quote}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-secondary">
                <Award className="h-4 w-4 text-primary" /> Featured Coverage
              </div>
            </article>
          ))}
        </div>

        {/* Badges row */}
        <div className="bg-secondary text-white rounded-md p-6 sm:p-8 border-t-4 border-primary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-md bg-primary/15 border border-primary/40 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
