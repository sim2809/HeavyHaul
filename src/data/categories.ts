import construction from "@/assets/cat-construction.jpg";
import agricultural from "@/assets/cat-agricultural.jpg";
import industrial from "@/assets/hero-industrial.jpg";
import trucksHero from "@/assets/hero-trucks.jpg";
import serviceCanada from "@/assets/service-canada.jpg";
import serviceMexico from "@/assets/service-mexico.jpg";
import serviceCatastrophic from "@/assets/service-catastrophic.jpg";
import serviceRigging from "@/assets/service-rigging.jpg";
import serviceTowing from "@/assets/service-towing.jpg";
import servicePilot from "@/assets/service-pilot.jpg";
import servicePartial from "@/assets/service-partial.jpg";

export interface SubCategory {
  slug: string;
  name: string;
  blurb: string;
  brands: string[];
  trailers: string[];
}

export interface Category {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  image: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    slug: "construction-equipment-transport",
    name: "Construction Equipment Transport",
    short: "Construction",
    image: construction,
    blurb:
      "Heavy haul transport for excavators, bulldozers, cranes, loaders, and every piece of construction iron, permits, pilot cars, and route surveys handled in-house.",
    subcategories: [
      {
        slug: "excavator-transport",
        name: "Excavator Transport",
        blurb: "Mini, midi, and full-size hydraulic excavators moved coast to coast.",
        brands: ["Caterpillar", "Komatsu", "John Deere", "Volvo", "Hitachi", "Kobelco", "Hyundai", "Doosan", "Case", "Liebherr"],
        trailers: ["Lowboy / RGN", "Step Deck", "Double Drop"],
      },
      {
        slug: "bulldozer-transport",
        name: "Bulldozer & Dozer Transport",
        blurb: "D3 through D11 crawler dozers, including LGP and waste handlers.",
        brands: ["Caterpillar D6/D8/D11", "Komatsu", "John Deere", "Case", "Liebherr"],
        trailers: ["Lowboy", "Multi-axle RGN", "9-axle Lowboy"],
      },
      {
        slug: "crane-transport",
        name: "Crane Transport",
        blurb: "Rough terrain, all-terrain, crawler, and boom truck cranes, including superload moves.",
        brands: ["Grove", "Manitowoc", "Liebherr", "Tadano", "Link-Belt", "Terex", "Kobelco"],
        trailers: ["Multi-axle Lowboy", "Schnabel", "Perimeter Trailer"],
      },
      {
        slug: "wheel-loader-transport",
        name: "Wheel Loader Transport",
        blurb: "Compact through large mining wheel loaders moved safely.",
        brands: ["Caterpillar 980/988/992", "Komatsu", "Volvo", "Case", "John Deere", "Liebherr"],
        trailers: ["RGN", "Step Deck", "Lowboy"],
      },
      {
        slug: "backhoe-loader-transport",
        name: "Backhoe Loader Transport",
        blurb: "Construction backhoes hauled with secured attachments.",
        brands: ["John Deere", "Caterpillar", "Case", "JCB", "Kubota"],
        trailers: ["Hot Shot", "Step Deck", "Flatbed"],
      },
      {
        slug: "skid-steer-transport",
        name: "Skid Steer & Compact Track Loader Transport",
        blurb: "Single units or full equipment fleets moved nationwide.",
        brands: ["Bobcat", "Caterpillar", "Kubota", "John Deere", "Case", "Takeuchi", "ASV"],
        trailers: ["Hot Shot", "Flatbed", "Gooseneck"],
      },
      {
        slug: "paving-equipment-transport",
        name: "Paving & Compaction Equipment",
        blurb: "Asphalt pavers, milling machines, and rollers.",
        brands: ["Caterpillar", "Volvo", "Wirtgen", "Vögele", "Hamm", "Bomag", "Dynapac", "Sakai"],
        trailers: ["Step Deck", "Lowboy", "RGN"],
      },
      {
        slug: "concrete-equipment-transport",
        name: "Concrete Equipment Transport",
        blurb: "Concrete pumps, mixers, and batching plants moved with permits.",
        brands: ["Putzmeister", "Schwing", "Liebherr", "McNeilus", "Oshkosh"],
        trailers: ["Lowboy", "Step Deck", "Multi-axle"],
      },
    ],
  },
  {
    slug: "agricultural-equipment-transport",
    name: "Agricultural Equipment Transport",
    short: "Agricultural",
    image: agricultural,
    blurb:
      "Farm to field, dealer to farm, combines, tractors, planters, and sprayers moved with the right trailer and the right driver.",
    subcategories: [
      {
        slug: "combine-transport",
        name: "Combine Harvester Transport",
        blurb: "Heads removed and shipped separately when needed. Permitted moves nationwide.",
        brands: ["John Deere S/X Series", "Case IH Axial-Flow", "New Holland", "Claas", "Gleaner", "Massey Ferguson"],
        trailers: ["Step Deck", "RGN", "Lowboy"],
      },
      {
        slug: "tractor-transport",
        name: "Tractor Shipping Services",
        blurb: "Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job.",
        brands: ["John Deere", "Case IH", "New Holland", "Kubota", "Massey Ferguson", "Fendt", "Claas", "AGCO", "Mahindra", "Challenger", "Versatile", "Steyr"],
        trailers: ["Flatbed", "Step Deck", "Hot Shot", "RGN", "Lowboy", "Multi-Axle"],
      },
      {
        slug: "sprayer-transport",
        name: "Sprayer & Floater Transport",
        blurb: "Self-propelled sprayers and dry box floaters with overheight permits.",
        brands: ["John Deere", "Case IH Patriot", "New Holland Guardian", "Hagie", "Apache", "RoGator"],
        trailers: ["RGN", "Lowboy"],
      },
      {
        slug: "planter-transport",
        name: "Planter & Seeder Transport",
        blurb: "Folded or oversize planters and air seeders.",
        brands: ["John Deere", "Case IH Early Riser", "Kinze", "White Planters", "Horsch"],
        trailers: ["Flatbed", "Step Deck"],
      },
      {
        slug: "hay-equipment-transport",
        name: "Hay & Forage Equipment",
        blurb: "Balers, mower conditioners, windrowers, forage harvesters.",
        brands: ["John Deere", "New Holland", "Vermeer", "Krone", "Claas Jaguar", "Case IH"],
        trailers: ["Flatbed", "Step Deck"],
      },
      {
        slug: "livestock-equipment-transport",
        name: "Livestock & Dairy Equipment",
        blurb: "Feed mixers, manure spreaders, and dairy parlor equipment.",
        brands: ["Kuhn", "Vermeer", "DeLaval", "Boumatic", "Patz"],
        trailers: ["Flatbed", "Step Deck"],
      },
    ],
  },
  {
    slug: "industrial-machinery-transport",
    name: "Industrial Machinery Transport",
    short: "Industrial Machinery",
    image: industrial,
    blurb:
      "Plant relocations, CNC machinery, generators, transformers, and superloads, engineered route plans with white-glove rigging.",
    subcategories: [
      {
        slug: "cnc-machine-transport",
        name: "CNC & Machine Tool Transport",
        blurb: "Climate-controlled and air-ride options for precision equipment.",
        brands: ["Haas", "Mazak", "DMG Mori", "Okuma", "Makino", "Doosan", "Hurco", "Fanuc"],
        trailers: ["Air-ride Van", "Step Deck", "Conestoga"],
      },
      {
        slug: "generator-transport",
        name: "Industrial Generator Transport",
        blurb: "Diesel and natural gas gensets up to 4MW and beyond.",
        brands: ["Caterpillar", "Cummins", "Kohler", "Generac", "MTU", "Detroit Diesel", "Perkins"],
        trailers: ["Lowboy", "RGN", "Step Deck", "Multi-axle"],
      },
      {
        slug: "transformer-transport",
        name: "Transformer & Substation Transport",
        blurb: "Substation transformers and switchgear, superload specialists.",
        brands: ["ABB", "Siemens", "GE", "Eaton", "Hitachi Energy", "Hyundai Electric"],
        trailers: ["Schnabel", "13-axle Trailer", "Perimeter Lowboy"],
      },
      {
        slug: "manufacturing-equipment",
        name: "Manufacturing Equipment Relocation",
        blurb: "Stamping presses, injection molding machines, full plant moves.",
        brands: ["Husky", "Engel", "Arburg", "Schuler", "Komatsu Press", "Bliss"],
        trailers: ["Lowboy", "Step Deck", "Flatbed"],
      },
      {
        slug: "oil-gas-equipment",
        name: "Oil & Gas Equipment Transport",
        blurb: "Frac equipment, drilling rigs, separators, and pressure vessels.",
        brands: ["Halliburton", "Schlumberger", "NOV", "Cameron", "Weatherford"],
        trailers: ["Lowboy", "RGN", "Specialty Multi-axle"],
      },
      {
        slug: "wind-energy-transport",
        name: "Wind Energy Component Transport",
        blurb: "Wind blades, nacelles, hubs, and tower sections.",
        brands: ["GE Renewable", "Vestas", "Siemens Gamesa", "Nordex"],
        trailers: ["Blade Trailer", "Schnabel", "Extendable Flatbed"],
      },
    ],
  },
  {
    slug: "heavy-duty-truck-transport",
    name: "Heavy Duty Truck Transport",
    short: "Heavy Duty Trucks",
    image: trucksHero,
    blurb:
      "Single units or full fleets, semi tractors, dump trucks, fire apparatus, tow trucks and vocational vehicles delivered on time, every load.",
    subcategories: [
      {
        slug: "semi-truck-transport",
        name: "Semi Truck & Day Cab Transport",
        blurb: "Sleeper and day cab tractors, drive-away or hauled.",
        brands: ["Peterbilt", "Kenworth", "Freightliner", "Mack", "Volvo", "International", "Western Star"],
        trailers: ["Drop Deck", "Lowboy", "Drive-away"],
      },
      {
        slug: "dump-truck-transport",
        name: "Dump Truck Transport",
        blurb: "Single-axle through tri-axle dumps and articulated haulers.",
        brands: ["Mack Granite", "Kenworth", "Peterbilt", "Caterpillar", "Volvo", "Western Star"],
        trailers: ["Lowboy", "Step Deck", "Drive-away"],
      },
      {
        slug: "box-truck-transport",
        name: "Box Truck & Straight Truck Transport",
        blurb: "Class 4-7 vocational trucks delivered nationwide.",
        brands: ["Hino", "Isuzu", "Freightliner M2", "International MV", "Ford F-650/750"],
        trailers: ["Flatbed", "Drive-away", "Hot Shot"],
      },
      {
        slug: "tow-truck-transport",
        name: "Tow Truck & Wrecker Transport",
        blurb: "Rotators, heavy wreckers, and integrated tow trucks.",
        brands: ["Jerr-Dan", "Miller Industries", "Century", "Vulcan", "Holmes", "NRC"],
        trailers: ["Lowboy", "Drop Deck"],
      },
      {
        slug: "fire-truck-transport",
        name: "Fire Truck & Emergency Vehicle Transport",
        blurb: "Pumpers, ladders, aerials, and ARFF apparatus.",
        brands: ["Pierce", "E-One", "Rosenbauer", "KME", "Sutphen", "Ferrara"],
        trailers: ["Step Deck", "Drive-away"],
      },
      {
        slug: "bus-transport",
        name: "Bus & Coach Transport",
        blurb: "Transit, school, and motorcoach drive-away or hauled.",
        brands: ["Blue Bird", "Thomas Built", "IC Bus", "MCI", "Prevost", "Van Hool"],
        trailers: ["Drive-away", "Lowboy"],
      },
    ],
  },
  {
    slug: "canada-shipping-service",
    name: "Canada Shipping Service",
    short: "Canada Shipping",
    image: serviceCanada,
    blurb: "Cross-border heavy haul and oversize freight between the U.S. and Canada, customs, ACI/PARS, and bonded carriers handled in-house.",
    subcategories: [
      { slug: "us-to-canada", name: "US to Canada Heavy Haul", blurb: "Equipment and oversize loads moving northbound across all major crossings.", brands: ["CBSA Bonded"], trailers: ["Lowboy","RGN","Step Deck"] },
      { slug: "canada-to-us", name: "Canada to US Heavy Haul", blurb: "Southbound returns with full customs brokerage and PARS filing.", brands: ["CBP ACE"], trailers: ["Lowboy","RGN"] },
    ],
  },
  {
    slug: "mexico-shipping-service",
    name: "Mexico Shipping Service",
    short: "Mexico Shipping",
    image: serviceMexico,
    blurb: "Cross-border equipment transport between the U.S. and Mexico, bonded carriers, drayage at Laredo, El Paso, and Otay Mesa.",
    subcategories: [
      { slug: "us-to-mexico", name: "US to Mexico Heavy Haul", blurb: "Southbound equipment with bilingual dispatch and Mexican carrier handoff.", brands: ["SAT / Aduanas"], trailers: ["Lowboy","Step Deck"] },
      { slug: "mexico-to-us", name: "Mexico to US Heavy Haul", blurb: "Northbound border crossings with CBP clearance.", brands: ["CBP"], trailers: ["Lowboy","RGN"] },
    ],
  },
  {
    slug: "catastrophic-recovery",
    name: "Catastrophic Recovery",
    short: "Catastrophic Recovery",
    image: serviceCatastrophic,
    blurb: "Emergency response recovery for heavy equipment after rollovers, accidents, and natural disasters, 24/7 dispatch.",
    subcategories: [
      { slug: "equipment-recovery", name: "Heavy Equipment Recovery", blurb: "Rollovers, ditch recoveries, and crane lifts for stranded iron.", brands: [], trailers: ["Lowboy","Rotator","RGN"] },
      { slug: "disaster-response", name: "Disaster Response Hauling", blurb: "Storm, flood, and wildfire equipment relocation.", brands: [], trailers: ["Lowboy","Flatbed"] },
    ],
  },
  {
    slug: "rigging-and-lifting-service",
    name: "Rigging & Lifting Service",
    short: "Rigging & Lifting",
    image: serviceRigging,
    blurb: "Crane lifts, jacking & skating, and millwright rigging for plant moves, machinery installs, and oversize loading.",
    subcategories: [
      { slug: "crane-services", name: "Crane Lifting Services", blurb: "Mobile and crawler crane lifts for loading and installation.", brands: ["Grove","Liebherr","Manitowoc"], trailers: [] },
      { slug: "millwright-rigging", name: "Millwright & Plant Rigging", blurb: "Jacking, skating, and rigging inside facilities.", brands: [], trailers: [] },
    ],
  },
  {
    slug: "heavy-machinery-towing",
    name: "Heavy Machinery Towing",
    short: "Heavy Machinery Towing",
    image: serviceTowing,
    blurb: "Heavy-duty wrecker and rotator service for stranded construction equipment, semi trucks, and oversize loads.",
    subcategories: [
      { slug: "rotator-towing", name: "Rotator Towing", blurb: "75-ton+ rotators for overturned trucks and equipment.", brands: ["Century","NRC","Miller"], trailers: ["Rotator"] },
      { slug: "lowboy-towing", name: "Lowboy Recovery Towing", blurb: "Disabled equipment loaded onto lowboys for relocation.", brands: [], trailers: ["Lowboy"] },
    ],
  },
  {
    slug: "pilot-car-service",
    name: "Pilot Car Service",
    short: "Pilot Cars",
    image: servicePilot,
    blurb: "Certified pilot/escort cars for oversize and superload moves, front, rear, high-pole, and route survey services.",
    subcategories: [
      { slug: "lead-chase-pilots", name: "Lead & Chase Pilot Cars", blurb: "Certified pilot operators for every U.S. state's requirements.", brands: [], trailers: [] },
      { slug: "high-pole-survey", name: "High Pole & Route Survey", blurb: "Overhead clearance verification for superloads.", brands: [], trailers: [] },
    ],
  },
  {
    slug: "partial-load-shipping",
    name: "Partial Load Shipping",
    short: "Partial / LTL",
    image: servicePartial,
    blurb: "LTL and partial truckload heavy haul, pay only for the space you use. Step deck, flatbed, and RGN options.",
    subcategories: [
      { slug: "ltl-heavy-haul", name: "LTL Heavy Haul", blurb: "Less-than-truckload shipments under 20,000 lbs.", brands: [], trailers: ["Step Deck","Flatbed"] },
      { slug: "partial-truckload", name: "Partial Truckload", blurb: "Half or quarter trailer loads with consolidated routing.", brands: [], trailers: ["Step Deck","RGN","Flatbed"] },
    ],
  },
];

