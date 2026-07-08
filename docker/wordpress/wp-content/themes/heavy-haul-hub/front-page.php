<?php
/**
 * Ported from src/pages/Index.tsx (Home page) plus its inline components:
 * RecentShipmentsTicker, BrandMarquee, Gallery, UsaMap, CountUp, Guarantees,
 * DispatcherTeam, FAQ. All content-key lookups use page key "home" (or the
 * component's own page key, e.g. "guarantees"/"dispatchers"/"faq") to exactly
 * match the original useSiteContent() get() calls, fallback text included.
 *
 * SIMPLIFICATIONS (see final report for details):
 * - UsaMap.tsx (react-simple-maps + d3-geo animated state-by-state fill) is
 *   replaced with a static grid of all 50 state abbreviations (via hh_states())
 *   inside the same lg:col-span-8 / lg:col-span-4 layout.
 * - Gallery.tsx's video player + thumbnail rail is dropped (heavy-haul-loading.mp4
 *   / heavy-haul-transport.mp4 don't exist in this repo) — only the static photo
 *   grid section is ported, with the same real gallery photos.
 * - The "Why Us" shadcn/embla Carousel becomes a horizontally-scrollable,
 *   scroll-snap track with prev/next buttons (assets/js/main.js), not an
 *   infinite-loop carousel.
 */
get_header();

$hh_phone         = hh_setting('phone_primary');
$hh_phone_display = hh_setting('phone_primary_display');
$hh_phone_href    = hh_tel_href($hh_phone);

$hh_trust_badges = [
    ['icon' => 'shield-check', 'label' => hh_content('home', 'hero_trust_1', 'Fully Insured')],
    ['icon' => 'badge-check',  'label' => hh_content('home', 'hero_trust_2', 'DOT Compliant')],
    ['icon' => 'users',        'label' => hh_content('home', 'hero_trust_3', 'Expert Drivers')],
    ['icon' => 'map-pin',      'label' => hh_content('home', 'hero_trust_4', 'All 50 States')],
];

$hh_stats = [
    ['end' => 4.9, 'decimals' => 1, 'suffix' => '',  'label' => hh_content('home', 'stat_1_label', 'Avg. Rating'), 'sub' => hh_content('home', 'stat_1_sub', '2,400+ shippers')],
    ['end' => 15,  'decimals' => 0, 'suffix' => '+', 'label' => hh_content('home', 'stat_2_label', 'Years'),       'sub' => hh_content('home', 'stat_2_sub', 'In heavy haul')],
    ['end' => 12,  'decimals' => 0, 'suffix' => 'K+', 'label' => hh_content('home', 'stat_3_label', 'Loads'),      'sub' => hh_content('home', 'stat_3_sub', 'Delivered safely')],
    ['end' => 50,  'decimals' => 0, 'suffix' => '',  'label' => hh_content('home', 'stat_4_label', 'States'),      'sub' => hh_content('home', 'stat_4_sub', 'Nationwide coverage')],
];

$hh_why = [
    ['icon' => 'clock',        'title' => hh_content('home', 'why_1_title', 'Same / Next Day Dispatch'), 'desc' => hh_content('home', 'why_1_desc', 'Urgent loads moved within hours, not days.')],
    ['icon' => 'activity',     'title' => hh_content('home', 'why_2_title', 'Real-Time Updates'),        'desc' => hh_content('home', 'why_2_desc', 'Direct line to your dispatcher from pickup to delivery.')],
    ['icon' => 'users',        'title' => hh_content('home', 'why_3_title', 'Heavy Haul Specialists'),    'desc' => hh_content('home', 'why_3_desc', 'Decades of oversize and superload experience.')],
    ['icon' => 'dollar-sign',  'title' => hh_content('home', 'why_4_title', 'Competitive Pricing'),       'desc' => hh_content('home', 'why_4_desc', 'Transparent quotes, no hidden fees.')],
    ['icon' => 'map-pin',      'title' => hh_content('home', 'why_5_title', 'Nationwide Network'),        'desc' => hh_content('home', 'why_5_desc', 'Thousands of vetted carriers across all 50 states.')],
    ['icon' => 'shield-check', 'title' => hh_content('home', 'why_6_title', 'Fully Insured Loads'),       'desc' => hh_content('home', 'why_6_desc', 'Cargo and liability coverage on every shipment.')],
];

$hh_steps = [
    ['icon' => 'file-text',      'title' => hh_content('home', 'step_1_title', 'Request a Quote'),          'desc' => hh_content('home', 'step_1_desc', 'Share your route, equipment and timing.')],
    ['icon' => 'clipboard-list', 'title' => hh_content('home', 'step_2_title', 'Plan & Assign Carrier'),     'desc' => hh_content('home', 'step_2_desc', 'We secure permits and the right rig.')],
    ['icon' => 'truck',          'title' => hh_content('home', 'step_3_title', 'Pickup & Secure Transport'), 'desc' => hh_content('home', 'step_3_desc', 'Loaded, strapped, and on the road.')],
    ['icon' => 'package-check',  'title' => hh_content('home', 'step_4_title', 'Delivery & Confirmation'),   'desc' => hh_content('home', 'step_4_desc', 'Safe drop-off with proof of delivery.')],
];

// Homepage services grid — first 4 service_category posts (matches categories.slice(0,4)).
$hh_home_categories = get_posts([
    'post_type'      => 'service_category',
    'posts_per_page' => 4,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
]);

// Fallback card images matching each category's hardcoded src/data/categories.ts image,
// used whenever the hero_image ACF field hasn't been populated yet.
$hh_cat_fallback_images = [
    'construction-equipment-transport' => 'cat-construction.jpg',
    'agricultural-equipment-transport' => 'cat-agricultural.jpg',
    'industrial-machinery-transport'   => 'hero-industrial.jpg',
    'heavy-duty-truck-transport'       => 'hero-trucks.jpg',
    'canada-shipping-service'          => 'service-canada.jpg',
    'mexico-shipping-service'          => 'service-mexico.jpg',
    'catastrophic-recovery'            => 'service-catastrophic.jpg',
    'rigging-and-lifting-service'      => 'service-rigging.jpg',
    'heavy-machinery-towing'           => 'service-towing.jpg',
    'pilot-car-service'                => 'service-pilot.jpg',
    'partial-load-shipping'            => 'service-partial.jpg',
];

