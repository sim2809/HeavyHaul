<?php
/**
 * Seed `service_category` (11 posts) and `service_subcategory` (40 posts) with the
 * real content ported from the original React app (src/data/categories.ts,
 * src/pages/Category.tsx, src/pages/ServiceDetail.tsx, src/pages/SubCategory.tsx).
 *
 * Run with:
 *   wp eval-file docker/wordpress/scripts/seed-categories.php --allow-root
 *
 * Idempotent: looks up each post by post_type + slug before creating, and
 * updates in place if it already exists. Uses ACF's update_field() for every
 * field (including repeaters) so ACF handles postmeta serialization itself.
 *
 * Image assets: the original site's imagery (hero images, gallery photos,
 * service-gallery photos) has no equivalent files in this repo, so every
 * image field (hero_image, gallery.src, service_gallery.src) is intentionally
 * left blank across this whole script. Text-only sub-fields of those repeaters
 * (alt / title / desc) are populated where the source data has meaningful
 * copy; the freight `gallery` repeater is skipped entirely because
 * Category.tsx's GALLERY_BY_CAT is just an array of images with no per-item
 * text (no alt/title/desc), so there is nothing text-based to port.
 */

if (!function_exists('update_field')) {
    WP_CLI::error('ACF (update_field) is not available — is ACF/SCF active?');
}

/** The 4 categories that use the freight (Category.tsx) template. */
$FREIGHT_SLUGS = [
    'construction-equipment-transport',
    'agricultural-equipment-transport',
    'industrial-machinery-transport',
    'heavy-duty-truck-transport',
];

/**
 * The 7 categories that use the service (ServiceDetail.tsx) template — this is
 * exactly `NON_FREIGHT_SLUGS` (= Object.keys(CONTENT)) from ServiceDetail.tsx.
 */
$SERVICE_SLUGS = [
    'canada-shipping-service',
    'mexico-shipping-service',
    'catastrophic-recovery',
    'rigging-and-lifting-service',
    'pilot-car-service',
    'heavy-machinery-towing',
    'partial-load-shipping',
];

/* ────────────────────────────────────────────────────────────────────────
 * Base category data (src/data/categories.ts) — name/short/blurb + subcats.
 * ──────────────────────────────────────────────────────────────────────── */