export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const findSub = (catSlug: string, subSlug: string) =>
  findCategory(catSlug)?.subcategories.find((s) => s.slug === subSlug);

// ─── LANES (geo-targeted SEO) ───
export interface City {
  slug: string;
  name: string;
  state: string;
}

export const cities: City[] = [
  { slug: "new-york", name: "New York", state: "NY" },
  { slug: "los-angeles", name: "Los Angeles", state: "CA" },
  { slug: "chicago", name: "Chicago", state: "IL" },
  { slug: "houston", name: "Houston", state: "TX" },
  { slug: "dallas", name: "Dallas", state: "TX" },
  { slug: "phoenix", name: "Phoenix", state: "AZ" },
  { slug: "philadelphia", name: "Philadelphia", state: "PA" },
  { slug: "san-antonio", name: "San Antonio", state: "TX" },
  { slug: "san-diego", name: "San Diego", state: "CA" },
  { slug: "miami", name: "Miami", state: "FL" },
  { slug: "atlanta", name: "Atlanta", state: "GA" },
  { slug: "denver", name: "Denver", state: "CO" },
  { slug: "seattle", name: "Seattle", state: "WA" },
  { slug: "boston", name: "Boston", state: "MA" },
  { slug: "detroit", name: "Detroit", state: "MI" },
  { slug: "minneapolis", name: "Minneapolis", state: "MN" },
  { slug: "charlotte", name: "Charlotte", state: "NC" },
  { slug: "nashville", name: "Nashville", state: "TN" },
  { slug: "kansas-city", name: "Kansas City", state: "MO" },
  { slug: "las-vegas", name: "Las Vegas", state: "NV" },
];