// Dispatcher team — hardcoded 4 members (matches DispatcherTeam.tsx's `defaults`), copy
// editable per-member via page key "dispatchers".
$hh_dispatcher_imgs = ['dispatcher-mike.jpg', 'dispatcher-sarah.jpg', 'dispatcher-carlos.jpg', 'dispatcher-danny.jpg'];
$hh_dispatcher_defaults = [
    ['name' => 'Mike',   'role' => 'Senior Dispatcher',    'years' => '12', 'online' => 'true'],
    ['name' => 'Sarah',  'role' => 'Permits & Routing',    'years' => '9',  'online' => 'true'],
    ['name' => 'Carlos', 'role' => 'Oversize Specialist',  'years' => '15', 'online' => 'true'],
    ['name' => 'Danny',  'role' => 'Heavy Haul Lead',      'years' => '11', 'online' => 'false'],
];
$hh_dispatcher_team = [];
foreach ($hh_dispatcher_defaults as $i => $d) {
    $n = $i + 1;
    $hh_dispatcher_team[] = [
        'name'   => hh_content('dispatchers', "m{$n}_name", $d['name']),
        'role'   => hh_content('dispatchers', "m{$n}_role", $d['role']),
        'years'  => hh_content('dispatchers', "m{$n}_years", $d['years']),
        'online' => hh_content('dispatchers', "m{$n}_online", $d['online']) === 'true',
        'img'    => $hh_dispatcher_imgs[$i],
    ];
}

// FAQ defaults — matches FAQ.tsx's exported FAQS array, editable via page key "faq".
$hh_faq_defaults = [
    ['q' => 'How much does heavy haul shipping cost?', 'a' => 'Most heavy haul shipments range from $2.50 to $5.50 per mile, depending on equipment size, weight, distance, and required permits. Use our instant quote calculator above for a real estimate in 60 seconds. Final pricing always includes permits, pilot cars (if needed), and full insurance — no hidden fees.'],
    ['q' => 'Are my loads fully insured?', 'a' => 'Yes. Every shipment is covered by $1,000,000 in cargo insurance and $1,000,000 in liability coverage. We can provide certificates of insurance for your project or jobsite within 15 minutes of booking.'],
    ['q' => 'How fast can you pick up my equipment?', 'a' => "Standard pickups happen within 24–48 hours. Urgent and same-day dispatch is available — we have 12,000+ vetted carriers across all 50 states, so there's almost always a rig within a few hours of your pickup location."],
    ['q' => 'Do you handle permits and pilot cars?', 'a' => "Yes — we handle all oversize/overweight permits, route surveys, and pilot car coordination for every state on your route. You don't lift a finger. Permit costs are included in your quote."],
    ['q' => 'What if my equipment is damaged in transit?', 'a' => 'Damage during transit is extremely rare with our vetted carrier network, but if it ever happens, our $1M cargo insurance covers repairs. We document load condition with photos at pickup and delivery, and our claims team responds within 24 hours.'],
    ['q' => 'Can I cancel or reschedule my shipment?', 'a' => "Yes. You can reschedule for free up to 24 hours before pickup. Cancellations more than 24 hours out are 100% refunded. Inside 24 hours, a small dispatch fee may apply to cover the carrier's reserved time."],
    ['q' => 'Do you ship to Canada and Mexico?', 'a' => "Yes. We're licensed for cross-border heavy haul into Canada and Mexico, including all customs brokerage, FAST/CTPAT clearance, and bilingual coordination."],
    ['q' => 'What types of equipment can you haul?', 'a' => 'Construction equipment (excavators, dozers, cranes), agricultural machinery (combines, tractors), industrial equipment (CNC, generators), heavy-duty trucks (semis, dump trucks), and superloads up to 250,000+ lbs. If it fits on a lowboy, RGN, step deck, or specialized trailer — we move it.'],
];
$hh_faqs = [];
foreach ($hh_faq_defaults as $i => $f) {
    $n = $i + 1;
    $q = hh_content('faq', "q{$n}", $f['q']);
    $a = hh_content('faq', "a{$n}", $f['a']);
    if ($q && $a) {
        $hh_faqs[] = ['q' => $q, 'a' => $a];
    }
}
?>

<!-- HERO -->
<section class="relative overflow-hidden bg-secondary">
    <img src="<?php echo esc_url(HH_THEME_URI . '/assets/img/hero-truck.jpg'); ?>"
         alt="Heavy haul Peterbilt semi truck transporting a Caterpillar bulldozer on a multi-axle lowboy across an American interstate"
         class="absolute inset-0 h-full w-full object-cover opacity-90" width="1920" height="1080" fetchpriority="high">
    <div class="absolute inset-0 bg-gradient-hero"></div>
    <div class="absolute inset-0 topo-bg opacity-40"></div>

    <div class="relative container-tight py-12 md:py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-7 text-white animate-fade-up">
            <div class="flex flex-wrap items-center gap-2 mb-6">
                <div class="inline-flex items-center gap-2 rounded-sm bg-primary/15 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40">
                    <?php echo hh_lucide('award', 'h-3.5 w-3.5'); ?>
                    <?php echo esc_html(hh_content('home', 'hero_badge_1', '#1 Rated Heavy Haul Carrier Network')); ?>
                </div>
                <div class="inline-flex items-center gap-2 rounded-sm bg-green-500/10 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-green-400 border border-green-500/40">
                    <span class="relative flex h-2 w-2">
                        <span class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                    </span>
                    <?php echo esc_html(hh_content('home', 'hero_badge_2', '12 Dispatchers Online Now')); ?>
                </div>
            </div>

            <h1 class="stencil font-bold uppercase text-[44px] sm:text-6xl lg:text-7xl leading-[0.9]">
                <?php echo esc_html(hh_content('home', 'hero_title_line1', 'Heavy Haul &')); ?>
                <br>
                <span class="text-primary"><?php echo esc_html(hh_content('home', 'hero_title_line2', 'Oversize Load')); ?></span>
                <br>
                <?php echo esc_html(hh_content('home', 'hero_title_line3', 'Transport Nationwide')); ?>
            </h1>
            <p class="mt-5 text-lg sm:text-xl text-white/80 max-w-xl font-medium">
                <?php echo esc_html(hh_content('home', 'hero_subtitle', 'Quality heavy load transport, anytime, anywhere across the United States. Same-day quotes. Fully insured. DOT compliant.')); ?>
            </p>

            <div class="mt-7 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <a href="<?php echo esc_attr($hh_phone_href); ?>" class="group inline-flex items-center gap-3 bg-white/5 backdrop-blur hover:bg-white/10 border border-white/15 rounded-md px-5 py-3 transition">
                    <span class="h-12 w-12 rounded bg-gradient-amber flex items-center justify-center shadow-cta">
                        <?php echo hh_lucide('phone', 'h-6 w-6 text-secondary'); ?>
                    </span>
                    <span class="leading-tight">
                        <span class="block text-[10px] uppercase tracking-[0.25em] text-white/60"><?php echo esc_html(hh_content('home', 'hero_phone_label', 'Speak To A Dispatcher')); ?></span>
                        <span class="block stencil text-2xl sm:text-3xl text-white group-hover:text-primary"><?php echo esc_html($hh_phone_display); ?></span>
                    </span>
                </a>
                <a href="#quote">
                    <?php hh_button(esc_html(hh_content('home', 'hero_cta_label', 'Get Free Quote')) . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'hero', 'xl'); ?>
                </a>
            </div>

            <ul class="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
                <?php foreach ($hh_trust_badges as $badge): ?>
                    <li class="flex items-center gap-2.5 text-sm text-white/90">
                        <span class="inline-flex h-9 w-9 items-center justify-center rounded bg-primary/15 border border-primary/40">
                            <?php echo hh_lucide($badge['icon'], 'h-4 w-4 text-primary'); ?>
                        </span>
                        <span class="font-bold uppercase tracking-wide text-xs sm:text-[13px]"><?php echo esc_html($badge['label']); ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div id="quote" class="lg:col-span-5 scroll-mt-24 relative">
            <div class="absolute -inset-2 bg-gradient-amber rounded-lg opacity-40 blur-2xl animate-pulse pointer-events-none" aria-hidden="true"></div>
            <div class="relative">
                <?php get_template_part('template-parts/instant-quote-calculator'); ?>
            </div>
        </div>
    </div>

    <!-- Stats bar -->
    <div class="relative bg-black/60 backdrop-blur border-t border-white/10">
        <div class="container-tight grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <?php foreach ($hh_stats as $s): ?>
                <div class="py-5 px-4 text-center text-white">
                    <div class="stencil text-3xl sm:text-4xl text-primary">
                        <span data-hh-countup="<?php echo esc_attr($s['end']); ?>" data-hh-decimals="<?php echo esc_attr($s['decimals']); ?>" data-hh-suffix="<?php echo esc_attr($s['suffix']); ?>"><?php echo esc_html(number_format(0, $s['decimals'])); ?><?php echo esc_html($s['suffix']); ?></span>
                    </div>
                    <div class="mt-1 text-[11px] uppercase tracking-[0.2em] font-bold"><?php echo esc_html($s['label']); ?></div>
                    <div class="text-[11px] text-white/55"><?php echo esc_html($s['sub']); ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- LIVE SHIPMENTS TICKER (RecentShipmentsTicker.tsx) -->