$CATEGORIES = [
    'construction-equipment-transport' => [
        'name' => 'Construction Equipment Transport',
        'short' => 'Construction',
        'blurb' => 'Heavy haul transport for excavators, bulldozers, cranes, loaders, and every piece of construction iron, permits, pilot cars, and route surveys handled in-house.',
        'subcategories' => [
            ['slug' => 'excavator-transport', 'name' => 'Excavator Transport', 'blurb' => 'Mini, midi, and full-size hydraulic excavators moved coast to coast.', 'brands' => ['Caterpillar', 'Komatsu', 'John Deere', 'Volvo', 'Hitachi', 'Kobelco', 'Hyundai', 'Doosan', 'Case', 'Liebherr'], 'trailers' => ['Lowboy / RGN', 'Step Deck', 'Double Drop']],
            ['slug' => 'bulldozer-transport', 'name' => 'Bulldozer & Dozer Transport', 'blurb' => 'D3 through D11 crawler dozers, including LGP and waste handlers.', 'brands' => ['Caterpillar D6/D8/D11', 'Komatsu', 'John Deere', 'Case', 'Liebherr'], 'trailers' => ['Lowboy', 'Multi-axle RGN', '9-axle Lowboy']],
            ['slug' => 'crane-transport', 'name' => 'Crane Transport', 'blurb' => 'Rough terrain, all-terrain, crawler, and boom truck cranes, including superload moves.', 'brands' => ['Grove', 'Manitowoc', 'Liebherr', 'Tadano', 'Link-Belt', 'Terex', 'Kobelco'], 'trailers' => ['Multi-axle Lowboy', 'Schnabel', 'Perimeter Trailer']],
            ['slug' => 'wheel-loader-transport', 'name' => 'Wheel Loader Transport', 'blurb' => 'Compact through large mining wheel loaders moved safely.', 'brands' => ['Caterpillar 980/988/992', 'Komatsu', 'Volvo', 'Case', 'John Deere', 'Liebherr'], 'trailers' => ['RGN', 'Step Deck', 'Lowboy']],
            ['slug' => 'backhoe-loader-transport', 'name' => 'Backhoe Loader Transport', 'blurb' => 'Construction backhoes hauled with secured attachments.', 'brands' => ['John Deere', 'Caterpillar', 'Case', 'JCB', 'Kubota'], 'trailers' => ['Hot Shot', 'Step Deck', 'Flatbed']],
            ['slug' => 'skid-steer-transport', 'name' => 'Skid Steer & Compact Track Loader Transport', 'blurb' => 'Single units or full equipment fleets moved nationwide.', 'brands' => ['Bobcat', 'Caterpillar', 'Kubota', 'John Deere', 'Case', 'Takeuchi', 'ASV'], 'trailers' => ['Hot Shot', 'Flatbed', 'Gooseneck']],
            ['slug' => 'paving-equipment-transport', 'name' => 'Paving & Compaction Equipment', 'blurb' => 'Asphalt pavers, milling machines, and rollers.', 'brands' => ['Caterpillar', 'Volvo', 'Wirtgen', 'Vögele', 'Hamm', 'Bomag', 'Dynapac', 'Sakai'], 'trailers' => ['Step Deck', 'Lowboy', 'RGN']],
            ['slug' => 'concrete-equipment-transport', 'name' => 'Concrete Equipment Transport', 'blurb' => 'Concrete pumps, mixers, and batching plants moved with permits.', 'brands' => ['Putzmeister', 'Schwing', 'Liebherr', 'McNeilus', 'Oshkosh'], 'trailers' => ['Lowboy', 'Step Deck', 'Multi-axle']],
        ],
    ],
    'agricultural-equipment-transport' => [
        'name' => 'Agricultural Equipment Transport',
        'short' => 'Agricultural',
        'blurb' => 'Farm to field, dealer to farm, combines, tractors, planters, and sprayers moved with the right trailer and the right driver.',
        'subcategories' => [
            ['slug' => 'combine-transport', 'name' => 'Combine Harvester Transport', 'blurb' => 'Heads removed and shipped separately when needed. Permitted moves nationwide.', 'brands' => ['John Deere S/X Series', 'Case IH Axial-Flow', 'New Holland', 'Claas', 'Gleaner', 'Massey Ferguson'], 'trailers' => ['Step Deck', 'RGN', 'Lowboy']],
            ['slug' => 'tractor-transport', 'name' => 'Tractor Shipping Services', 'blurb' => 'Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job.', 'brands' => ['John Deere', 'Case IH', 'New Holland', 'Kubota', 'Massey Ferguson', 'Fendt', 'Claas', 'AGCO', 'Mahindra', 'Challenger', 'Versatile', 'Steyr'], 'trailers' => ['Flatbed', 'Step Deck', 'Hot Shot', 'RGN', 'Lowboy', 'Multi-Axle'], 'custom_template' => 'tractor'],
            ['slug' => 'sprayer-transport', 'name' => 'Sprayer & Floater Transport', 'blurb' => 'Self-propelled sprayers and dry box floaters with overheight permits.', 'brands' => ['John Deere', 'Case IH Patriot', 'New Holland Guardian', 'Hagie', 'Apache', 'RoGator'], 'trailers' => ['RGN', 'Lowboy']],
            ['slug' => 'planter-transport', 'name' => 'Planter & Seeder Transport', 'blurb' => 'Folded or oversize planters and air seeders.', 'brands' => ['John Deere', 'Case IH Early Riser', 'Kinze', 'White Planters', 'Horsch'], 'trailers' => ['Flatbed', 'Step Deck']],
            ['slug' => 'hay-equipment-transport', 'name' => 'Hay & Forage Equipment', 'blurb' => 'Balers, mower conditioners, windrowers, forage harvesters.', 'brands' => ['John Deere', 'New Holland', 'Vermeer', 'Krone', 'Claas Jaguar', 'Case IH'], 'trailers' => ['Flatbed', 'Step Deck']],
            ['slug' => 'livestock-equipment-transport', 'name' => 'Livestock & Dairy Equipment', 'blurb' => 'Feed mixers, manure spreaders, and dairy parlor equipment.', 'brands' => ['Kuhn', 'Vermeer', 'DeLaval', 'Boumatic', 'Patz'], 'trailers' => ['Flatbed', 'Step Deck']],
        ],
    ],
    'industrial-machinery-transport' => [
        'name' => 'Industrial Machinery Transport',
        'short' => 'Industrial Machinery',
        'blurb' => 'Plant relocations, CNC machinery, generators, transformers, and superloads, engineered route plans with white-glove rigging.',
        'subcategories' => [
            ['slug' => 'cnc-machine-transport', 'name' => 'CNC & Machine Tool Transport', 'blurb' => 'Climate-controlled and air-ride options for precision equipment.', 'brands' => ['Haas', 'Mazak', 'DMG Mori', 'Okuma', 'Makino', 'Doosan', 'Hurco', 'Fanuc'], 'trailers' => ['Air-ride Van', 'Step Deck', 'Conestoga']],
            ['slug' => 'generator-transport', 'name' => 'Industrial Generator Transport', 'blurb' => 'Diesel and natural gas gensets up to 4MW and beyond.', 'brands' => ['Caterpillar', 'Cummins', 'Kohler', 'Generac', 'MTU', 'Detroit Diesel', 'Perkins'], 'trailers' => ['Lowboy', 'RGN', 'Step Deck', 'Multi-axle']],
            ['slug' => 'transformer-transport', 'name' => 'Transformer & Substation Transport', 'blurb' => 'Substation transformers and switchgear, superload specialists.', 'brands' => ['ABB', 'Siemens', 'GE', 'Eaton', 'Hitachi Energy', 'Hyundai Electric'], 'trailers' => ['Schnabel', '13-axle Trailer', 'Perimeter Lowboy']],
            ['slug' => 'manufacturing-equipment', 'name' => 'Manufacturing Equipment Relocation', 'blurb' => 'Stamping presses, injection molding machines, full plant moves.', 'brands' => ['Husky', 'Engel', 'Arburg', 'Schuler', 'Komatsu Press', 'Bliss'], 'trailers' => ['Lowboy', 'Step Deck', 'Flatbed']],
            ['slug' => 'oil-gas-equipment', 'name' => 'Oil & Gas Equipment Transport', 'blurb' => 'Frac equipment, drilling rigs, separators, and pressure vessels.', 'brands' => ['Halliburton', 'Schlumberger', 'NOV', 'Cameron', 'Weatherford'], 'trailers' => ['Lowboy', 'RGN', 'Specialty Multi-axle']],
            ['slug' => 'wind-energy-transport', 'name' => 'Wind Energy Component Transport', 'blurb' => 'Wind blades, nacelles, hubs, and tower sections.', 'brands' => ['GE Renewable', 'Vestas', 'Siemens Gamesa', 'Nordex'], 'trailers' => ['Blade Trailer', 'Schnabel', 'Extendable Flatbed']],
        ],
    ],
    'heavy-duty-truck-transport' => [
        'name' => 'Heavy Duty Truck Transport',
        'short' => 'Heavy Duty Trucks',
        'blurb' => 'Single units or full fleets, semi tractors, dump trucks, fire apparatus, tow trucks and vocational vehicles delivered on time, every load.',
        'subcategories' => [
            ['slug' => 'semi-truck-transport', 'name' => 'Semi Truck & Day Cab Transport', 'blurb' => 'Sleeper and day cab tractors, drive-away or hauled.', 'brands' => ['Peterbilt', 'Kenworth', 'Freightliner', 'Mack', 'Volvo', 'International', 'Western Star'], 'trailers' => ['Drop Deck', 'Lowboy', 'Drive-away']],
            ['slug' => 'dump-truck-transport', 'name' => 'Dump Truck Transport', 'blurb' => 'Single-axle through tri-axle dumps and articulated haulers.', 'brands' => ['Mack Granite', 'Kenworth', 'Peterbilt', 'Caterpillar', 'Volvo', 'Western Star'], 'trailers' => ['Lowboy', 'Step Deck', 'Drive-away']],
            ['slug' => 'box-truck-transport', 'name' => 'Box Truck & Straight Truck Transport', 'blurb' => 'Class 4-7 vocational trucks delivered nationwide.', 'brands' => ['Hino', 'Isuzu', 'Freightliner M2', 'International MV', 'Ford F-650/750'], 'trailers' => ['Flatbed', 'Drive-away', 'Hot Shot']],
            ['slug' => 'tow-truck-transport', 'name' => 'Tow Truck & Wrecker Transport', 'blurb' => 'Rotators, heavy wreckers, and integrated tow trucks.', 'brands' => ['Jerr-Dan', 'Miller Industries', 'Century', 'Vulcan', 'Holmes', 'NRC'], 'trailers' => ['Lowboy', 'Drop Deck']],
            ['slug' => 'fire-truck-transport', 'name' => 'Fire Truck & Emergency Vehicle Transport', 'blurb' => 'Pumpers, ladders, aerials, and ARFF apparatus.', 'brands' => ['Pierce', 'E-One', 'Rosenbauer', 'KME', 'Sutphen', 'Ferrara'], 'trailers' => ['Step Deck', 'Drive-away']],
            ['slug' => 'bus-transport', 'name' => 'Bus & Coach Transport', 'blurb' => 'Transit, school, and motorcoach drive-away or hauled.', 'brands' => ['Blue Bird', 'Thomas Built', 'IC Bus', 'MCI', 'Prevost', 'Van Hool'], 'trailers' => ['Drive-away', 'Lowboy']],
        ],
    ],
    'canada-shipping-service' => [
        'name' => 'Canada Shipping Service',
        'short' => 'Canada Shipping',
        'blurb' => 'Cross-border heavy haul and oversize freight between the U.S. and Canada, customs, ACI/PARS, and bonded carriers handled in-house.',
        'subcategories' => [
            ['slug' => 'us-to-canada', 'name' => 'US to Canada Heavy Haul', 'blurb' => 'Equipment and oversize loads moving northbound across all major crossings.', 'brands' => ['CBSA Bonded'], 'trailers' => ['Lowboy', 'RGN', 'Step Deck']],
            ['slug' => 'canada-to-us', 'name' => 'Canada to US Heavy Haul', 'blurb' => 'Southbound returns with full customs brokerage and PARS filing.', 'brands' => ['CBP ACE'], 'trailers' => ['Lowboy', 'RGN']],
        ],
    ],
    'mexico-shipping-service' => [
        'name' => 'Mexico Shipping Service',
        'short' => 'Mexico Shipping',
        'blurb' => 'Cross-border equipment transport between the U.S. and Mexico, bonded carriers, drayage at Laredo, El Paso, and Otay Mesa.',
        'subcategories' => [
            ['slug' => 'us-to-mexico', 'name' => 'US to Mexico Heavy Haul', 'blurb' => 'Southbound equipment with bilingual dispatch and Mexican carrier handoff.', 'brands' => ['SAT / Aduanas'], 'trailers' => ['Lowboy', 'Step Deck']],
            ['slug' => 'mexico-to-us', 'name' => 'Mexico to US Heavy Haul', 'blurb' => 'Northbound border crossings with CBP clearance.', 'brands' => ['CBP'], 'trailers' => ['Lowboy', 'RGN']],
        ],
    ],
    'catastrophic-recovery' => [
        'name' => 'Catastrophic Recovery',
        'short' => 'Catastrophic Recovery',
        'blurb' => 'Emergency response recovery for heavy equipment after rollovers, accidents, and natural disasters, 24/7 dispatch.',
        'subcategories' => [
            ['slug' => 'equipment-recovery', 'name' => 'Heavy Equipment Recovery', 'blurb' => 'Rollovers, ditch recoveries, and crane lifts for stranded iron.', 'brands' => [], 'trailers' => ['Lowboy', 'Rotator', 'RGN']],
            ['slug' => 'disaster-response', 'name' => 'Disaster Response Hauling', 'blurb' => 'Storm, flood, and wildfire equipment relocation.', 'brands' => [], 'trailers' => ['Lowboy', 'Flatbed']],
        ],
    ],
    'rigging-and-lifting-service' => [
        'name' => 'Rigging & Lifting Service',
        'short' => 'Rigging & Lifting',
        'blurb' => 'Crane lifts, jacking & skating, and millwright rigging for plant moves, machinery installs, and oversize loading.',
        'subcategories' => [
            ['slug' => 'crane-services', 'name' => 'Crane Lifting Services', 'blurb' => 'Mobile and crawler crane lifts for loading and installation.', 'brands' => ['Grove', 'Liebherr', 'Manitowoc'], 'trailers' => []],
            ['slug' => 'millwright-rigging', 'name' => 'Millwright & Plant Rigging', 'blurb' => 'Jacking, skating, and rigging inside facilities.', 'brands' => [], 'trailers' => []],
        ],
    ],
    'heavy-machinery-towing' => [
        'name' => 'Heavy Machinery Towing',
        'short' => 'Heavy Machinery Towing',
        'blurb' => 'Heavy-duty wrecker and rotator service for stranded construction equipment, semi trucks, and oversize loads.',
        'subcategories' => [
            ['slug' => 'rotator-towing', 'name' => 'Rotator Towing', 'blurb' => '75-ton+ rotators for overturned trucks and equipment.', 'brands' => ['Century', 'NRC', 'Miller'], 'trailers' => ['Rotator']],
            ['slug' => 'lowboy-towing', 'name' => 'Lowboy Recovery Towing', 'blurb' => 'Disabled equipment loaded onto lowboys for relocation.', 'brands' => [], 'trailers' => ['Lowboy']],
        ],
    ],
    'pilot-car-service' => [
        'name' => 'Pilot Car Service',
        'short' => 'Pilot Cars',
        'blurb' => 'Certified pilot/escort cars for oversize and superload moves, front, rear, high-pole, and route survey services.',
        'subcategories' => [
            ['slug' => 'lead-chase-pilots', 'name' => 'Lead & Chase Pilot Cars', 'blurb' => "Certified pilot operators for every U.S. state's requirements.", 'brands' => [], 'trailers' => []],
            ['slug' => 'high-pole-survey', 'name' => 'High Pole & Route Survey', 'blurb' => 'Overhead clearance verification for superloads.', 'brands' => [], 'trailers' => []],
        ],
    ],
    'partial-load-shipping' => [
        'name' => 'Partial Load Shipping',
        'short' => 'Partial / LTL',
        'blurb' => 'LTL and partial truckload heavy haul, pay only for the space you use. Step deck, flatbed, and RGN options.',
        'subcategories' => [
            ['slug' => 'ltl-heavy-haul', 'name' => 'LTL Heavy Haul', 'blurb' => 'Less-than-truckload shipments under 20,000 lbs.', 'brands' => [], 'trailers' => ['Step Deck', 'Flatbed']],
            ['slug' => 'partial-truckload', 'name' => 'Partial Truckload', 'blurb' => 'Half or quarter trailer loads with consolidated routing.', 'brands' => [], 'trailers' => ['Step Deck', 'RGN', 'Flatbed']],
        ],
    ],
];

/* ────────────────────────────────────────────────────────────────────────
 * Freight-template data (src/pages/Category.tsx EQUIPMENT_LIST_BY_CAT).
 * GALLERY_BY_CAT is image-only (no alt/title/desc per item) so the `gallery`
 * repeater is intentionally left empty for every freight category — there is
 * no text content to port, only <img> src references with no matching assets.
 * ──────────────────────────────────────────────────────────────────────── */