export const findCity = (slug: string) => cities.find((c) => c.slug === slug);

// Featured popular lanes
export const popularLanes: Array<[string, string]> = [
  ["new-york", "dallas"],
  ["los-angeles", "houston"],
  ["chicago", "atlanta"],
  ["dallas", "denver"],
  ["miami", "new-york"],
  ["houston", "phoenix"],
  ["seattle", "chicago"],
  ["atlanta", "los-angeles"],
  ["denver", "kansas-city"],
  ["philadelphia", "miami"],
  ["detroit", "nashville"],
  ["charlotte", "boston"],
];

// ─── US STATES (industry × state SEO pages) ───
export interface State { slug: string; name: string; abbr: string; }
export const states: State[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL" },
  { slug: "alaska", name: "Alaska", abbr: "AK" },
  { slug: "arizona", name: "Arizona", abbr: "AZ" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR" },
  { slug: "california", name: "California", abbr: "CA" },
  { slug: "colorado", name: "Colorado", abbr: "CO" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT" },
  { slug: "delaware", name: "Delaware", abbr: "DE" },
  { slug: "florida", name: "Florida", abbr: "FL" },
  { slug: "georgia", name: "Georgia", abbr: "GA" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI" },
  { slug: "idaho", name: "Idaho", abbr: "ID" },
  { slug: "illinois", name: "Illinois", abbr: "IL" },
  { slug: "indiana", name: "Indiana", abbr: "IN" },
  { slug: "iowa", name: "Iowa", abbr: "IA" },
  { slug: "kansas", name: "Kansas", abbr: "KS" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA" },
  { slug: "maine", name: "Maine", abbr: "ME" },
  { slug: "maryland", name: "Maryland", abbr: "MD" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA" },
  { slug: "michigan", name: "Michigan", abbr: "MI" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS" },
  { slug: "missouri", name: "Missouri", abbr: "MO" },
  { slug: "montana", name: "Montana", abbr: "MT" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE" },
  { slug: "nevada", name: "Nevada", abbr: "NV" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM" },
  { slug: "new-york", name: "New York", abbr: "NY" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND" },
  { slug: "ohio", name: "Ohio", abbr: "OH" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK" },
  { slug: "oregon", name: "Oregon", abbr: "OR" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN" },
  { slug: "texas", name: "Texas", abbr: "TX" },
  { slug: "utah", name: "Utah", abbr: "UT" },
  { slug: "vermont", name: "Vermont", abbr: "VT" },
  { slug: "virginia", name: "Virginia", abbr: "VA" },
  { slug: "washington", name: "Washington", abbr: "WA" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY" },
];
export const findState = (slug: string) => states.find((s) => s.slug === slug);
