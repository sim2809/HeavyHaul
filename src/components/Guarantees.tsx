import { ShieldCheck, Clock, DollarSign, Award } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Guarantees = () => {
  const { get } = useSiteContent();
  const items = [
    { icon: Clock,        title: get("guarantees","g1_title","On-Time Pickup"),        sub: get("guarantees","g1_sub","Guaranteed Schedule") },
    { icon: DollarSign,   title: get("guarantees","g2_title","Price-Match Promise"),   sub: get("guarantees","g2_sub","Beat Any Valid Quote") },
    { icon: ShieldCheck,  title: get("guarantees","g3_title","$1M Cargo Insurance"),   sub: get("guarantees","g3_sub","Full Load Coverage") },
    { icon: Award,        title: get("guarantees","g4_title","Vetted Carriers Only"),  sub: get("guarantees","g4_sub","Elite Network") },
  ];
  return (
    <section className="py-6 sm:py-8 bg-background">
      <div className="container-tight">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-8 bg-border" />
          <h2 className="stencil text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-center">
            {get("guarantees","heading_1","Heavy Haul Group")}{" "}
            <span className="text-primary">{get("guarantees","heading_2","Guarantee")}</span>
          </h2>
          <span className="h-px w-8 bg-border" />
        </div>
        <div className="border-y border-border bg-muted/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border">
            {items.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-3">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-secondary" strokeWidth={2.5} />
                </div>
                <div className="leading-tight min-w-0">
                  <div className="font-extrabold text-[13px] text-foreground truncate">{title}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guarantees;