$EQUIPMENT_LIST_BY_CAT = [
    'construction-equipment-transport' => ['Air Curtain Destructor Transport', 'Amphibious Excavator Shipping', 'Arrow Boards Transport', 'Asphalt Plant Shipping', 'Asphalt Storage Tank Transport', 'Backhoe Shipping Services', 'Boom Lift Shipping Services', 'Bulldozer Hauling', 'Cable Plow Shipping', 'Cement Mill Transport', 'Clamshell Bucket Shipping', 'Cold Planer Delivery', 'Compact Demolition Robot Shipping', 'Concrete Laser Screed Machine Shipping', 'Construction Attachment Shipping', 'Construction Hoist Shipping', 'Conveyor Bridge Shipping', 'Crane Shipping', 'Crawler Carrier Shipping', 'Crawler Loader Hauling', 'Crushing Plant Shipping', 'Demolition Machine Transport', 'Drifter Drill Transport', 'Dumper & Mini Dumper Transport', 'Excavator Shipments', 'Forklift Shipping', 'Gravel Plant Shipping', 'Grinder Hauling', 'Hydraulic Gantry Shipping', 'Hydraulic Lift Transport', 'Industrial Rigging', 'Motor Grader Shipping', 'Oil Field / Gas Plant Equipment Shipping', 'Oversize Pump Transport', 'Paving Equipment Hauling', 'Paver Finisher Shipping', 'Pile Driver Shipping', 'Piling & Drilling Equipment Shipping', 'Pipelayer Vehicle Shipping', 'Prestressed Concrete Shipping', 'Pugmill Mixer Transport', 'Road Widener Shipping', 'Rock Wheel Shipping', 'Road Roller Shipping', 'Roadheader Shipping', 'Roofing Material Shipping', 'Scissor Lift Shipping', 'Scraper Transport', 'Skid-Steer Transport', 'Slipformer Paver Transport', 'Stabilized Soil Mixing Plant Transport', 'Surface Drill Shipping', 'Telescopic Handler Shipping', 'Trencher Shipping', 'Wheel Loader Shipping', 'Wheel Tractor Scraper Shipping'],
    'agricultural-equipment-transport' => ['Tractor Shipping Services', 'Row-Crop Tractor Transport', 'High-Horsepower Tractor Hauling', 'Articulated 4WD Tractor Shipping', 'Utility Tractor Transport', 'Compact Tractor Shipping', 'John Deere Combine Transport', 'Combine Harvester Transport', 'Combine Machinery Shipping', 'Corn Header Shipping', 'Grain Header Hauling', 'Harvesting Equipment Transport', 'Forage Harvester Hauling', 'Self-Propelled Sprayer Transport', 'Water Spraying Systems Transport', 'Dry Box Floater Shipping', 'Planting Machine Transport', 'Air Seeder Transport', 'Folding Planter Shipping', 'No-Till Drill Shipping', 'Grain Drill Transport', 'Strip-Till Bar Transport', 'Strip Till Rig Transport', 'Tillage Machine Transport Services', 'Disc Harrow Shipping', 'Disc Trencher Transport', 'Chisel Plow Transport', 'Field Cultivator Shipping', 'Vertical Tillage Tool Transport', 'Tandem Aerator Shipping Services', 'Roller Chopper Shipping', 'Ripper Transport', 'Round Baler Transport', 'Square Baler Shipping', 'Hay and Hay Equipment Transport', 'Self-Propelled Windrower Transport', 'Swather Transport', 'Mower Conditioner Shipping', 'Mower Shipping', 'Reaper Transport', 'Feed Mixer Transport', 'Feed Truck Trailer Shipping', 'Manure Spreader Shipping', 'Manure Tank Shipping', 'Grain Cart Transport', 'Auger Wagon Shipping', 'Auger Transport', 'Grain Bin Shipping', 'Grain Bin Hauling', 'Silo Transport', 'Bagger Transport', 'Irrigation Pivot Shipping', 'Pivot Transport', 'Hydraulic Power Pack Transport', 'Cotton Picker Transport', 'Cotton Stripper Shipping', 'Sugar Beet Harvester Transport', 'Potato Harvester Shipping', 'Shaker Equipment Transport', 'Bark Blower Shipping', 'Chip Spreader Hauling', 'Packer Transport', 'Lister Transport', 'Harrow Transport', 'Chopper Transport', 'Skid Steer for Farms', 'Compact Track Loader Shipping', 'Telehandler Transport', 'Loader Shipping', 'Barn Transport Services', 'Dairy Parlor Equipment Shipping', 'Livestock Trailer Transport', 'Poultry Equipment Shipping', 'Windmill Transport'],
    'industrial-machinery-transport' => ['CNC Machining Center Transport', 'Horizontal Mill Shipping', 'Vertical Mill Hauling', 'CNC Lathe Transport', 'Swiss-Type Lathe Shipping', '5-Axis Machining Center Shipping', 'EDM Machine Transport', 'Surface Grinder Shipping', 'Stamping Press Hauling', 'Hydraulic Press Transport', 'Injection Molding Machine Shipping', 'Blow Molding Machine Transport', 'Industrial Generator Transport', 'Diesel Genset Shipping', 'Natural Gas Genset Hauling', 'Power Transformer Transport', 'Substation Transformer Shipping', 'Switchgear Transport', 'Boiler Shipping', 'Pressure Vessel Transport', 'Heat Exchanger Shipping', 'Industrial Compressor Transport', 'Air Handler Shipping', 'Chiller Transport', 'Cooling Tower Shipping', 'Distillation Column Transport', 'Reactor Vessel Shipping', 'Storage Tank Transport', 'Silo Shipping', 'Wind Turbine Blade Transport', 'Wind Turbine Nacelle Shipping', 'Wind Tower Section Transport', 'Solar Panel Bulk Shipping', 'Frac Pump Transport', 'Drilling Rig Shipping', 'Mud Pump Transport', 'Mining Truck Hauling', 'Rock Crusher Shipping', 'Conveyor System Transport', 'Plant Relocation Services'],
    'heavy-duty-truck-transport' => ['Sleeper Cab Semi Truck Transport', 'Day Cab Truck Shipping', 'Drive-Away Tractor Service', 'Single-Axle Dump Truck Hauling', 'Tandem-Axle Dump Truck Transport', 'Tri-Axle Dump Truck Shipping', 'Articulated Hauler Transport', 'Off-Highway Truck Shipping', 'Box Truck Transport', 'Straight Truck Shipping', 'Refrigerated Truck Transport', 'Flatbed Truck Hauling', 'Rollback Tow Truck Shipping', 'Wrecker Truck Transport', 'Heavy Wrecker Hauling', 'Rotator Tow Truck Shipping', 'Integrated Tow Truck Transport', 'Pumper Fire Truck Shipping', 'Ladder Fire Truck Transport', 'Aerial Apparatus Shipping', 'ARFF Fire Truck Hauling', 'Ambulance Transport', 'School Bus Shipping', 'Transit Bus Transport', 'Motorcoach Hauling', 'Shuttle Bus Shipping', 'Garbage Truck Transport', 'Front Loader Refuse Truck Shipping', 'Roll-Off Truck Hauling', 'Cement Mixer Truck Transport', 'Concrete Pumper Truck Shipping', 'Boom Truck Transport', 'Bucket Truck Shipping', 'Service Body Truck Transport', 'Fuel Tanker Truck Shipping', 'Vacuum Truck Hauling', 'Sweeper Truck Transport', 'Snow Plow Truck Shipping', 'Military Truck Transport', 'Specialty Vocational Truck Shipping'],
];

/* ────────────────────────────────────────────────────────────────────────
 * Service-template data (src/pages/ServiceDetail.tsx CONTENT + GALLERIES).
 * Pillar `icon` values are the Lucide icon component names used in the
 * source (e.g. "FileText", "ShieldCheck") — ported as plain strings into the
 * `icon` text sub-field per the ACF schema's "Icon (Lucide name)" label.
 * The `steps` repeater only has t/d sub-fields in ACF (no step number), so
 * the source's numeric `n` field is dropped — order is preserved by array order.
 * ──────────────────────────────────────────────────────────────────────── */