<?php
$hh_shipments = [
    ['equipment' => 'CAT D6 Bulldozer',     'from' => 'Dallas, TX',      'to' => 'Atlanta, GA',       'ago' => '12 min ago'],
    ['equipment' => 'John Deere Combine',   'from' => 'Des Moines, IA',  'to' => 'Lincoln, NE',       'ago' => '34 min ago'],
    ['equipment' => 'Bobcat T595 Loader',   'from' => 'Chicago, IL',     'to' => 'Detroit, MI',       'ago' => '1 hr ago'],
    ['equipment' => 'Kenworth T800 Semi',   'from' => 'Phoenix, AZ',     'to' => 'Las Vegas, NV',     'ago' => '2 hr ago'],
    ['equipment' => 'CAT 320 Excavator',    'from' => 'Houston, TX',     'to' => 'New Orleans, LA',   'ago' => '3 hr ago'],
    ['equipment' => 'Komatsu PC290',        'from' => 'Denver, CO',      'to' => 'Salt Lake City, UT','ago' => '4 hr ago'],
    ['equipment' => 'Hitachi ZX350',        'from' => 'Seattle, WA',     'to' => 'Portland, OR',      'ago' => '5 hr ago'],
    ['equipment' => 'New Holland Tractor',  'from' => 'Omaha, NE',       'to' => 'Kansas City, MO',   'ago' => '6 hr ago'],
    ['equipment' => 'Volvo L90H Loader',    'from' => 'Cleveland, OH',   'to' => 'Pittsburgh, PA',    'ago' => '7 hr ago'],
    ['equipment' => 'Mack Dump Truck',      'from' => 'Tampa, FL',       'to' => 'Charlotte, NC',     'ago' => '8 hr ago'],
];
$hh_shipments_loop = array_merge($hh_shipments, $hh_shipments);
?>
<div class="bg-secondary text-white border-y border-white/10 overflow-hidden">
    <div class="container-tight flex items-center gap-4 py-3">
        <div class="hidden sm:flex items-center gap-2 shrink-0 pr-4 border-r border-white/15">
            <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400"></span>
            </span>
            <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary whitespace-nowrap">Live Shipments</span>
        </div>
        <div class="relative flex-1 overflow-hidden">
            <div class="flex gap-8 animate-marquee whitespace-nowrap">
                <?php foreach ($hh_shipments_loop as $s): ?>
                    <div class="flex items-center gap-2.5 text-xs">
                        <?php echo hh_lucide('circle-check', 'h-3.5 w-3.5 text-primary shrink-0'); ?>
                        <?php echo hh_lucide('truck', 'h-3.5 w-3.5 text-white/60 shrink-0'); ?>
                        <span class="font-bold text-white"><?php echo esc_html($s['equipment']); ?></span>
                        <span class="text-white/40">·</span>
                        <span class="flex items-center gap-1 text-white/70">
                            <?php echo hh_lucide('map-pin', 'h-3 w-3'); ?>
                            <?php echo esc_html($s['from']); ?> &rarr; <?php echo esc_html($s['to']); ?>
                        </span>
                        <span class="text-white/40">·</span>
                        <span class="text-primary uppercase tracking-wider text-[10px] font-bold">Delivered <?php echo esc_html($s['ago']); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<!-- SERVICES, clickable cards with real photos -->
