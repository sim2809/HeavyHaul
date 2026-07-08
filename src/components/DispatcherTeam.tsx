import { Phone } from "lucide-react";
import { PHONE } from "./StickyCall";
import mikeImg from "@/assets/dispatcher-mike.jpg";
import sarahImg from "@/assets/dispatcher-sarah.jpg";
import carlosImg from "@/assets/dispatcher-carlos.jpg";
import dannyImg from "@/assets/dispatcher-danny.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const imgs = [mikeImg, sarahImg, carlosImg, dannyImg];
const defaults = [
  { name: "Mike", role: "Senior Dispatcher", years: "12", online: "true" },
  { name: "Sarah", role: "Permits & Routing", years: "9", online: "true" },
  { name: "Carlos", role: "Oversize Specialist", years: "15", online: "true" },
  { name: "Danny", role: "Heavy Haul Lead", years: "11", online: "false" },
];

const DispatcherTeam = () => {
  const { get } = useSiteContent();
  const team = defaults.map((d, i) => ({
    name: get("dispatchers", `m${i + 1}_name`, d.name),
    role: get("dispatchers", `m${i + 1}_role`, d.role),
    years: get("dispatchers", `m${i + 1}_years`, d.years),
    online: get("dispatchers", `m${i + 1}_online`, d.online) === "true",
    img: imgs[i],
  }));

  return (
    <section className="py-16 sm:py-24 bg-secondary text-white overflow-hidden">
      <div className="container-tight">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <p className="text-primary font-bold uppercase tracking-[0.25em] text-xs">
              {get("dispatchers","eyebrow","Human-Led Logistics")}
            </p>
            <h2 className="stencil text-5xl sm:text-6xl font-bold uppercase leading-[0.9]">
              {get("dispatchers","title_1","Meet Your")}{" "}
              <span className="text-primary">{get("dispatchers","title_2","Dispatch Team")}</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              {get("dispatchers","subtitle","No call centers. No bots. Speak directly with the specialized dispatcher handling your load — from quote to confirmation.")}
            </p>
            <a
              href={`tel:${PHONE}`}
              className="group inline-flex items-center gap-3 bg-primary text-secondary px-8 py-4 font-bold uppercase tracking-wider shadow-cta hover:brightness-110 transition rounded-sm"
            >
              <Phone className="h-5 w-5" /> {get("dispatchers","cta_label","Talk To A Dispatcher Now")}
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {team.map((m, i) => {
              const offset = i % 2 === 1 ? "sm:mt-10" : "";
              const muted = !m.online;
              return (
                <div
                  key={i}
                  className={`bg-card text-foreground border border-border p-6 rounded-sm group hover:border-primary transition-colors ${offset}`}
                >
                  <div className="flex items-center gap-5 mb-5">
                    <div className={`h-20 w-20 rounded-full overflow-hidden border-2 shrink-0 transition-all ${muted ? "border-border opacity-60" : "border-primary"}`}>
                      <img
                        src={m.img}
                        alt={`${m.name}, ${m.role} at Heavy Haul Group`}
                        loading="lazy"
                        width={256}
                        height={256}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`stencil text-3xl leading-none ${muted ? "text-muted-foreground" : "text-foreground"}`}>
                        {m.name}
                      </p>
                      <p className="text-[11px] text-primary font-black uppercase tracking-widest mt-1">
                        {m.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      {m.years} Yrs Exp
                    </span>
                    {m.online ? (
                      <span className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        Back in 1 Hr
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DispatcherTeam;
