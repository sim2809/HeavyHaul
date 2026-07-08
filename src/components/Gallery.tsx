import { useState } from "react";
import { Play, X, Camera, ArrowRight, ShieldCheck, MapPin, CheckCircle2, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import loadingVideo from "@/assets/video/heavy-haul-loading.mp4.asset.json";
import transportVideo from "@/assets/video/heavy-haul-transport.mp4.asset.json";
import bobcat from "@/assets/gallery/loaded-bobcat.jpg";
import bulldozer from "@/assets/gallery/loaded-bulldozer.jpg";
import combine from "@/assets/gallery/loaded-combine.jpg";
import excavator from "@/assets/gallery/loaded-excavator.jpg";
import forklift from "@/assets/gallery/loaded-forklift.jpg";
import cnc from "@/assets/gallery/loaded-cnc.jpg";
import loader from "@/assets/gallery/loaded-loader.jpg";
import tractor from "@/assets/gallery/loaded-tractor.jpg";

const videos = [
  { src: loadingVideo.url, poster: excavator, label: "CAT 320 Excavator Loading", lane: "Houston, TX → Atlanta, GA", duration: "0:42", driver: "Marcus T.", customer: "BuildRite Construction", date: "May 2026", weight: "48,500 lbs" },
  { src: transportVideo.url, poster: bulldozer, label: "Bulldozer Lowboy Transport", lane: "Phoenix, AZ → Denver, CO", duration: "1:08", driver: "Carlos R.", customer: "Sun Valley Mining", date: "Apr 2026", weight: "62,000 lbs" },
  { src: transportVideo.url, poster: combine, label: "Combine Harvester Move", lane: "Des Moines, IA → Lincoln, NE", duration: "0:55", driver: "Jake P.", customer: "Heartland Farms Co.", date: "Apr 2026", weight: "38,000 lbs" },
  { src: loadingVideo.url, poster: loader, label: "Wheel Loader Pickup", lane: "Dallas, TX → Memphis, TN", duration: "0:38", driver: "Derrick W.", customer: "TexCon Equipment", date: "Mar 2026", weight: "51,200 lbs" },
];

const photos = [
  { src: bulldozer, label: "CAT D6 Bulldozer", lane: "Phoenix, AZ → Denver, CO" },
  { src: excavator, label: "CAT 320 Excavator", lane: "Houston, TX → Atlanta, GA" },
  { src: combine, label: "John Deere Combine", lane: "Des Moines, IA → Lincoln, NE" },
  { src: bobcat, label: "Bobcat T595 Loader", lane: "Chicago, IL → Detroit, MI" },
  { src: loader, label: "CAT Wheel Loader", lane: "Dallas, TX → Memphis, TN" },
  { src: tractor, label: "New Holland Tractor", lane: "Omaha, NE → Kansas City, MO" },
  { src: forklift, label: "Toyota Forklift", lane: "Los Angeles, CA → Las Vegas, NV" },
  { src: cnc, label: "Industrial CNC Machine", lane: "Cleveland, OH → Pittsburgh, PA" },
];

const Gallery = () => {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const current = videos[active];

  const selectVideo = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 topo-bg opacity-30" aria-hidden />
      <div className="relative container-tight">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-2">
            <Camera className="h-3.5 w-3.5" /> Real Loads · Real Drivers · Verified Shipments
          </p>
          <h2 className="stencil text-4xl sm:text-5xl font-bold uppercase">
            Watch Our <span className="text-primary">Heavy Haul Crew</span> In Action
          </h2>
          <p className="text-white/70 mt-3">
            Every shipment GPS-tracked, fully insured, and documented from pickup to delivery.
          </p>
        </div>

        {/* FEATURED PLAYER + THUMBS */}
        <div className="grid lg:grid-cols-12 gap-5 mb-10">
          {/* Main player */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-lg border-2 border-primary/40 bg-black aspect-video shadow-cta">
              {playing ? (
                <video key={current.src + active} src={current.src} controls autoPlay className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <button onClick={() => setPlaying(true)} className="absolute inset-0 w-full h-full group" aria-label={`Play ${current.label}`}>
                  <img src={current.poster} alt={current.label} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-20 w-20 rounded-full bg-primary text-secondary flex items-center justify-center shadow-cta group-hover:scale-110 transition-transform">
                      <Play className="h-9 w-9 fill-current ml-1" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="bg-primary text-secondary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Verified Shipment
                    </span>
                    <span className="bg-black/70 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-primary" /> Insured
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 text-primary text-xs font-bold px-2.5 py-1 rounded">{current.duration}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-1">
                      <MapPin className="h-3 w-3" /> {current.lane}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl uppercase leading-tight">{current.label}</div>
                  </div>
                </button>
              )}
            </div>
            {/* Trust strip */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded px-3 py-2">
                <User className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate"><span className="text-white/50">Driver:</span> <span className="font-semibold">{current.driver}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate"><span className="text-white/50">Customer:</span> <span className="font-semibold">{current.customer}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded px-3 py-2">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate"><span className="text-white/50">Hauled:</span> <span className="font-semibold">{current.date}</span></span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate"><span className="text-white/50">Weight:</span> <span className="font-semibold">{current.weight}</span></span>
              </div>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="lg:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-2 flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/30" /> More Recent Hauls <span className="h-px flex-1 bg-primary/30" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {videos.map((v, i) => (
                <button
                  key={i}
                  onClick={() => selectVideo(i)}
                  className={`relative flex gap-3 rounded-md overflow-hidden border-2 transition-all text-left bg-black/40 ${
                    active === i ? "border-primary shadow-cta" : "border-white/10 hover:border-primary/50"
                  }`}
                >
                  <div className="relative w-28 sm:w-32 shrink-0 aspect-video">
                    <img src={v.poster} alt={v.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`h-7 w-7 rounded-full flex items-center justify-center ${active === i ? "bg-primary text-secondary" : "bg-white/90 text-secondary"}`}>
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      </span>
                    </span>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">{v.duration}</span>
                  </div>
                  <div className="flex-1 py-2 pr-2 min-w-0">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold truncate">{v.lane}</div>
                    <div className="font-sans font-bold text-sm leading-tight mt-0.5 line-clamp-2">{v.label}</div>
                    <div className="text-[10px] text-white/50 mt-1 truncate">{v.customer}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>





        {/* PHOTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden rounded-md border border-white/10 hover:border-primary transition-all aspect-square bg-black"
            >
              <img
                src={p.src}
                alt={`${p.label} loaded for heavy haul transport, ${p.lane}`}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <div className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">{p.lane}</div>
                <div className="font-display text-sm sm:text-base uppercase leading-tight mt-0.5">{p.label}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/services">
            <Button variant="hero" size="lg">Browse All Services <ArrowRight /></Button>
          </Link>
          <a href="#quote">
            <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-secondary">
              Get A Free Quote
            </Button>
          </a>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].label}
              className="w-full h-auto rounded-md border border-white/10"
            />
            <figcaption className="text-center text-white mt-4">
              <div className="text-primary text-xs uppercase tracking-[0.3em] font-bold">{photos[lightbox].lane}</div>
              <div className="font-display text-xl uppercase mt-1">{photos[lightbox].label}</div>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
};

export default Gallery;
