import { ReactNode } from "react";

type Brand = {
  name: string;
  render: () => ReactNode;
};

const BRANDS: Brand[] = [
  {
    name: "Caterpillar",
    render: () => (
      <div className="flex items-end text-3xl font-black italic tracking-tighter text-[#FFB800] group-hover:drop-shadow-[0_0_15px_rgba(255,184,0,0.6)] transition">
        CAT<span className="ml-1 mb-1 h-3 w-3 bg-[#FFB800]" />
      </div>
    ),
  },
  {
    name: "John Deere",
    render: () => (
      <div className="flex flex-col items-center text-[#367C2B] group-hover:drop-shadow-[0_0_15px_rgba(54,124,43,0.6)] transition">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">John Deere</span>
        <div className="mt-1 flex h-7 w-10 items-center justify-center rounded-sm border-2 border-[#FFDE00]">
          <div className="h-2 w-4 rounded-full bg-[#367C2B]" />
        </div>
      </div>
    ),
  },
  {
    name: "Komatsu",
    render: () => (
      <div className="text-2xl font-black uppercase tracking-tight text-[#004098] group-hover:drop-shadow-[0_0_15px_rgba(0,64,152,0.7)] transition">
        Komatsu
      </div>
    ),
  },
  {
    name: "Volvo",
    render: () => (
      <div className="flex items-center rounded-full border-2 border-zinc-400 px-4 py-1 group-hover:border-[#00508F] transition">
        <span className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-200 group-hover:text-[#5AA3D8] transition">Volvo</span>
      </div>
    ),
  },
  {
    name: "Kenworth",
    render: () => (
      <div className="flex flex-col items-center">
        <div className="flex h-6 w-24 items-center justify-center rounded-sm bg-[#C41230] text-[10px] font-black tracking-wider text-white">KENWORTH</div>
        <div className="mt-[2px] h-[2px] w-24 bg-[#C41230]" />
      </div>
    ),
  },
  {
    name: "Peterbilt",
    render: () => (
      <div className="text-xl font-black italic uppercase text-[#E31837] group-hover:drop-shadow-[0_0_15px_rgba(227,24,55,0.6)] transition">
        Peterbilt
      </div>
    ),
  },
  {
    name: "Freightliner",
    render: () => (
      <div className="text-lg font-black uppercase tracking-tight text-[#004A99] group-hover:drop-shadow-[0_0_15px_rgba(0,74,153,0.7)] transition">
        Freightliner
      </div>
    ),
  },
  {
    name: "Mack",
    render: () => (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black uppercase text-[#FFD100] group-hover:drop-shadow-[0_0_15px_rgba(255,209,0,0.6)] transition">Mack</span>
      </div>
    ),
  },
  {
    name: "Hitachi",
    render: () => (
      <div className="text-2xl font-black uppercase tracking-wider text-[#D9272E] group-hover:drop-shadow-[0_0_15px_rgba(217,39,46,0.6)] transition">
        Hitachi
      </div>
    ),
  },
  {
    name: "Kubota",
    render: () => (
      <div className="text-2xl font-black uppercase tracking-tight text-[#F47920] group-hover:drop-shadow-[0_0_15px_rgba(244,121,32,0.6)] transition">
        Kubota
      </div>
    ),
  },
  {
    name: "Case",
    render: () => (
      <div className="rounded-sm bg-[#D71920] px-3 py-1 text-xl font-black uppercase tracking-wider text-white">
        Case
      </div>
    ),
  },
  {
    name: "New Holland",
    render: () => (
      <div className="text-lg font-black uppercase tracking-tight text-[#00427A] group-hover:drop-shadow-[0_0_15px_rgba(0,66,122,0.7)] transition">
        New Holland
      </div>
    ),
  },
  {
    name: "Bobcat",
    render: () => (
      <div className="flex flex-col items-center">
        <div className="mb-1 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-zinc-200">
          <div className="h-4 w-4 translate-y-1 rotate-45 bg-black" />
        </div>
        <div className="text-base font-black uppercase tracking-tighter text-white group-hover:text-[#FF6600] transition">Bobcat</div>
      </div>
    ),
  },
  {
    name: "JCB",
    render: () => (
      <div className="-skew-x-12 bg-[#FFD100] px-4 py-1">
        <span className="inline-block skew-x-12 text-2xl font-black text-black">JCB</span>
      </div>
    ),
  },
  {
    name: "Doosan",
    render: () => (
      <div className="text-2xl font-black uppercase tracking-tight text-[#1B4B9A] group-hover:drop-shadow-[0_0_15px_rgba(27,75,154,0.7)] transition">
        Doosan
      </div>
    ),
  },
  {
    name: "Liebherr",
    render: () => (
      <div className="flex flex-col items-center text-[#21409A] group-hover:drop-shadow-[0_0_15px_rgba(33,64,154,0.7)] transition">
        <span className="text-lg font-black uppercase tracking-widest">Liebherr</span>
        <div className="mt-[2px] h-[3px] w-full bg-[#FFB800]" />
      </div>
    ),
  },
];

const Tile = ({ brand }: { brand: Brand }) => (
  <div className="brand-tile group flex h-24 w-48 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-primary/60 hover:bg-primary/[0.05]">
    {brand.render()}
  </div>
);

const BrandMarquee = () => {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section className="bg-secondary text-secondary-foreground border-y border-white/10 py-20 overflow-hidden">
      <div className="container-tight mb-12 text-center">
        <p className="mb-3 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          <span className="h-px w-8 bg-primary/30" />
          Trusted Brand Specialists
          <span className="h-px w-8 bg-primary/30" />
        </p>
        <h2 className="stencil text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
          We Haul Every Major Brand
        </h2>
      </div>

      <div className="relative" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        <div className="flex w-max items-center gap-6 marquee-track py-4">
          {row.map((b, i) => (
            <Tile key={`${b.name}-${i}`} brand={b} />
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-1">
        <div className="h-1 w-12 bg-primary" />
        <div className="h-1 w-4 bg-white/10" />
        <div className="h-1 w-4 bg-white/10" />
      </div>
    </section>
  );
};

export default BrandMarquee;