<section class="py-16 sm:py-24 bg-background">
    <div class="container-tight">
        <div class="max-w-2xl mb-12">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <span class="h-px w-8 bg-primary"></span> <?php echo esc_html(hh_content('home', 'services_eyebrow', 'What We Haul')); ?>
            </p>
            <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase">
                <?php echo esc_html(hh_content('home', 'services_title_1', 'Specialized Transport')); ?> <span class="text-primary"><?php echo esc_html(hh_content('home', 'services_title_2', 'For Every Industry')); ?></span>
            </h2>
            <p class="text-muted-foreground mt-4">
                <?php echo esc_html(hh_content('home', 'services_subtitle', 'From farm equipment to industrial machinery, click any category for full sub-services, brand specialties, and shipping rates.')); ?>
            </p>
        </div>
        <div class="grid sm:grid-cols-2 gap-6">
            <?php foreach ($hh_home_categories as $cat):
                $blurb = get_field('blurb', $cat->ID) ?: '';
                $hero_image = get_field('hero_image', $cat->ID);
                $img_src = is_array($hero_image) && !empty($hero_image['url'])
                    ? $hero_image['url']
                    : HH_THEME_URI . '/assets/img/' . ($hh_cat_fallback_images[$cat->post_name] ?? 'hero-truck.jpg');

                $subs = get_posts([
                    'post_type'      => 'service_subcategory',
                    'posts_per_page' => -1,
                    'orderby'        => 'menu_order',
                    'order'          => 'ASC',
                    'meta_query'     => [['key' => 'parent_category', 'value' => $cat->ID]],
                ]);
                $sub_count = count($subs);
                $subs_shown = array_slice($subs, 0, 4);
                ?>
                <a href="<?php echo esc_url(home_url('/services/' . $cat->post_name)); ?>"
                   class="group flex flex-col overflow-hidden rounded-md shadow-card border border-border hover:border-primary hover:shadow-glow transition-all bg-card">
                    <div class="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img src="<?php echo esc_url($img_src); ?>" alt="<?php echo esc_attr($cat->post_title . ', loaded heavy haul trailer'); ?>"
                             class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="1024" height="640">
                        <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-sm shadow-cta">
                            Service
                        </div>
                    </div>
                    <div class="p-5 sm:p-6">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <h3 class="font-sans font-extrabold text-xl sm:text-2xl normal-case tracking-tight text-foreground group-hover:text-primary transition-colors"><?php echo esc_html($cat->post_title); ?></h3>
                                <p class="text-sm text-muted-foreground mt-2"><?php echo esc_html($blurb); ?></p>
                            </div>
                            <span class="shrink-0 h-11 w-11 rounded-md bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <?php echo hh_lucide('arrow-right', 'h-5 w-5'); ?>
                            </span>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-1.5">
                            <?php foreach ($subs_shown as $sub): ?>
                                <span class="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2 py-1 rounded-sm border border-border">
                                    <?php echo esc_html(str_replace(' Transport', '', $sub->post_title)); ?>
                                </span>
                            <?php endforeach; ?>
                            <?php if ($sub_count > 4): ?>
                                <span class="text-[10px] uppercase tracking-wider font-bold bg-primary/15 text-secondary px-2 py-1 rounded-sm border border-primary/40">
                                    +<?php echo esc_html($sub_count - 4); ?> more
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- BRAND MARQUEE (BrandMarquee.tsx) — hardcoded brand chips, not CMS-driven originally -->
<?php
$hh_brands = [
    ['name' => 'Caterpillar',   'html' => '<div class="flex items-end text-3xl font-black italic tracking-tighter text-[#FFB800] group-hover:drop-shadow-[0_0_15px_rgba(255,184,0,0.6)] transition">CAT<span class="ml-1 mb-1 h-3 w-3 bg-[#FFB800]"></span></div>'],
    ['name' => 'John Deere',    'html' => '<div class="flex flex-col items-center text-[#367C2B] group-hover:drop-shadow-[0_0_15px_rgba(54,124,43,0.6)] transition"><span class="text-[10px] font-bold uppercase tracking-[0.25em] opacity-80">John Deere</span><div class="mt-1 flex h-7 w-10 items-center justify-center rounded-sm border-2 border-[#FFDE00]"><div class="h-2 w-4 rounded-full bg-[#367C2B]"></div></div></div>'],
    ['name' => 'Komatsu',       'html' => '<div class="text-2xl font-black uppercase tracking-tight text-[#004098] group-hover:drop-shadow-[0_0_15px_rgba(0,64,152,0.7)] transition">Komatsu</div>'],
    ['name' => 'Volvo',         'html' => '<div class="flex items-center rounded-full border-2 border-zinc-400 px-4 py-1 group-hover:border-[#00508F] transition"><span class="text-sm font-bold uppercase tracking-[0.25em] text-zinc-200 group-hover:text-[#5AA3D8] transition">Volvo</span></div>'],
    ['name' => 'Kenworth',      'html' => '<div class="flex flex-col items-center"><div class="flex h-6 w-24 items-center justify-center rounded-sm bg-[#C41230] text-[10px] font-black tracking-wider text-white">KENWORTH</div><div class="mt-[2px] h-[2px] w-24 bg-[#C41230]"></div></div>'],
    ['name' => 'Peterbilt',     'html' => '<div class="text-xl font-black italic uppercase text-[#E31837] group-hover:drop-shadow-[0_0_15px_rgba(227,24,55,0.6)] transition">Peterbilt</div>'],
    ['name' => 'Freightliner',  'html' => '<div class="text-lg font-black uppercase tracking-tight text-[#004A99] group-hover:drop-shadow-[0_0_15px_rgba(0,74,153,0.7)] transition">Freightliner</div>'],
    ['name' => 'Mack',          'html' => '<div class="flex items-center gap-2"><span class="text-2xl font-black uppercase text-[#FFD100] group-hover:drop-shadow-[0_0_15px_rgba(255,209,0,0.6)] transition">Mack</span></div>'],
    ['name' => 'Hitachi',       'html' => '<div class="text-2xl font-black uppercase tracking-wider text-[#D9272E] group-hover:drop-shadow-[0_0_15px_rgba(217,39,46,0.6)] transition">Hitachi</div>'],
    ['name' => 'Kubota',        'html' => '<div class="text-2xl font-black uppercase tracking-tight text-[#F47920] group-hover:drop-shadow-[0_0_15px_rgba(244,121,32,0.6)] transition">Kubota</div>'],
    ['name' => 'Case',          'html' => '<div class="rounded-sm bg-[#D71920] px-3 py-1 text-xl font-black uppercase tracking-wider text-white">Case</div>'],
    ['name' => 'New Holland',   'html' => '<div class="text-lg font-black uppercase tracking-tight text-[#00427A] group-hover:drop-shadow-[0_0_15px_rgba(0,66,122,0.7)] transition">New Holland</div>'],
    ['name' => 'Bobcat',        'html' => '<div class="flex flex-col items-center"><div class="mb-1 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-zinc-200"><div class="h-4 w-4 translate-y-1 rotate-45 bg-black"></div></div><div class="text-base font-black uppercase tracking-tighter text-white group-hover:text-[#FF6600] transition">Bobcat</div></div>'],
    ['name' => 'JCB',           'html' => '<div class="-skew-x-12 bg-[#FFD100] px-4 py-1"><span class="inline-block skew-x-12 text-2xl font-black text-black">JCB</span></div>'],
    ['name' => 'Doosan',        'html' => '<div class="text-2xl font-black uppercase tracking-tight text-[#1B4B9A] group-hover:drop-shadow-[0_0_15px_rgba(27,75,154,0.7)] transition">Doosan</div>'],
    ['name' => 'Liebherr',      'html' => '<div class="flex flex-col items-center text-[#21409A] group-hover:drop-shadow-[0_0_15px_rgba(33,64,154,0.7)] transition"><span class="text-lg font-black uppercase tracking-widest">Liebherr</span><div class="mt-[2px] h-[3px] w-full bg-[#FFB800]"></div></div>'],
];
$hh_brands_row = array_merge($hh_brands, $hh_brands);
?>
<section class="bg-secondary text-secondary-foreground border-y border-white/10 py-20 overflow-hidden">
    <div class="container-tight mb-12 text-center">
        <p class="mb-3 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            <span class="h-px w-8 bg-primary/30"></span> Trusted Brand Specialists <span class="h-px w-8 bg-primary/30"></span>
        </p>
        <h2 class="stencil text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">We Haul Every Major Brand</h2>
    </div>

    <div class="relative" style="-webkit-mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);">
        <div class="flex w-max items-center gap-6 marquee-track py-4">
            <?php foreach ($hh_brands_row as $b): ?>
                <div class="brand-tile group flex h-24 w-48 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-primary/60 hover:bg-primary/[0.05]">
                    <?php echo $b['html']; // trusted internal markup ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="mt-12 flex justify-center gap-1">
        <div class="h-1 w-12 bg-primary"></div>
        <div class="h-1 w-4 bg-white/10"></div>
        <div class="h-1 w-4 bg-white/10"></div>
    </div>