$SERVICE_CONTENT = [
    'canada-shipping-service' => [
        'eyebrow' => 'Cross-Border · USA ↔ Canada',
        'hero_badge' => 'CBSA Bonded · ACI / PARS · CTPAT / FAST',
        'hero_title_lead' => 'USA – Canada',
        'hero_title_accent' => 'Heavy Haul Shipping',
        'hero_sub' => 'Bonded heavy haul between every U.S. state and every Canadian province — for importers, exporters, dealers, auction buyers, and OEMs. We handle the customs paperwork, the permits on both sides of the border, and the bonded carrier handoff so your equipment clears without sitting at the line.',
        'intro_title' => 'Full-Service Cross-Border Equipment Transport',
        'intro_body' => [
            "Whether you bought a piece at a Ritchie Bros sale in Canada and need it on a U.S. jobsite by next week, or you're shipping a Caterpillar dozer north to a mining operation in Alberta, we move it end-to-end. One dispatcher, one quote, one invoice — covering both the U.S. and Canadian legs of the move.",
            'We file ACI eManifests northbound and ACE eManifests southbound, prepare PARS/PAPS for customs pre-clearance, and coordinate with licensed customs brokers on both sides. Our bonded carrier network is staged near every major crossing — Pacific Highway, Sweetgrass / Coutts, Pembina / Emerson, Detroit / Windsor, Buffalo / Fort Erie, Champlain / Lacolle, and more.',
            'Importers and exporters get a single point of contact, real-time GPS tracking, and full visibility into customs status — no chasing brokers, no surprise demurrage charges at the border.',
        ],
        'pillars' => [
            ['icon' => 'FileText', 'title' => 'Customs Documentation Handled', 'desc' => 'Commercial invoice, bill of lading, B3 entry, BSF715, ACI / ACE eManifest, PARS/PAPS labels — prepared and filed in-house.'],
            ['icon' => 'ShieldCheck', 'title' => 'Bonded & CTPAT-Compliant Carriers', 'desc' => 'All cross-border carriers are CTPAT/PIP partners and FAST-approved for expedited clearance lanes.'],
            ['icon' => 'Globe', 'title' => 'Every Major Border Crossing', 'desc' => 'Pacific Hwy, Sweetgrass, Pembina, Sault Ste. Marie, Detroit-Windsor, Buffalo, Champlain — staged carriers at all of them.'],
            ['icon' => 'Truck', 'title' => 'Oversize Permits Both Sides', 'desc' => 'U.S. state permits plus provincial permits (MTO, SAAQ, Alberta TRAVIS) and pilot car coordination — one file, one team.'],
            ['icon' => 'Building2', 'title' => 'For Importers & Exporters', 'desc' => 'Equipment dealers, auction buyers, OEM fleets, mining and oil & gas operators — Net-30 terms for qualified accounts.'],
            ['icon' => 'Radio', 'title' => 'Live Border Status Updates', 'desc' => 'Our dispatchers monitor each crossing and message you the moment your load is cleared and rolling.'],
        ],
        'steps' => [
            ['t' => 'Quote & Documents', 'd' => 'Send make, model, serial, value, origin and destination. We return an all-in cross-border quote and a documents checklist.'],
            ['t' => 'Customs Pre-Clearance', 'd' => 'We prepare ACI/ACE filings, PARS/PAPS labels, and coordinate with your broker (or ours) for a clean entry.'],
            ['t' => 'Permits & Pilot Cars', 'd' => 'U.S. state and Canadian provincial oversize permits, pilot cars, route surveys — all booked in-house.'],
            ['t' => 'Pickup & Border Crossing', 'd' => 'Bonded carrier picks up, runs the lane, and clears the border — you get live GPS and status updates the whole way.'],
            ['t' => 'Delivery & POD', 'd' => 'Equipment delivered to final destination with signed POD, customs entry copies, and any provincial permit receipts.'],
        ],
        'highlights' => ['All U.S. states ↔ all Canadian provinces', 'CBSA bonded carriers · CTPAT / FAST', 'ACI / ACE eManifest filing in-house', 'PARS / PAPS pre-clearance labels', 'U.S. + provincial oversize permits', 'Real-time GPS + border status tracking', 'Bilingual dispatch (English / French Canada)', 'Net-30 terms for qualified importers/exporters'],
        'stats' => [['v' => '13', 'l' => 'Major Border Crossings Covered'], ['v' => '50', 'l' => 'U.S. States'], ['v' => '10', 'l' => 'Canadian Provinces'], ['v' => '24/7', 'l' => 'Cross-Border Dispatch']],
        'facts_title' => 'What You Should Know About U.S. – Canada Equipment Shipping',
        'facts' => [
            'All commercial equipment crossing the border requires an ACI eManifest (northbound) or ACE eManifest (southbound) filed at least one hour before arrival.',
            'PARS (Pre-Arrival Review System) and PAPS (Pre-Arrival Processing System) barcodes let customs review documents before the truck arrives — cutting wait times from hours to minutes.',
            'Used equipment may require EPA, Transport Canada, or environmental compliance documentation in addition to standard customs entry.',
            'Oversize loads need separate U.S. state permits AND Canadian provincial permits — both must be in hand before crossing.',
            'CTPAT (U.S.) and PIP (Canada) certified carriers move through FAST lanes for expedited clearance.',
            "Duties and taxes (GST/HST) are typically the responsibility of the importer of record — we'll connect you with a licensed customs broker if you don't already have one.",
        ],
        'faqs' => [
            ['q' => 'Do I need a customs broker to ship equipment from the U.S. to Canada?', 'a' => 'Most commercial shipments require a licensed Canadian customs broker (or self-clearance with a CBSA business number). We work with several preferred brokers and can introduce you — or work seamlessly with your existing broker.'],
            ['q' => 'How long does customs clearance at the border take?', 'a' => 'With PARS/PAPS pre-clearance and CTPAT/FAST carriers, most loads clear in 15–45 minutes. Without pre-clearance, expect 2–6 hours depending on the crossing and time of day.'],
            ['q' => 'Can you ship oversize loads across the border?', 'a' => 'Yes — we handle U.S. state permits, Canadian provincial permits (MTO Ontario, SAAQ Quebec, Alberta TRAVIS, BC, etc.), pilot cars, and route surveys end-to-end.'],
            ['q' => 'Which border crossings do you use most?', 'a' => 'Pacific Highway (BC/WA), Sweetgrass-Coutts (MT/AB), Pembina-Emerson (ND/MB), Sault Ste. Marie (MI/ON), Detroit-Windsor (MI/ON), Buffalo-Fort Erie (NY/ON), Champlain-Lacolle (NY/QC). We choose the crossing based on routing, hours, and load size.'],
            ['q' => 'Do you provide cross-border insurance?', 'a' => 'Yes — up to $1M cargo coverage valid on both sides of the border, plus full liability. COIs naming your customs broker, lender, or buyer issued in 15 minutes.'],
        ],
        'cta_title' => 'Get Your Cross-Border Quote',
        'service_gallery' => [
            ['title' => 'Pacific Highway Crossing', 'desc' => 'Daily lanes BC ↔ WA with CTPAT / FAST carriers staged at the border.'],
            ['title' => 'Alberta & Prairie Lanes', 'desc' => 'Heavy iron into Edmonton, Calgary, Saskatoon and back south for oil & gas.'],
            ['title' => 'CBSA Bonded Paperwork', 'desc' => 'ACI / ACE filings, PARS / PAPS labels, B3 entries — handled in-house.'],
            ['title' => 'Detroit ↔ Windsor', 'desc' => 'Ambassador & Gordie Howe crossings — Ontario, Quebec and the U.S. Midwest.'],
        ],
    ],

    'mexico-shipping-service' => [
        'eyebrow' => 'Cross-Border · USA ↔ Mexico',
        'hero_badge' => 'Bonded Carriers · SAT / Aduanas · CBP',
        'hero_title_lead' => 'USA – Mexico',
        'hero_title_accent' => 'Heavy Haul Shipping',
        'hero_sub' => 'Bilingual cross-border heavy haul between the U.S. and Mexico. We coordinate U.S. permits, CBP clearance, bonded drayage across the line, and the Mexican carrier handoff — built for importers, exporters, OEM plants, and equipment dealers shipping into and out of Mexico.',
        'intro_title' => 'End-to-End USA – Mexico Equipment Logistics',
        'intro_body' => [
            'Shipping equipment to a maquiladora in Monterrey? Importing a Caterpillar excavator back from a Mexican job? Buying at an auction in Mexico for resale in the U.S.? We move it bonded, documented, and delivered — coordinating U.S. carriers, Mexican carriers, and customs on both sides.',
            'Our bilingual dispatch team is staged near the busiest commercial crossings — Laredo / Nuevo Laredo (World Trade Bridge & Colombia), Otay Mesa / Tijuana, El Paso / Ciudad Juárez, Pharr / Reynosa, and Eagle Pass. We file U.S. ACE eManifests, coordinate Pedimento with your Mexican customs broker, and run bonded drayage across the line.',
            'Importers and exporters get one quote, one bilingual point of contact, real-time GPS, and full transparency on customs status — no broken handoffs, no language barriers, no surprise charges.',
        ],
        'pillars' => [
            ['icon' => 'Languages', 'title' => 'Bilingual Dispatch (EN / ES)', 'desc' => 'Native Spanish-speaking dispatchers coordinate directly with Mexican carriers, brokers, and shippers.'],
            ['icon' => 'FileText', 'title' => 'Pedimento & Customs Coordination', 'desc' => 'We work with your Mexican customs broker (or introduce you to one) for clean Pedimento entry and IMMEX compliance.'],
            ['icon' => 'Anchor', 'title' => 'Bonded Drayage Across the Line', 'desc' => 'Bonded transfer at Laredo, Otay Mesa, El Paso, Pharr, and Eagle Pass — your equipment never sits unattended.'],
            ['icon' => 'ShieldCheck', 'title' => 'CTPAT / OEA-Certified Carriers', 'desc' => 'U.S. CTPAT and Mexican OEA partner carriers move through FAST lanes for faster clearance.'],
            ['icon' => 'Building2', 'title' => 'Maquiladora & IMMEX-Ready', 'desc' => 'We ship into and out of IMMEX/maquiladora facilities daily — production equipment, tooling, and finished goods.'],
            ['icon' => 'Radio', 'title' => 'Live Crossing Status', 'desc' => 'Real-time updates as your load moves through the U.S. port, the bridge, and Mexican customs.'],
        ],
        'steps' => [
            ['t' => 'Quote & Compliance Check', 'd' => 'Equipment specs, origin/destination, value, and a documents checklist (commercial invoice, packing list, certificate of origin, USMCA cert if applicable).'],
            ['t' => 'U.S. Carrier & ACE Filing', 'd' => 'U.S. CTPAT carrier dispatched to origin. ACE eManifest filed in advance for fast CBP processing.'],
            ['t' => 'Bonded Drayage & Pedimento', 'd' => 'Bonded drayage carrier crosses the bridge. Your Mexican broker files Pedimento for SAT/Aduanas clearance.'],
            ['t' => 'Mexican Carrier Handoff', 'd' => 'OEA-certified Mexican carrier picks up south of the border and delivers to final destination — Monterrey, Saltillo, CDMX, Guadalajara, anywhere.'],
            ['t' => 'Delivery & POD', 'd' => 'Signed proof of delivery, customs entry copies, and Pedimento receipts returned to you with the final invoice.'],
        ],
        'highlights' => ['Bilingual dispatch (EN / ES)', 'Laredo · Otay Mesa · El Paso · Pharr · Eagle Pass', 'ACE filing + Pedimento coordination', 'USMCA / T-MEC certificate of origin', 'CTPAT (U.S.) + OEA (Mexico) carriers', 'Bonded drayage across the line', 'IMMEX / maquiladora-ready', 'Real-time GPS both sides of the border'],
        'stats' => [['v' => '5', 'l' => 'Major Commercial Crossings'], ['v' => '32', 'l' => 'Mexican States Served'], ['v' => 'EN/ES', 'l' => 'Bilingual Dispatch'], ['v' => '24/7', 'l' => 'Cross-Border Support']],
        'facts_title' => 'What You Should Know About U.S. – Mexico Equipment Shipping',
        'facts' => [
            'Commercial equipment crossing into Mexico requires a Pedimento (Mexican customs declaration) filed by a licensed Mexican customs broker (agente aduanal).',
            'USMCA (T-MEC) certificate of origin can eliminate or reduce duties on qualifying equipment — we\'ll help you confirm eligibility.',
            'Most freight enters Mexico via bonded drayage — a short-haul carrier moves the load across the bridge before a long-haul Mexican carrier takes it inland.',
            'Maquiladora / IMMEX facilities can import production equipment under temporary import provisions, with the right documentation.',
            'U.S. CBP requires ACE eManifest at least one hour before truck arrival. Mexican SAT requires Pedimento before crossing.',
            'Northbound (Mexico → U.S.) returns work the same way in reverse — Pedimento de exportación, bonded drayage, CBP entry, U.S. carrier final delivery.',
        ],
        'faqs' => [
            ['q' => 'Do you handle Mexican customs paperwork?', 'a' => 'We coordinate with your Mexican customs broker (agente aduanal) — or introduce you to one of our preferred partners. Pedimento, USMCA certificate of origin, and IMMEX paperwork are all coordinated through that relationship.'],
            ['q' => 'Which crossings do you use most?', 'a' => 'Laredo / Nuevo Laredo (World Trade Bridge and Colombia Solidarity Bridge) handles the majority of our heavy haul traffic. We also run Otay Mesa, El Paso, Pharr, and Eagle Pass depending on origin and destination.'],
            ['q' => 'Can you ship into a maquiladora?', 'a' => 'Yes — we deliver into IMMEX / maquiladora facilities daily, including temporary import shipments for production equipment, tooling, and machinery.'],
            ['q' => 'How long does Mexican customs take?', 'a' => 'With Pedimento filed in advance and a CTPAT/OEA carrier, most loads clear in 1–4 hours at Laredo. Random inspections can extend that — we monitor and update you live.'],
            ['q' => 'Is my equipment insured on both sides of the border?', 'a' => 'Yes — up to $1M cargo on the U.S. leg, and we confirm equivalent Mexican carrier cargo coverage before the handoff. COIs available for both legs.'],
        ],
        'cta_title' => 'Get Your Mexico Shipping Quote',
        'service_gallery' => [
            ['title' => 'Laredo World Trade Bridge', 'desc' => 'The busiest commercial crossing on the southern border — daily heavy haul lanes.'],
            ['title' => 'Monterrey & Maquiladora Lanes', 'desc' => 'Production equipment into IMMEX facilities under temporary import provisions.'],
            ['title' => 'El Paso ↔ Ciudad Juárez', 'desc' => 'Bonded drayage and southbound Mexican carrier handoff coordinated end-to-end.'],
            ['title' => 'Pedimento & SAT Clearance', 'desc' => 'Coordinated with your agente aduanal — or we introduce you to one of ours.'],
        ],
    ],

    'catastrophic-recovery' => [
        'eyebrow' => '24/7 Emergency Response',
        'hero_badge' => 'Rapid Response · Cranes · Rotators · Bonded',
        'hero_title_lead' => 'Catastrophic',
        'hero_title_accent' => 'Recovery Services',
        'hero_sub' => "Professional catastrophic recovery services for heavy equipment caught in accidents, rollovers, severe weather, and high-stakes incidents. When standard towing can't handle it, we mobilize cranes, rotators, winches, and multi-axle transport — fast, safe, and fully insured.",
        'intro_title' => "When Every Minute Counts — We're Already Moving",
        'intro_body' => [
            "Catastrophic recovery is the urgent response, removal, and transport of large or damaged equipment that can't be moved using standard towing methods. Whether your iron is overturned on a remote highway, half-submerged after a flood, or sitting in the path of an active wildfire — fast, professional recovery is the difference between prolonged downtime and getting your business back on track.",
            'Heavy Haul Group delivers catastrophic recovery designed for speed, safety, and efficiency. We coordinate every step, handling complex equipment safely while minimizing disruption to your operation. Our recovery specialists are trained, our fleet is fully equipped, and our dispatch never closes.',
            "Whether you're an individual owner-operator, a fleet manager, an insurance adjuster, or a Fortune-500 operations team — when you need catastrophic recovery, you need it now. One call, one team, one invoice.",
        ],
        'pillars' => [
            ['icon' => 'Compass', 'title' => 'Fast, Detailed Project Planning', 'desc' => 'Site evaluation to assess the best recovery approach based on equipment type, location, and condition. Customized strategy for lifting, positioning, and transport.'],
            ['icon' => 'FileCheck', 'title' => 'Local, State & Federal Compliance', 'desc' => 'We manage all permits and regulatory requirements — public roads, restricted areas, environmental zones. All paperwork handled in-house.'],
            ['icon' => 'Wrench', 'title' => 'Fully Equipped Recovery Fleet', 'desc' => 'Cranes, rotators, winches, flatbeds, lowboys, and multi-axle transport units to handle oversized or damaged equipment safely.'],
            ['icon' => 'Radio', 'title' => 'Real-Time Communication', 'desc' => "Your logistics coordinator provides live updates on recovery progress — you know exactly what's happening at every moment."],
            ['icon' => 'HardHat', 'title' => 'Trained Recovery Specialists', 'desc' => 'Drivers and recovery specialists trained to safely lift, stabilize, and transport damaged or unstable machinery.'],
            ['icon' => 'ShieldCheck', 'title' => 'Transparent, Upfront Pricing', 'desc' => 'Clear, no-surprise cost estimates. We pride ourselves on no hidden fees, even on emergency response calls.'],
        ],
        'steps' => [
            ['t' => 'Emergency Call & Triage', 'd' => '24/7 dispatch answers, captures location, equipment type, and incident details. Recovery team mobilized within the hour.'],
            ['t' => 'Site Assessment', 'd' => 'On-site recovery specialist evaluates the situation, hazards, ground conditions, and recommends the safest lift and transport plan.'],
            ['t' => 'Permits & Authority Coordination', 'd' => 'Permits filed, local DOT and law enforcement coordinated, road closures arranged if needed.'],
            ['t' => 'Lift, Stabilize, Load', 'd' => 'Crane or rotator lift, stabilization of damaged equipment, and secured loading onto the appropriate transport trailer.'],
            ['t' => 'Transport to Repair or Storage', 'd' => 'Delivery to your repair facility, storage yard, insurance lot, or wherever the equipment needs to go next.'],
        ],
        'highlights' => ['24/7 emergency dispatch — always answered', 'Rollover and overturn recovery', 'Flood, storm, and wildfire response', 'Crane and rotator lifts on-site', 'Multi-axle transport for damaged iron', 'Insurance & adjuster coordination', 'Environmental compliance', 'Hazmat-aware recovery teams'],
        'stats' => [['v' => '<60', 'l' => 'Min. Dispatch Time'], ['v' => '24/7', 'l' => 'Live Operators'], ['v' => '75T+', 'l' => 'Rotator Capacity'], ['v' => '50', 'l' => 'States Covered']],
        'facts_title' => 'What is Catastrophic Recovery Equipment Shipping?',
        'facts' => [
            'Catastrophic recovery covers any incident where standard towing won\'t work — rollovers, accidents, weather damage, sinkholes, fires.',
            'Speed matters: every hour of equipment downtime can cost a contractor thousands in lost production and rental.',
            'Damaged equipment often requires custom rigging — direct lifting points may be compromised, and load shifts are a real safety risk.',
            'Insurance carriers and adjusters need clean documentation: photos, weights, damage reports, and a clear chain of custody.',
            'Many recoveries require local DOT, state police, and environmental agency coordination — all handled in-house by our team.',
            'Recoveries on private property, jobsites, and public roadways all have different permitting and access requirements.',
        ],
        'faqs' => [
            ['q' => 'How fast can you respond to an emergency recovery?', 'a' => 'Our dispatch is staffed 24/7/365 and answers within seconds. We mobilize a recovery team typically within 30–60 minutes of the call, with on-site arrival depending on distance — most U.S. metros within 2–4 hours.'],
            ['q' => 'Do you work directly with insurance companies?', 'a' => "Yes — we coordinate with insurance adjusters, provide photo documentation, damage assessments, and clean invoicing for claims. We've worked with every major commercial carrier."],
            ['q' => 'What if my equipment is on a busy highway?', 'a' => 'We coordinate directly with local DOT and state police to set up safe road closures, traffic control, and lane shifts. Our recovery specialists are trained for high-traffic incident response.'],
            ['q' => 'Can you recover equipment in remote or off-road locations?', 'a' => 'Yes — we have crawler cranes, winches, and off-road recovery rigs for jobsite, off-highway, mining, and pipeline recoveries.'],
            ['q' => 'How much does catastrophic recovery cost?', 'a' => 'It varies with equipment size, location, damage, and required rigging — but we provide a clear upfront estimate before mobilizing. No hidden fees, no surprise charges. Insurance often covers most or all of the cost.'],
        ],
        'cta_title' => 'Need Emergency Recovery Now?',
        'service_gallery' => [
            ['title' => 'Overturn & Rollover', 'desc' => 'Lifting equipment back upright with rotators and cranes.'],
            ['title' => 'Flood & Storm Response', 'desc' => 'Recovering iron from flooded sites and storm aftermath.'],
            ['title' => 'Highway Incidents', 'desc' => 'Fast-clear recoveries on active highways and interstates.'],
            ['title' => 'Wildfire & Hazard Zones', 'desc' => 'Loading damaged equipment from fire and hazard zones.'],
        ],
    ],

    'rigging-and-lifting-service' => [
        'eyebrow' => 'Plant Moves · Machinery Installs · Heavy Lifts',
        'hero_badge' => 'Millwright · Cranes · Jacking & Skating',
        'hero_title_lead' => 'Rigging &',
        'hero_title_accent' => 'Lifting Services',
        'hero_sub' => 'Heavy rigging, lifting, and millwright services for plant relocations, machinery installations, oversize loading, and precision equipment placement. Mobile cranes, crawler cranes, hydraulic gantries, jacking & skating, and full-service rigging crews — all under one roof.',
        'intro_title' => 'Precision Rigging for Heavy & Sensitive Equipment',
        'intro_body' => [
            "Rigging and lifting is more than picking something up with a crane — it's engineered planning, certified rigging crews, the right gear for the lift, and a complete understanding of weights, centers of gravity, and ground conditions. Whether you're loading a 100-ton press onto a multi-axle trailer or moving a CNC machine into a new plant, we plan and execute the lift end-to-end.",
            'Our rigging and millwright teams handle plant relocations, machinery installs, oversize loading and unloading, and precision equipment placement inside facilities. We bring our own cranes, hydraulic gantries, Versa-Lifts, jacking and skating equipment, riggers, and a project manager who owns the move from quote to sign-off.',
            'Manufacturers, machine shops, power plants, and contractors trust us because we plan the lift, engineer the rigging, pull the permits, coordinate with the millwrights, and put the iron exactly where it needs to go — on time, in spec, with zero damage.',
        ],
        'pillars' => [
            ['icon' => 'HardHat', 'title' => 'Mobile & Crawler Crane Lifts', 'desc' => 'Hydraulic mobile cranes (50T–500T+) and crawler cranes for confined sites, multi-pick lifts, and tandem operations.'],
            ['icon' => 'Wrench', 'title' => 'Jacking & Skating', 'desc' => "Hydraulic jacks, air skates, and rolling systems to move equipment inside facilities where cranes can't reach."],
            ['icon' => 'Forklift', 'title' => 'Versa-Lifts & Hydraulic Gantries', 'desc' => 'Up to 60-ton Versa-Lifts and hydraulic gantry systems for in-plant heavy moves and tight-clearance lifts.'],
            ['icon' => 'Truck', 'title' => 'Loading & Unloading', 'desc' => 'Oversize and overweight loading onto lowboys, RGNs, step decks, and Schnabel trailers.'],
            ['icon' => 'Building2', 'title' => 'Millwright & Plant Rigging', 'desc' => 'Full plant relocations, machine line moves, anchor bolt installs, and precision leveling.'],
            ['icon' => 'FileCheck', 'title' => 'Engineered Lift Plans', 'desc' => 'Stamped lift plans, rigging calculations, ground bearing analysis, and OSHA-compliant lift documentation.'],
        ],
        'steps' => [
            ['t' => 'Site Walk & Lift Engineering', 'd' => 'Site walk, weights/CG verification, crane selection, rigging design, and an engineered lift plan.'],
            ['t' => 'Permits & Coordination', 'd' => 'Road closures, building permits, coordination with facility EHS, electrical, and HVAC trades.'],
            ['t' => 'Mobilization', 'd' => 'Cranes, riggers, gantries, jacks, and rigging gear delivered to the site on schedule.'],
            ['t' => 'Execute the Lift', 'd' => 'Pre-lift safety briefing, signal-coordinated lift, precise placement or load-out onto transport.'],
            ['t' => 'Demobilize & Document', 'd' => 'Clean demob, sign-off documentation, photos, and lift records delivered to the client.'],
        ],
        'highlights' => ['Mobile cranes 50T – 500T+', 'Crawler cranes for confined sites', 'Hydraulic gantries to 250T', 'Versa-Lift 25T / 40T / 60T', 'Jacking, skating, and rolling', 'Engineered lift plans (stamped)', 'Millwright & plant rigging crews', 'OSHA-compliant safety program'],
        'stats' => [['v' => '500T+', 'l' => 'Crane Capacity'], ['v' => 'OSHA', 'l' => 'Compliant Safety'], ['v' => 'NCCCO', 'l' => 'Certified Operators'], ['v' => '24/7', 'l' => 'Project Dispatch']],
        'facts_title' => 'Why Engineered Rigging Matters',
        'facts' => [
            'Every lift over a critical threshold (typically 75% of crane capacity or any lift over $1M asset value) should have an engineered, stamped lift plan.',
            'NCCCO-certified crane operators and qualified riggers/signalpersons are required by OSHA 1926 Subpart CC for most commercial lifts.',
            'Ground bearing pressure matters — crane mats and outrigger pads are calculated from soil bearing capacity, not just crane weight.',
            'Sensitive equipment (CNCs, transformers, presses) often has manufacturer-specified lift points and rigging requirements — we follow them.',
            'Tandem lifts (two cranes lifting one load) require engineered load distribution and synchronized signals.',
            "In-plant moves often beat crane lifts on cost when jacking and skating can do the job — we'll recommend the right method.",
        ],
        'faqs' => [
            ['q' => 'Do you provide engineered lift plans?', 'a' => 'Yes — for any critical or oversize lift we provide a stamped engineered lift plan covering crane selection, rigging design, ground bearing, and step-by-step procedure.'],
            ['q' => 'Can you handle full plant relocations?', 'a' => 'Yes — from disconnect through reinstall, including millwrighting, rigging, transport, anchor bolt installs, leveling, and final reconnection coordination.'],
            ['q' => 'Do you have your own cranes or do you sub them?', 'a' => 'We operate our own fleet of mobile cranes, crawler cranes, hydraulic gantries, and Versa-Lifts, and partner with specialty crane companies for ultra-heavy or specialty lifts (500T+, ringer cranes, etc.).'],
            ['q' => 'Are your operators and riggers certified?', 'a' => 'All crane operators are NCCCO-certified, and all riggers/signalpersons hold current rigging and signal certifications. We carry full OSHA, MSHA, and contractor safety documentation.'],
            ['q' => 'Can you lift inside a building with low clearance?', 'a' => "Yes — that's exactly where Versa-Lifts, hydraulic gantries, and jacking-and-skating systems shine. We've executed in-plant moves under 12 ft of clearance."],
        ],
        'cta_title' => 'Plan Your Heavy Lift With Us',
        'service_gallery' => [
            ['title' => 'Heavy Mobile Crane Picks', 'desc' => '50T–500T+ mobile cranes for plant moves, machinery installs and load-outs.'],
            ['title' => 'Hydraulic Gantry Systems', 'desc' => "In-plant lifts where cranes can't fit — gantries, jacking and air skates."],
            ['title' => 'Crawler Crane Operations', 'desc' => 'Tandem picks and confined-site lifts with full engineered lift plans.'],
        ],
    ],

    'pilot-car-service' => [
        'eyebrow' => 'Escort Vehicles for Wide Loads',
        'hero_badge' => 'Certified Operators · All 50 States',
        'hero_title_lead' => 'Pilot Car &',
        'hero_title_accent' => 'Escort Vehicle Service',
        'hero_sub' => 'Certified pilot cars and escort vehicles for oversize and superload moves across all fifty states. Lead, chase, high-pole, and route survey services — all coordinated through one dispatch so your oversize load moves safely, legally, and on schedule.',
        'intro_title' => 'Escort Vehicles for Wide Loads Available in All Fifty States',
        'intro_body' => [
            'Each state has various laws and regulations about when pilot cars are necessary for oversize loads. When you transport freight with Heavy Haul Group, our logistics agents make sure your load is safely and legally transported based on the requirements of each state. This ensures the safety of your heavy equipment, along with the team transporting it.',
            'Escort vehicles and pilot cars help navigate your load through traffic, reducing the risk of hazards or dangerous obstacles in the road. They make the heavy transport safer for everyone — your driver, your equipment, and the public driving alongside.',
            'While you can use an independent pilot car directory to find drivers in your area, at Heavy Haul Group we only work with the best. Our escort vehicle drivers are vetted to ensure they know the proper regulations and have the experience to move your oversize load safely. One call, one dispatcher — we book the haul and the pilot cars together.',
        ],
        'pillars' => [
            ['icon' => 'Compass', 'title' => 'Lead & Chase Pilot Cars', 'desc' => 'Certified pilot operators positioned ahead of and behind your load to warn traffic, watch clearances, and signal the driver.'],
            ['icon' => 'AlertTriangle', 'title' => 'High-Pole Pilot Cars', 'desc' => 'Adjustable height-pole vehicles that verify every overhead obstruction — bridges, signs, utility lines — before your load reaches them.'],
            ['icon' => 'MapPin', 'title' => 'Route Surveys', 'desc' => 'Pre-trip route surveys identifying low bridges, sharp turns, weight-restricted bridges, and required detours for superloads.'],
            ['icon' => 'ShieldCheck', 'title' => 'Certified & Vetted Operators', 'desc' => 'Every pilot car operator is certified to the state requirements they work in — Florida, Utah, Washington, and others have strict certification standards.'],
            ['icon' => 'Radio', 'title' => 'Police Escort Coordination', 'desc' => 'For superloads requiring law enforcement escort, we coordinate state police, county, and local agency escorts.'],
            ['icon' => 'Truck', 'title' => 'One-Call Bundled Dispatch', 'desc' => 'Book the heavy haul and the pilot cars together — one quote, one dispatcher, one invoice. No coordination headaches.'],
        ],
        'steps' => [
            ['t' => 'Quote With Pilot Cars Bundled', 'd' => "Send your load dimensions and lane — we quote the haul and the required pilot cars together based on each state's rules."],
            ['t' => 'Route Survey (If Required)', 'd' => 'For superloads, a pre-trip route survey identifies low bridges, sharp curves, and required detours.'],
            ['t' => 'Permits & Escort Booking', 'd' => 'Permits filed for each state. Certified pilot car operators booked and confirmed for every leg of the move.'],
            ['t' => 'Roll', 'd' => 'Lead, chase, and high-pole pilots in position. Live coordination between drivers and dispatch through the whole haul.'],
            ['t' => 'Delivery & Paperwork', 'd' => 'Signed POD, pilot car logs, and any state-required documentation returned with the final invoice.'],
        ],
        'highlights' => ['Lead pilot cars', 'Chase pilot cars', 'High-pole / height verification', 'Route surveys for superloads', 'Police escort coordination', 'Certified in all 50 states', 'State-specific certification (FL, UT, WA, NY)', 'Bundled with heavy haul booking'],
        'stats' => [['v' => '50', 'l' => 'States Covered'], ['v' => '100%', 'l' => 'Certified Operators'], ['v' => '24/7', 'l' => 'Dispatch'], ['v' => '1-Call', 'l' => 'Bundled Booking']],
        'facts_title' => 'Facts to Know About Pilot Car & Escort Vehicle Regulations',
        'facts' => [
            'Pilot car regulations vary by state, but must be adhered to in order to comply with traffic laws.',
            'Escort vehicles help oversize and wide loads avoid any hazards on the road.',
            'Pilot car drivers contribute to road safety as they are authorized to stop traffic and direct the movement of oversize loads through high-traffic areas that may cause a danger to the public.',
            'Escort vehicles are a signal to other drivers of an oversize or wide load, so they can also take precautions when driving near.',
            'Pilot car drivers must be certified to know the laws of the road and ensure they are providing the best possible safety measures.',
            'Pilot cars and escort vehicles add overall safety — not only for the heavy equipment transport, but for the team hauling and the public driving around it.',
        ],
        'faqs' => [
            ['q' => 'When do I need a pilot car?', 'a' => 'Requirements vary by state, but generally any load over 12 ft wide, 14 ft 6 in tall, or 90 ft long needs at least one pilot car. Superloads (over 16 ft wide or 16 ft tall) typically require lead AND chase pilot cars plus possible high-pole and police escort.'],
            ['q' => 'Do you provide pilot cars in every state?', 'a' => 'Yes — our network covers all 50 states. We match pilot car operators who hold the specific certifications required by each state (Florida, Utah, Washington, New York, and others have unique requirements).'],
            ['q' => 'What is a high-pole pilot car?', 'a' => 'A high-pole vehicle has an adjustable height pole set to the height of your load. It drives ahead and physically tests every overhead obstruction — bridges, signs, utilities — to verify clearance before your load arrives.'],
            ['q' => 'Can I book pilot cars without booking the haul through you?', 'a' => 'Yes — we provide pilot car services standalone if you only need escort vehicles. Just send your route, load dimensions, and dates.'],
            ['q' => 'How much do pilot cars cost?', 'a' => 'Typically $1.75 – $2.75 per mile per pilot car, with state-specific minimums and additional fees for high-pole or specialty escorts. We quote it bundled with the haul or standalone — your choice.'],
        ],
        'cta_title' => 'Book Pilot Cars With Your Haul',
        'service_gallery' => [
            ['title' => 'Lead Pilot Cars', 'desc' => 'OVERSIZE LOAD banners, flashing lights, warning traffic ahead of your load.'],
            ['title' => 'High-Pole Verification', 'desc' => 'Adjustable height poles physically test every overhead obstruction first.'],
            ['title' => 'Chase & Long-Haul Escort', 'desc' => 'Chase units stay with your load coast-to-coast through every state.'],
        ],
    ],

    'heavy-machinery-towing' => [
        'eyebrow' => 'Heavy-Duty Wrecker & Rotator Service',
        'hero_badge' => 'Rotators · Heavy Wreckers · Lowboy Recovery',
        'hero_title_lead' => 'Heavy Machinery',
        'hero_title_accent' => 'Towing & Recovery',
        'hero_sub' => 'Heavy-duty wrecker and rotator service for stranded construction equipment, semi trucks, and oversize loads. 75-ton-plus rotators, integrated heavy wreckers, and lowboy recovery — dispatched 24/7 across the country.',
        'intro_title' => "When It's Too Big For a Tow Truck — Call Us",
        'intro_body' => [
            "Standard tow trucks can't handle a loaded semi on its side, an overturned excavator, or a disabled lowboy in the median. Heavy machinery towing is a different category — rotators, heavy wreckers, multi-axle lowboys, and rigging crews trained to recover the big stuff safely.",
            'Our heavy recovery fleet runs 75-ton-plus rotators, integrated heavy wreckers, and recovery lowboys for disabled or wrecked equipment. We respond to highway incidents, jobsite breakdowns, and remote recoveries — fast, insured, and with the right gear for the lift.',
            'Insurance adjusters, fleet managers, contractors, and DOTs call us because we recover the load, document the scene, and get the road or jobsite back open — without secondary damage and without the runaround.',
        ],
        'pillars' => [
            ['icon' => 'LifeBuoy', 'title' => 'Rotator Towing (75T+)', 'desc' => 'Heavy rotators for overturned semis, wrecked equipment, and complex lift-and-set recoveries.'],
            ['icon' => 'Truck', 'title' => 'Heavy & Integrated Wreckers', 'desc' => 'Tandem-steer integrated wreckers for disabled tractors, dumps, garbage trucks, and vocational vehicles.'],
            ['icon' => 'Wrench', 'title' => 'Lowboy Recovery', 'desc' => 'Disabled construction equipment loaded onto multi-axle lowboys for transport to a repair facility or yard.'],
            ['icon' => 'Compass', 'title' => 'Off-Road & Jobsite Recovery', 'desc' => 'Stuck dozers, stuck cranes, ditch recoveries — winches, mats, and tracked recovery rigs for off-highway work.'],
            ['icon' => 'Radio', 'title' => '24/7 Live Dispatch', 'desc' => 'Our heavy recovery line is always answered. Average dispatch time under one hour for highway incidents.'],
            ['icon' => 'ShieldCheck', 'title' => 'Insurance-Friendly Documentation', 'desc' => 'Photos, weight tickets, scene reports, and clean invoicing — we work directly with adjusters and fleet managers.'],
        ],
        'steps' => [
            ['t' => 'Emergency Call', 'd' => '24/7 dispatch captures location, equipment, and incident details. Recovery rig assigned within minutes.'],
            ['t' => 'On-Site Assessment', 'd' => 'Recovery specialist evaluates the safest recovery method — winch, rotator lift, or lowboy load.'],
            ['t' => 'Traffic Control & Permits', 'd' => 'Coordination with state police, DOT, and local agencies for safe lane closures and recovery.'],
            ['t' => 'Recover & Transport', 'd' => 'Equipment safely uprighted, secured, and transported to your repair facility or storage yard.'],
            ['t' => 'Documentation & Invoice', 'd' => 'Photo documentation, recovery report, and clean invoicing for insurance or fleet records.'],
        ],
        'highlights' => ['75-ton + rotator service', 'Integrated heavy wreckers', 'Multi-axle lowboy recovery', 'Highway and jobsite response', 'Off-road / ditch recovery', 'Insurance documentation', '24/7 live dispatch', 'Nationwide coverage'],
        'stats' => [['v' => '75T+', 'l' => 'Rotator Capacity'], ['v' => '<60', 'l' => 'Min. Dispatch'], ['v' => '24/7', 'l' => 'Live Operators'], ['v' => '50', 'l' => 'States']],
        'facts_title' => 'Heavy Recovery vs. Standard Towing',
        'facts' => [
            "Anything over 26,000 lbs GVW or oversize equipment requires a heavy wrecker — standard rollback tow trucks aren't rated for it.",
            'Rotators (75-ton+) are required for upright recoveries of loaded semis, tankers, and overturned equipment.',
            'Secondary damage during recovery is a major risk — using the wrong gear can turn a $50K repair into a $250K total loss.',
            'Most heavy recoveries on public roads require coordination with state DOT and law enforcement.',
            'Insurance carriers prefer documented, professional heavy recovery — clean scene reports speed up claims processing.',
            "Off-road recoveries often need crane mats, winch tractors, and rigging gear that standard tow operators don't carry.",
        ],
        'faqs' => [
            ['q' => "What's the difference between a rotator and a heavy wrecker?", 'a' => 'A rotator has a rotating boom (like a small crane) that can lift and reposition heavy loads from any angle — essential for overturned trucks. A heavy wrecker is built for pulling disabled trucks but doesn\'t have the same lift-and-reposition flexibility.'],
            ['q' => 'Can you recover equipment off-road?', 'a' => 'Yes — we have winch tractors, crawler recovery rigs, and crane mats for ditches, mud, soft ground, and remote jobsite recoveries.'],
            ['q' => 'Do you work with insurance companies?', 'a' => 'Yes — we provide clean photo documentation, scene reports, and invoicing that insurance adjusters and fleet managers can submit directly.'],
            ['q' => 'How fast can you arrive?', 'a' => 'Highway incidents in major metros typically see a recovery rig on-site within 60–90 minutes. Remote or off-road incidents depend on staging — call dispatch for an exact ETA.'],
            ['q' => 'Do you provide secondary transport after recovery?', 'a' => 'Yes — once recovered, we can transport the equipment on our own lowboys directly to your repair facility, dealer, or storage yard. One call covers recovery and transport.'],
        ],
        'cta_title' => 'Need Heavy Recovery Now?',
        'service_gallery' => [
            ['title' => 'Rotator Lift & Upright', 'desc' => 'Overturned semis and wrecked equipment uprighted with 75T+ rotators.'],
            ['title' => 'Integrated Heavy Wreckers', 'desc' => 'Disabled tractors, dumps and vocational vehicles back to the shop.'],
            ['title' => 'Lowboy Equipment Recovery', 'desc' => 'Stuck or disabled construction iron loaded onto multi-axle lowboys.'],
        ],
    ],

    'partial-load-shipping' => [
        'eyebrow' => 'LTL & Partial Truckload Heavy Haul',
        'hero_badge' => 'Pay Only For the Space You Use',
        'hero_title_lead' => 'Partial Load',
        'hero_title_accent' => 'Heavy Haul Shipping',
        'hero_sub' => 'LTL and partial truckload heavy haul service — pay only for the space your equipment uses. Step deck, flatbed, and RGN consolidations with the same insurance, tracking, and dispatch as a full truckload.',
        'intro_title' => 'Why Pay For a Whole Truck When You Only Need Half?',
        'intro_body' => [
            "Shipping a small skid steer, a mini excavator, a piece of attachment, or any equipment that doesn't fill a 48 ft trailer? Partial load shipping is the smart move — you pay only for the linear feet of trailer your load takes up, and we consolidate it with other freight running the same lane.",
            'Our LTL and partial truckload network runs daily on every major heavy haul lane in the country. You get the same $1M cargo insurance, real-time GPS tracking, and dedicated dispatcher as a full truckload — at a fraction of the cost.',
            'Dealers, auction buyers, contractors, and rental yards lean on partial loads to control freight spend without sacrificing service. We match your load to the right consolidation and quote you a transparent, all-in rate — no hidden fees, no broker games.',
        ],
        'pillars' => [
            ['icon' => 'Package', 'title' => 'Pay For What You Use', 'desc' => 'Linear-foot or per-cube pricing — only pay for the trailer space your equipment actually takes up.'],
            ['icon' => 'Truck', 'title' => 'Step Deck, Flatbed, RGN', 'desc' => 'Right trailer for the load — step decks for taller equipment, flatbeds for standard, RGNs for tracked/heavy partials.'],
            ['icon' => 'Clock', 'title' => 'Daily Lane Consolidations', 'desc' => 'We consolidate partial loads on every major U.S. lane daily — your equipment ships within days, not weeks.'],
            ['icon' => 'ShieldCheck', 'title' => 'Full $1M Cargo Coverage', 'desc' => 'Same insurance, same tracking, same dispatcher as a full truckload — even when you\'re sharing trailer space.'],
            ['icon' => 'Building2', 'title' => 'Dealer & Auction-Friendly', 'desc' => 'Frequent partial freight from Ritchie Bros, IronPlanet, Purple Wave, and dealer yards across the country.'],
            ['icon' => 'Radio', 'title' => 'Real-Time GPS Tracking', 'desc' => 'Live load tracking from pickup through delivery, regardless of consolidation stops.'],
        ],
        'steps' => [
            ['t' => 'Send Load Details', 'd' => 'Equipment dimensions, weight, origin, destination — we calculate linear feet and quote the partial rate.'],
            ['t' => 'Match To A Consolidation', 'd' => 'We match your load to a trailer running your lane within a few days — or stage a dedicated partial run if needed.'],
            ['t' => 'Pickup', 'd' => 'Our driver picks up at your origin and either consolidates en route or heads straight to the next pickup.'],
            ['t' => 'Track & Deliver', 'd' => 'Real-time GPS through the whole haul. Delivery scheduled with your contact at destination.'],
            ['t' => 'POD & Invoice', 'd' => 'Signed proof of delivery and a clean, itemized invoice — same paperwork as a full truckload.'],
        ],
        'highlights' => ['Linear-foot pricing', 'Daily lane consolidations', 'Step deck · flatbed · RGN options', '$1M cargo insured', 'Real-time GPS tracking', 'Dealer & auction-friendly', 'Same-week dispatch on most lanes', 'Net-30 terms available'],
        'stats' => [['v' => 'Daily', 'l' => 'Lane Consolidations'], ['v' => '$1M', 'l' => 'Cargo Insured'], ['v' => '50', 'l' => 'States'], ['v' => '30-50%', 'l' => 'Typical Savings vs. FTL']],
        'facts_title' => 'When Partial Load Makes Sense',
        'facts' => [
            'Partial loads typically save 30–50% vs. booking a full truckload when your equipment is under 20–25 linear feet.',
            'Skid steers, mini excavators, small dozers, attachments, and parts pallets are all ideal partial-load freight.',
            "Linear-foot pricing means a 10 ft load pays for 10 ft of trailer, not the whole 48 ft.",
            'Transit times are typically 1–3 days longer than a dedicated full truckload because of consolidation stops.',
            'All partial loads carry the same $1M cargo insurance and the same dispatcher accountability as a full truckload.',
            "Auction buyers love partial loads — winning one machine doesn't justify a whole trailer, and we move auction freight daily.",
        ],
        'faqs' => [
            ['q' => 'How is partial-load pricing calculated?', 'a' => 'By linear feet of trailer space your load occupies, plus weight if your load is unusually heavy for its footprint. We quote one all-in number — no hidden fees.'],
            ['q' => 'How long does partial shipping take?', 'a' => 'Most partials dispatch within 2–5 business days and transit 1–3 days longer than a full truckload depending on consolidation route.'],
            ['q' => 'Is my equipment insured on a partial load?', 'a' => 'Yes — full $1M cargo coverage on every load, partial or full. COIs available in 15 minutes.'],
            ['q' => 'Can I ship from an auction on a partial load?', 'a' => 'Absolutely — auction loads are some of our most common partial freight. We pick up at Ritchie Bros, IronPlanet, Purple Wave, and dealer yards daily.'],
            ['q' => 'What trailers do you use for partials?', 'a' => 'Step decks for taller equipment, flatbeds for standard, and RGNs for tracked or heavy partials. We match the right trailer to your specific load.'],
        ],
        'cta_title' => 'Get Your Partial Load Quote',
        'service_gallery' => [
            ['title' => 'Consolidated Flatbeds', 'desc' => 'Multiple shippers, one lane — costs split by linear feet.'],
            ['title' => 'Single-Machine Partials', 'desc' => 'Skid steers, mini excavators and attachments at LTL rates.'],
            ['title' => 'Palletized LTL Freight', 'desc' => 'Crated machinery parts, tooling and dealer inventory.'],
        ],
    ],
];

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

