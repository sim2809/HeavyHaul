import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { MapPin } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Activation order, geographically grouped for a "rolling coverage" effect
const SEQUENCE = [
  "California", "Oregon", "Washington", "Nevada", "Arizona", "Idaho", "Utah",
  "Montana", "Wyoming", "Colorado", "New Mexico",
  "North Dakota", "South Dakota", "Nebraska", "Kansas", "Oklahoma", "Texas",
  "Minnesota", "Iowa", "Missouri", "Arkansas", "Louisiana",
  "Wisconsin", "Illinois", "Michigan", "Indiana", "Ohio", "Kentucky", "Tennessee",
  "Mississippi", "Alabama", "Georgia", "Florida", "South Carolina", "North Carolina",
  "Virginia", "West Virginia", "Pennsylvania", "Maryland", "Delaware", "New Jersey",
  "New York", "Connecticut", "Rhode Island", "Massachusetts", "Vermont",
  "New Hampshire", "Maine", "Alaska", "Hawaii",
];

const STEP = 260;          // ms between state activations
const HOLD_FULL = 1800;    // ms to hold the full map before reset
const RESET_FADE = 700;    // ms to fade everything out before next loop

const UsaMap = () => {
  const [active, setActive] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0); // forces marker remount for pop animation

  useEffect(() => {
    let timers: number[] = [];
    let cancelled = false;

    const runLoop = () => {
      if (cancelled) return;
      setActive(new Set());
      setTick((t) => t + 1);

      SEQUENCE.forEach((name, i) => {
        const t = window.setTimeout(() => {
          setActive((prev) => {
            const next = new Set(prev);
            next.add(name);
            return next;
          });
        }, 400 + i * STEP);
        timers.push(t);
      });

      const totalMs = 400 + SEQUENCE.length * STEP + HOLD_FULL;
      const resetT = window.setTimeout(() => {
        // fade out
        setActive(new Set());
        const nextT = window.setTimeout(runLoop, RESET_FADE);
        timers.push(nextT);
      }, totalMs);
      timers.push(resetT);
    };

    runLoop();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes pin-drop {
          0%   { transform: translate(-50%, -180%) scale(0.4); opacity: 0; }
          60%  { transform: translate(-50%, -95%)  scale(1.15); opacity: 1; }
          80%  { transform: translate(-50%, -100%) scale(0.95); }
          100% { transform: translate(-50%, -100%) scale(1);    opacity: 1; }
        }
        .pin-marker {
          animation: pin-drop 520ms cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes pin-pulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.55); }
          50%      { box-shadow: 0 0 0 10px hsl(var(--primary) / 0); }
        }
      `}</style>

      <div className="relative">
        <ComposableMap
          projection="geoAlbersUsa"
          width={980}
          height={560}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const name = geo.properties.name as string;
                  const isOn = active.has(name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: isOn ? "hsl(var(--primary))" : "hsl(var(--muted))",
                          stroke: "hsl(var(--background))",
                          strokeWidth: 0.75,
                          outline: "none",
                          transition: "fill 500ms ease, filter 500ms ease",
                          filter: isOn
                            ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.55))"
                            : "none",
                        },
                        hover: { fill: "hsl(var(--primary))", outline: "none", cursor: "pointer" },
                        pressed: { fill: "hsl(var(--primary))", outline: "none" },
                      }}
                    >
                      <title>{name}</title>
                    </Geography>
                  );
                })}

                {geographies.map((geo) => {
                  const name = geo.properties.name as string;
                  if (!active.has(name)) return null;
                  const centroid = geoCentroid(geo) as [number, number];
                  if (!centroid || Number.isNaN(centroid[0])) return null;
                  return (
                    <Marker key={`${tick}-${name}`} coordinates={centroid}>
                      <foreignObject x={-18} y={-40} width={36} height={42} style={{ overflow: "visible" }}>
                        <div
                          className="pin-marker"
                          style={{
                            width: 0,
                            height: 0,
                            transformOrigin: "50% 100%",
                            position: "relative",
                            left: "50%",
                            top: "100%",
                          }}
                        >
                          <div
                            className="flex items-center justify-center rounded-full bg-secondary border-2 border-primary"
                            style={{
                              width: 26,
                              height: 26,
                              transform: "translate(-50%, -100%)",
                              animation: "pin-pulse 1.6s ease-out infinite",
                            }}
                          >
                            <MapPin size={14} className="text-primary" strokeWidth={2.5} />
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "calc(-100% + 24px)",
                              width: 0,
                              height: 0,
                              transform: "translateX(-50%)",
                              borderLeft: "5px solid transparent",
                              borderRight: "5px solid transparent",
                              borderTop: "7px solid hsl(var(--secondary))",
                            }}
                          />
                        </div>
                      </foreignObject>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-foreground">{active.size}</span> / 50 States Active
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-primary inline-block shadow-[0_0_8px_hsl(var(--primary))]" />
          Dispatched
        </span>
      </div>
    </div>
  );
};

export default UsaMap;
