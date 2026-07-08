import { ShieldCheck, Award, Truck, FileCheck } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const TrustStrip = ({ dark = false }: { dark?: boolean }) => {
  const { get } = useSiteContent();
  const items = [
    { icon: ShieldCheck, top: get("trust","t1_top","$1,000,000"), bot: get("trust","t1_bot","Cargo Insurance") },
    { icon: Truck,       top: get("trust","t2_top","MC# 123456"), bot: get("trust","t2_bot","FMCSA Authorized") },
    { icon: FileCheck,   top: get("trust","t3_top","USDOT 987654"), bot: get("trust","t3_bot","DOT Compliant") },
    { icon: Award,       top: get("trust","t4_top","A+ Rating"),   bot: get("trust","t4_bot","BBB Accredited") },
  ];
  return (
    <div className={`${dark ? "bg-black/40 border-white/10 text-white" : "bg-muted/40 border-border text-foreground"} border-y`}>
      <div className={`container-tight grid grid-cols-2 lg:grid-cols-4 divide-x ${dark ? "divide-white/10" : "divide-border"}`}>
        {items.map(({ icon: Icon, top, bot }) => (
          <div key={top} className="flex items-center gap-2.5 px-3 py-3 sm:py-4">
            <span className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${dark ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary"}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="leading-tight min-w-0">
              <div className="font-sans font-extrabold text-[13px] truncate">{top}</div>
              <div className={`text-[10px] uppercase tracking-wider font-bold ${dark ? "text-white/55" : "text-muted-foreground"} truncate`}>{bot}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustStrip;