/** Find an existing post by post_type + slug, regardless of status. */
function hh_find_post_by_slug(string $post_type, string $slug): ?int {
    $q = new WP_Query([
        'post_type' => $post_type,
        'name' => $slug,
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'no_found_rows' => true,
    ]);
    return $q->posts ? (int) $q->posts[0] : null;
}

/** Create or update a post, returning [post_id, was_created]. */
function hh_upsert_post(string $post_type, string $slug, string $title): array {
    $existing_id = hh_find_post_by_slug($post_type, $slug);
    $postarr = [
        'post_type' => $post_type,
        'post_title' => $title,
        'post_name' => $slug,
        'post_status' => 'publish',
    ];
    if ($existing_id) {
        $postarr['ID'] = $existing_id;
        $post_id = wp_update_post($postarr, true);
        $created = false;
    } else {
        $post_id = wp_insert_post($postarr, true);
        $created = true;
    }
    if (is_wp_error($post_id)) {
        WP_CLI::error("Failed to upsert {$post_type} '{$slug}': " . $post_id->get_error_message());
    }
    return [(int) $post_id, $created];
}

function hh_lines_to_text(array $lines): string {
    return implode("\n", $lines);
}

/* ────────────────────────────────────────────────────────────────────────
 * Seed categories first (need slug => post_id map for subcategory parent_category).
 * ──────────────────────────────────────────────────────────────────────── */