</section>

<!-- GALLERY (Gallery.tsx) — photo grid only; video player omitted, see note at top of file -->
<?php
$hh_gallery_photos = [
    ['src' => 'loaded-bulldozer.jpg', 'label' => 'CAT D6 Bulldozer',      'lane' => 'Phoenix, AZ → Denver, CO'],
    ['src' => 'loaded-excavator.jpg', 'label' => 'CAT 320 Excavator',     'lane' => 'Houston, TX → Atlanta, GA'],
    ['src' => 'loaded-combine.jpg',   'label' => 'John Deere Combine',    'lane' => 'Des Moines, IA → Lincoln, NE'],
    ['src' => 'loaded-bobcat.jpg',    'label' => 'Bobcat T595 Loader',    'lane' => 'Chicago, IL → Detroit, MI'],
    ['src' => 'loaded-loader.jpg',    'label' => 'CAT Wheel Loader',      'lane' => 'Dallas, TX → Memphis, TN'],
    ['src' => 'loaded-tractor.jpg',   'label' => 'New Holland Tractor',   'lane' => 'Omaha, NE → Kansas City, MO'],
    ['src' => 'loaded-forklift.jpg',  'label' => 'Toyota Forklift',       'lane' => 'Los Angeles, CA → Las Vegas, NV'],
    ['src' => 'loaded-cnc.jpg',       'label' => 'Industrial CNC Machine','lane' => 'Cleveland, OH → Pittsburgh, PA'],
];
?>
<section class="py-16 sm:py-24 bg-secondary text-white relative overflow-hidden">
    <div class="absolute inset-0 topo-bg opacity-30" aria-hidden="true"></div>
    <div class="relative container-tight">
        <div class="text-center max-w-2xl mx-auto mb-12">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-2">
                <?php echo hh_lucide('camera', 'h-3.5 w-3.5'); ?> Real Loads &middot; Real Drivers &middot; Verified Shipments
            </p>
            <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase">Watch Our <span class="text-primary">Heavy Haul Crew</span> In Action</h2>
            <p class="text-white/70 mt-3">Every shipment GPS-tracked, fully insured, and documented from pickup to delivery.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach ($hh_gallery_photos as $i => $p):
                $hh_gallery_img_src = HH_THEME_URI . '/assets/img/' . $p['src']; ?>
                <button type="button" data-hh-lightbox-trigger
                        data-hh-lightbox-src="<?php echo esc_attr($hh_gallery_img_src); ?>"
                        data-hh-lightbox-lane="<?php echo esc_attr($p['lane']); ?>"
                        data-hh-lightbox-label="<?php echo esc_attr($p['label']); ?>"
                        class="group relative overflow-hidden rounded-md border border-white/10 hover:border-primary transition-all aspect-square bg-black">
                    <img src="<?php echo esc_url($hh_gallery_img_src); ?>"
                         alt="<?php echo esc_attr($p['label'] . ' loaded for heavy haul transport, ' . $p['lane']); ?>"
                         class="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" width="1024" height="1024">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100"></div>
                    <div class="absolute inset-x-0 bottom-0 p-3 text-left">
                        <div class="text-[9px] uppercase tracking-[0.2em] text-primary font-bold"><?php echo esc_html($p['lane']); ?></div>
                        <div class="font-display text-sm sm:text-base uppercase leading-tight mt-0.5"><?php echo esc_html($p['label']); ?></div>
                    </div>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <?php hh_button('Browse All Services ' . hh_lucide('arrow-right', 'h-4 w-4'), home_url('/services'), 'hero', 'lg'); ?>
            <a href="#quote">
                <?php hh_button('Get A Free Quote', '#quote', 'outline', 'lg', 'bg-transparent border-white/30 text-white hover:bg-white hover:text-secondary'); ?>
            </a>
        </div>
    </div>

    <!-- Lightbox overlay (assets/js/main.js wires data-hh-lightbox-trigger buttons above to this) -->
    <div class="fixed inset-0 z-[200] bg-black/90 backdrop-blur hidden items-center justify-center p-4" data-hh-lightbox>
        <button type="button" class="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center" aria-label="Close" data-hh-lightbox-close>
            <?php echo hh_lucide('x', 'h-6 w-6'); ?>
        </button>
        <figure class="max-w-5xl w-full">
            <img src="" alt="" class="w-full h-auto rounded-md border border-white/10" data-hh-lightbox-img>
            <figcaption class="text-center text-white mt-4">
                <div class="text-primary text-xs uppercase tracking-[0.3em] font-bold" data-hh-lightbox-lane></div>
                <div class="font-display text-xl uppercase mt-1" data-hh-lightbox-label></div>
            </figcaption>
        </figure>
    </div>
</section>

