const outlets = [
  "FORBES",
  "BLOOMBERG",
  "INC.",
  "FREIGHTWAVES",
  "TRANSPORT TOPICS",
  "FOX BUSINESS",
];

const PressStrip = () => (
  <section className="bg-background border-y border-border py-8">
    <div className="container-tight">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-5">
        As Featured In
      </p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-4 items-center justify-items-center">
        {outlets.map((o) => (
          <div
            key={o}
            className="font-serif italic text-base sm:text-lg lg:text-xl tracking-tight text-muted-foreground/80 hover:text-foreground transition-colors"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {o}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PressStrip;