$category_id_by_slug = [];
$cat_created_count = 0;
$cat_updated_count = 0;

foreach ($CATEGORIES as $slug => $cat) {
    [$post_id, $created] = hh_upsert_post('service_category', $slug, $cat['name']);
    $category_id_by_slug[$slug] = $post_id;

    $is_freight = in_array($slug, $FREIGHT_SLUGS, true);
    $template_type = $is_freight ? 'freight' : 'service';

    update_field('template_type', $template_type, $post_id);
    update_field('short', $cat['short'], $post_id);
    update_field('blurb', $cat['blurb'], $post_id);
    // hero_image: intentionally left blank — no matching image assets in this repo.

    if ($is_freight) {
        $equipment = $EQUIPMENT_LIST_BY_CAT[$slug] ?? [];
        update_field('equipment_list', hh_lines_to_text($equipment), $post_id);
        // gallery: intentionally skipped — Category.tsx's GALLERY_BY_CAT is images only
        // (no alt/title/desc per item), so there is no text content to port and no
        // image assets to attach.
    } else {
        $sc = $SERVICE_CONTENT[$slug];
        update_field('eyebrow', $sc['eyebrow'], $post_id);
        update_field('hero_badge', $sc['hero_badge'], $post_id);
        update_field('hero_title_lead', $sc['hero_title_lead'], $post_id);
        update_field('hero_title_accent', $sc['hero_title_accent'], $post_id);
        update_field('hero_sub', $sc['hero_sub'], $post_id);
        update_field('intro_title', $sc['intro_title'], $post_id);
        update_field('intro_body', hh_lines_to_text($sc['intro_body']), $post_id);
        update_field('pillars', $sc['pillars'], $post_id);
        update_field('steps', $sc['steps'], $post_id);
        update_field('highlights', hh_lines_to_text($sc['highlights']), $post_id);
        update_field('stats', $sc['stats'], $post_id);
        update_field('facts_title', $sc['facts_title'], $post_id);
        update_field('facts', hh_lines_to_text($sc['facts']), $post_id);
        update_field('faqs', $sc['faqs'], $post_id);
        update_field('cta_title', $sc['cta_title'], $post_id);
        // service_gallery: title/desc populated from ServiceDetail.tsx's GALLERIES;
        // the `src` image sub-field is left empty — no matching image assets.
        $gallery_rows = array_map(static function (array $item): array {
            return ['src' => '', 'title' => $item['title'], 'desc' => $item['desc']];
        }, $sc['service_gallery']);
        update_field('service_gallery', $gallery_rows, $post_id);
    }

    WP_CLI::log(($created ? 'Created' : 'Updated') . " service_category: {$slug} (#{$post_id})");
    $created ? $cat_created_count++ : $cat_updated_count++;
}