<!-- HEAVY HAUL IN YOUR STATE (UsaMap.tsx, simplified — see note at top of file) -->
<section class="py-16 sm:py-24 bg-muted/40 overflow-hidden">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3"><?php echo esc_html(hh_content('home', 'coverage_eyebrow', 'Nationwide Coverage')); ?></p>
            <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase">
                <?php echo esc_html(hh_content('home', 'coverage_title_1', 'Heavy Haul')); ?> <span class="text-primary"><?php echo esc_html(hh_content('home', 'coverage_title_2', 'In Your State')); ?></span>
            </h2>
            <p class="text-muted-foreground mt-3">
                <?php echo esc_html(hh_content('home', 'coverage_subtitle', 'We dispatch heavy haul and oversize load transport in every U.S. state, coast to coast.')); ?>
            </p>
        </div>
        <div class="grid lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-8">
                <div class="relative w-full rounded-lg border border-border bg-card p-6 sm:p-10 overflow-hidden">
                    <div class="absolute inset-0 topo-bg opacity-20" aria-hidden="true"></div>
                    <div class="relative flex flex-wrap gap-2 justify-center">
                        <?php foreach (hh_states() as $hh_st): ?>
                            <span class="inline-flex items-center justify-center h-9 min-w-[2.75rem] px-2 rounded-sm bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider shadow-cta"
                                  title="<?php echo esc_attr($hh_st['name']); ?>"><?php echo esc_html($hh_st['abbr']); ?></span>
                        <?php endforeach; ?>
                    </div>
                    <div class="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-muted-foreground">
                        <span class="inline-flex items-center gap-2">
                            <?php echo hh_lucide('map-pin', 'h-4 w-4 text-primary'); ?>
                            <span class="text-foreground">50</span> / 50 States Active
                        </span>
                        <span class="inline-flex items-center gap-2">
                            <span class="h-3 w-3 rounded-sm bg-primary inline-block"></span>
                            Dispatched
                        </span>
                    </div>
                </div>
            </div>
            <div class="lg:col-span-4 space-y-5">
                <div class="bg-card border border-border rounded-md p-6 shadow-card">
                    <div class="stencil text-4xl text-primary"><?php echo esc_html(hh_content('home', 'coverage_card_value', '50 / 50')); ?></div>
                    <p class="text-xs uppercase tracking-[0.25em] font-bold mt-1 text-muted-foreground"><?php echo esc_html(hh_content('home', 'coverage_card_label', 'States Covered')); ?></p>
                </div>
                <div class="bg-secondary text-white rounded-md p-6 border-t-4 border-primary">
                    <p class="text-sm text-white/80"><?php echo esc_html(hh_content('home', 'coverage_card_note', "Local dispatchers, nationwide network. Pick a state, we'll have a rig on it.")); ?></p>
                    <a href="#quote" class="mt-4 inline-block">
                        <?php hh_button('Get A Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'hero', 'lg'); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- WHY US (scroll-snap carousel replaces embla Carousel — see note at top of file) -->
<section class="relative py-16 sm:py-24 bg-gradient-dark text-white overflow-hidden">
    <div class="absolute inset-0 topo-bg opacity-40" aria-hidden="true"></div>
    <div class="relative container-tight">
        <div class="text-center max-w-3xl mx-auto mb-12">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center justify-center gap-3">
                <span class="h-px w-8 bg-primary/40"></span> <?php echo esc_html(hh_content('home', 'why_eyebrow', 'Why Heavy Haul Group')); ?> <span class="h-px w-8 bg-primary/40"></span>
            </p>
            <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase">
                <?php echo esc_html(hh_content('home', 'why_title_1', 'Built For Heavy.')); ?> <span class="text-primary"><?php echo esc_html(hh_content('home', 'why_title_2', 'Trusted For Every Mile.')); ?></span>
            </h2>
            <p class="text-white/70 mt-5 text-base sm:text-lg">
                <?php echo esc_html(hh_content('home', 'why_subtitle', 'We move what others can\'t. Our dispatchers, drivers, and equipment are dedicated 100% to oversize and heavy haul freight.')); ?>
            </p>
        </div>

        <div class="relative" data-hh-carousel>
            <div class="overflow-x-auto pb-2" data-hh-carousel-track>
                <div class="flex gap-4">
                    <?php foreach ($hh_why as $w): ?>
                        <div data-hh-carousel-item class="shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" style="min-width:260px;max-width:320px;">
                            <div class="group h-full bg-white rounded-xl border border-white/10 p-8 flex flex-col items-center text-center shadow-card hover:-translate-y-1 transition-transform">
                                <div class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <?php echo hh_lucide($w['icon'], 'h-8 w-8 text-primary'); ?>
                                </div>
                                <h3 class="font-sans font-extrabold text-lg uppercase tracking-wide text-secondary"><?php echo esc_html($w['title']); ?></h3>
                                <p class="text-sm text-muted-foreground mt-2 leading-relaxed min-h-[3rem]"><?php echo esc_html($w['desc']); ?></p>
                                <a href="<?php echo esc_url(home_url('/services')); ?>"
                                   class="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Explore <?php echo hh_lucide('arrow-right', 'h-4 w-4'); ?>
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="flex items-center justify-center gap-3 mt-10">
                <button type="button" data-hh-carousel-prev aria-label="Previous" class="h-11 w-11 rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-secondary flex items-center justify-center transition-colors"><?php echo hh_lucide('chevron-right', 'h-5 w-5 rotate-180'); ?></button>
                <button type="button" data-hh-carousel-next aria-label="Next" class="h-11 w-11 rounded-full border border-white/20 bg-transparent text-white hover:bg-white hover:text-secondary flex items-center justify-center transition-colors"><?php echo hh_lucide('chevron-right', 'h-5 w-5'); ?></button>
            </div>
        </div>
    </div>
</section>

<!-- GUARANTEES / RISK REVERSAL (Guarantees.tsx) -->
<?php
$hh_guarantees = [
    ['icon' => 'clock',        'title' => hh_content('guarantees', 'g1_title', 'On-Time Pickup'),      'sub' => hh_content('guarantees', 'g1_sub', 'Guaranteed Schedule')],
    ['icon' => 'dollar-sign',  'title' => hh_content('guarantees', 'g2_title', 'Price-Match Promise'), 'sub' => hh_content('guarantees', 'g2_sub', 'Beat Any Valid Quote')],
    ['icon' => 'shield-check', 'title' => hh_content('guarantees', 'g3_title', '$1M Cargo Insurance'), 'sub' => hh_content('guarantees', 'g3_sub', 'Full Load Coverage')],
    ['icon' => 'award',        'title' => hh_content('guarantees', 'g4_title', 'Vetted Carriers Only'),'sub' => hh_content('guarantees', 'g4_sub', 'Elite Network')],
];
?>
<section class="py-6 sm:py-8 bg-background">
    <div class="container-tight">
        <div class="flex items-center justify-center gap-3 mb-4">
            <span class="h-px w-8 bg-border"></span>
            <h2 class="stencil text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-center">
                <?php echo esc_html(hh_content('guarantees', 'heading_1', 'Heavy Haul Group')); ?>
                <span class="text-primary"><?php echo esc_html(hh_content('guarantees', 'heading_2', 'Guarantee')); ?></span>
            </h2>
            <span class="h-px w-8 bg-border"></span>
        </div>
        <div class="border-y border-border bg-muted/30">
            <div class="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-border">
                <?php foreach ($hh_guarantees as $g): ?>
                    <div class="flex items-center gap-3 px-4 py-3">
                        <div class="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <?php echo hh_lucide($g['icon'], 'h-4 w-4 text-secondary'); ?>
                        </div>
                        <div class="leading-tight min-w-0">
                            <div class="font-extrabold text-[13px] text-foreground truncate"><?php echo esc_html($g['title']); ?></div>
                            <div class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold truncate"><?php echo esc_html($g['sub']); ?></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- DISPATCHER TEAM (DispatcherTeam.tsx) -->
<section class="py-16 sm:py-24 bg-secondary text-white overflow-hidden">
    <div class="container-tight">
        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div class="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs"><?php echo esc_html(hh_content('dispatchers', 'eyebrow', 'Human-Led Logistics')); ?></p>
                <h2 class="stencil text-5xl sm:text-6xl font-bold uppercase leading-[0.9]">
                    <?php echo esc_html(hh_content('dispatchers', 'title_1', 'Meet Your')); ?>
                    <span class="text-primary"><?php echo esc_html(hh_content('dispatchers', 'title_2', 'Dispatch Team')); ?></span>
                </h2>
                <p class="text-white/70 text-lg max-w-md">
                    <?php echo esc_html(hh_content('dispatchers', 'subtitle', 'No call centers. No bots. Speak directly with the specialized dispatcher handling your load — from quote to confirmation.')); ?>
                </p>
                <a href="<?php echo esc_attr($hh_phone_href); ?>" class="group inline-flex items-center gap-3 bg-primary text-secondary px-8 py-4 font-bold uppercase tracking-wider shadow-cta hover:brightness-110 transition rounded-sm">
                    <?php echo hh_lucide('phone', 'h-5 w-5'); ?> <?php echo esc_html(hh_content('dispatchers', 'cta_label', 'Talk To A Dispatcher Now')); ?>
                </a>
            </div>

            <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <?php foreach ($hh_dispatcher_team as $i => $m):
                    $offset = ($i % 2 === 1) ? 'sm:mt-10' : '';
                    $muted = !$m['online'];
                    ?>
                    <div class="bg-card text-foreground border border-border p-6 rounded-sm group hover:border-primary transition-colors <?php echo esc_attr($offset); ?>">
                        <div class="flex items-center gap-5 mb-5">
                            <div class="h-20 w-20 rounded-full overflow-hidden border-2 shrink-0 transition-all <?php echo $muted ? 'border-border opacity-60' : 'border-primary'; ?>">
                                <img src="<?php echo esc_url(HH_THEME_URI . '/assets/img/' . $m['img']); ?>" alt="<?php echo esc_attr($m['name'] . ', ' . $m['role'] . ' at Heavy Haul Group'); ?>"
                                     loading="lazy" width="256" height="256" class="h-full w-full object-cover">
                            </div>
                            <div class="min-w-0">
                                <p class="stencil text-3xl leading-none <?php echo $muted ? 'text-muted-foreground' : 'text-foreground'; ?>"><?php echo esc_html($m['name']); ?></p>
                                <p class="text-[11px] text-primary font-black uppercase tracking-widest mt-1"><?php echo esc_html($m['role']); ?></p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center border-t border-border pt-4">
                            <span class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest"><?php echo esc_html($m['years']); ?> Yrs Exp</span>
                            <?php if ($m['online']): ?>
                                <span class="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase tracking-widest">
                                    <span class="relative flex h-2 w-2">
                                        <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                                        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    Available
                                </span>
                            <?php else: ?>
                                <span class="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Back in 1 Hr</span>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- HOW IT WORKS -->
<section class="py-12 sm:py-16 bg-background">
    <div class="container-tight">
        <div class="mb-8">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2"><?php echo esc_html(hh_content('home', 'steps_eyebrow', 'Strategic Execution')); ?></p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html(hh_content('home', 'steps_title', 'From Quote To Delivery')); ?></h2>
        </div>
        <ol class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            <?php foreach ($hh_steps as $i => $step): ?>
                <li class="relative bg-card p-6 sm:p-7 group overflow-hidden transition-colors hover:bg-secondary">
                    <div class="flex items-center justify-between mb-4">
                        <span class="stencil text-5xl leading-none text-primary font-bold">0<?php echo esc_html($i + 1); ?></span>
                        <span class="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <?php echo hh_lucide($step['icon'], 'h-5 w-5 text-primary group-hover:text-secondary transition-colors'); ?>
                        </span>
                    </div>
                    <div class="space-y-1.5">
                        <h3 class="stencil text-lg uppercase text-foreground group-hover:text-secondary-foreground transition-colors"><?php echo esc_html($step['title']); ?></h3>
                        <p class="text-sm text-muted-foreground group-hover:text-secondary-foreground/80 leading-relaxed transition-colors"><?php echo esc_html($step['desc']); ?></p>
                    </div>
                </li>
            <?php endforeach; ?>
        </ol>
    </div>
</section>

<!-- REVIEWS — BENTO MOSAIC (hardcoded, not CMS-driven in the original) -->
<section class="py-16 sm:py-20 bg-muted/40">
    <div class="container-tight">
        <div class="text-center mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Verified Across 2,400+ Loads</p>
            <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase">Real Shippers. <span class="text-primary">Real Loads.</span></h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div class="md:col-span-2 bg-primary text-secondary p-8 flex flex-col justify-between rounded-sm shadow-cta min-h-[260px]">
                <div>
                    <p class="stencil text-2xl leading-tight uppercase">Overall Rating</p>
                    <div class="flex items-center gap-1 mt-3">
                        <?php for ($i = 0; $i < 5; $i++): ?>
                            <?php echo hh_lucide('star', 'h-4 w-4 fill-secondary text-secondary'); ?>
                        <?php endfor; ?>
                    </div>
                </div>
                <div>
                    <p class="stencil text-7xl leading-none">4.9</p>
                    <p class="text-[11px] font-black uppercase tracking-[0.3em] mt-2">2,400+ verified shippers</p>
                </div>
            </div>

            <article class="md:col-span-4 bg-secondary text-white p-8 sm:p-10 rounded-sm flex flex-col justify-center relative overflow-hidden">
                <div class="absolute top-6 right-6 text-primary/20 stencil text-7xl leading-none select-none">&quot;</div>
                <div class="flex items-center gap-0.5 mb-4">
                    <?php for ($i = 0; $i < 5; $i++): ?>
                        <?php echo hh_lucide('star', 'h-4 w-4 fill-primary text-primary'); ?>
                    <?php endfor; ?>
                </div>
                <p class="text-lg sm:text-xl italic leading-relaxed">
                    "Moved a 120k lb transformer across state lines without a single permit delay. Our dispatcher kept us updated every two hours — the most professional haul we've booked."
                </p>
                <div class="mt-6 flex items-center justify-between">
                    <p class="text-xs uppercase font-bold text-primary tracking-widest">John D. — Global Energy Logistics</p>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                        <?php echo hh_lucide('badge-check', 'h-3.5 w-3.5 text-primary'); ?> Verified Load
                    </span>
                </div>
            </article>

            <?php
            $hh_reviews = [
                ['q' => 'Dispatcher actually picks up the phone. Delivered on time, no surprises.', 'n' => 'Mike R.', 'role' => 'Fleet Manager'],
                ['q' => 'Best rates for RGN specialized equipment. Most brokers overcharge on permits — HHG is transparent.', 'n' => 'Sarah K.', 'role' => 'Operations Lead'],
                ['q' => 'The $1M cargo coverage is real. A minor strap failure on a prototype rig — handled in 48 hours.', 'n' => 'Lisa R.', 'role' => 'Infrastructure Lead'],
            ];
            foreach ($hh_reviews as $r): ?>
                <article class="md:col-span-2 bg-card border border-border p-6 rounded-sm flex flex-col shadow-card">
                    <div class="flex items-center gap-0.5 mb-3">
                        <?php for ($i = 0; $i < 5; $i++): ?>
                            <?php echo hh_lucide('star', 'h-3.5 w-3.5 fill-primary text-primary'); ?>
                        <?php endfor; ?>
                    </div>
                    <p class="text-[14px] text-foreground italic leading-relaxed flex-1">"<?php echo esc_html($r['q']); ?>"</p>
                    <div class="mt-4 pt-3 border-t border-border">
                        <p class="text-xs font-black uppercase tracking-widest text-primary"><?php echo esc_html($r['n']); ?></p>
                        <p class="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5"><?php echo esc_html($r['role']); ?></p>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- FAQ (FAQ.tsx) — native <details>/<summary> accordion, no JS required -->
<section id="faq" class="py-16 sm:py-24 bg-background">
    <div class="container-tight grid lg:grid-cols-12 gap-10">
        <div class="lg:col-span-4">
            <div class="lg:sticky lg:top-24">
                <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                    <?php echo hh_lucide('help-circle', 'h-3.5 w-3.5'); ?> <?php echo esc_html(hh_content('faq', 'eyebrow', 'Frequently Asked')); ?>
                </p>
                <h2 class="stencil text-4xl sm:text-5xl font-bold uppercase leading-[0.95]">
                    <?php echo esc_html(hh_content('faq', 'title_1', 'Got Questions?')); ?>
                    <br><?php echo esc_html(hh_content('faq', 'title_2', "We've Got Answers.")); ?>
                </h2>
                <p class="text-muted-foreground mt-4">
                    <?php echo esc_html(hh_content('faq', 'subtitle', 'Most shippers ask the same things before booking. Here are straight answers to the top 8 — pricing, insurance, timing, and more.')); ?>
                </p>
                <div class="mt-6 bg-secondary text-white rounded-md p-5 border-t-4 border-primary">
                    <p class="text-sm text-white/80 mb-3"><?php echo esc_html(hh_content('faq', 'side_note', 'Still have a question? Talk to a real dispatcher in under 60 seconds.')); ?></p>
                    <a href="<?php echo esc_attr($hh_phone_href); ?>">
                        <?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'hero', 'lg', 'w-full'); ?>
                    </a>
                    <a href="<?php echo esc_url(home_url('/contact#quote')); ?>" class="block mt-2">
                        <?php hh_button(esc_html(hh_content('faq', 'side_email_label', 'Email Dispatch')) . ' ' . hh_lucide('arrow-right', 'h-4 w-4'), home_url('/contact#quote'), 'outline', 'lg', 'w-full bg-transparent border-white/20 text-white hover:bg-white hover:text-secondary'); ?>
                    </a>
                </div>
            </div>
        </div>
        <div class="lg:col-span-8 space-y-3">
            <?php foreach ($hh_faqs as $i => $f): ?>
                <details class="group bg-card border border-border rounded-md px-5 shadow-sm hover:border-primary/50 transition-colors" <?php echo $i === 0 ? 'open' : ''; ?>>
                    <summary class="text-left font-sans font-extrabold text-base sm:text-lg text-foreground hover:text-primary py-5 cursor-pointer list-none flex items-center justify-between gap-3">
                        <span><?php echo esc_html($f['q']); ?></span>
                        <?php echo hh_lucide('chevron-down', 'h-4 w-4 shrink-0 transition-transform group-open:rotate-180'); ?>
                    </summary>
                    <div class="text-muted-foreground text-[15px] leading-relaxed pb-5"><?php echo esc_html($f['a']); ?></div>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- FINAL CTA -->
<section class="relative bg-secondary text-secondary-foreground overflow-hidden">
    <div class="absolute inset-0 topo-bg opacity-50" aria-hidden="true"></div>
    <div class="h-2 bg-gradient-stripe" aria-hidden="true"></div>
    <div class="relative container-tight py-16 sm:py-20 text-center max-w-3xl mx-auto">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Limited Carrier Availability Today</p>
        <h2 class="stencil text-4xl sm:text-5xl lg:text-6xl font-bold uppercase">Ready To Move <span class="text-primary">Your Equipment?</span></h2>
        <p class="mt-4 text-white/75 text-lg">Speak with a live dispatcher now or lock your rate in 60 seconds. Response in under 10 minutes.</p>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="<?php echo esc_attr($hh_phone_href); ?>">
                <?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'hero', 'xl', 'w-full sm:w-auto'); ?>
            </a>
            <a href="#quote">
                <?php hh_button('Get Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'call', 'xl', 'w-full sm:w-auto'); ?>
            </a>
        </div>
    </div>
</section>

<?php get_footer(); ?>