/* ────────────────────────────────────────────────────────────────────────
 * Seed subcategories.
 * ──────────────────────────────────────────────────────────────────────── */
$sub_created_count = 0;
$sub_updated_count = 0;

foreach ($CATEGORIES as $cat_slug => $cat) {
    $parent_id = $category_id_by_slug[$cat_slug];

    foreach ($cat['subcategories'] as $sub) {
        [$post_id, $created] = hh_upsert_post('service_subcategory', $sub['slug'], $sub['name']);

        update_field('parent_category', $parent_id, $post_id);
        update_field('blurb', $sub['blurb'], $post_id);
        update_field('custom_template', $sub['custom_template'] ?? '', $post_id);

        $brand_rows = array_map(static fn(string $name): array => ['name' => $name], $sub['brands']);
        update_field('brands', $brand_rows, $post_id);

        $trailer_rows = array_map(static fn(string $name): array => ['name' => $name], $sub['trailers']);
        update_field('trailers', $trailer_rows, $post_id);

        WP_CLI::log(($created ? 'Created' : 'Updated') . " service_subcategory: {$sub['slug']} (parent: {$cat_slug})");
        $created ? $sub_created_count++ : $sub_updated_count++;
    }
}

/* ────────────────────────────────────────────────────────────────────────
 * Summary
 * ──────────────────────────────────────────────────────────────────────── */
WP_CLI::success(sprintf(
    'Categories: %d created, %d updated. Subcategories: %d created, %d updated.',
    $cat_created_count,
    $cat_updated_count,
    $sub_created_count,
    $sub_updated_count
));
