<?php
/**
 * Ported from src/pages/Category.tsx (template_type = 'freight') and
 * src/pages/ServiceDetail.tsx (template_type = 'service'). Handles both real
 * /services/{category}/ single posts AND the virtual /services/{category}/state/{state}/
 * pages (inc/rewrite-rules.php sets $GLOBALS['hh_state'] and calls setup_postdata() before
 * including this file either way — see THEME-AGENT-REFERENCE.md).
 *
 * No have_posts()/the_post() Loop here on purpose: virtual state pages never populate
 * $wp_query->posts, only $GLOBALS['post'] + setup_postdata(). get_the_ID()/get_field()/
 * the_title() all read off the global $post, which is set correctly in both cases.
 */
get_header();

$hh_state = $GLOBALS['hh_state'] ?? null; // {slug,name,abbr} on virtual /state/ pages, else null
$hh_cat_id = get_the_ID();
$hh_cat_slug = get_post_field('post_name', $hh_cat_id);
$hh_template_type = get_field('template_type', $hh_cat_id) ?: 'freight';
$hh_short = get_field('short', $hh_cat_id) ?: get_the_title();
$hh_short_lower = strtolower($hh_short);
$hh_blurb = get_field('blurb', $hh_cat_id) ?: '';
$hh_phone = hh_setting('phone_primary');
$hh_phone_display = hh_setting('phone_primary_display');
$hh_phone_href = hh_tel_href($hh_phone);

// Static asset fallbacks — used until a post's ACF image field is populated in wp-admin.
$hh_fallback_images = [
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
// HERO_IMAGES equivalent — a punchier dedicated hero shot for "service" categories only
// (ServiceDetail.tsx used HERO_IMAGES[slug] ?? cat.image). hero-catastrophic.jpg's source
// file never made it into src/assets (only its .asset.json remote pointer exists), so that
// one falls back to the card image (service-catastrophic.jpg) instead.
$hh_service_hero_images = [
    'canada-shipping-service'     => 'hero-canada.jpg',
    'mexico-shipping-service'     => 'hero-mexico.jpg',
    'rigging-and-lifting-service' => 'hero-rigging.jpg',
    'pilot-car-service'           => 'hero-pilot.jpg',
    'heavy-machinery-towing'      => 'hero-towing.jpg',
    'partial-load-shipping'       => 'hero-partial.jpg',
];

$hh_hero_field = get_field('hero_image', $hh_cat_id);
$hh_card_image = (is_array($hh_hero_field) && !empty($hh_hero_field['url']))
    ? $hh_hero_field['url']
    : HH_THEME_URI . '/assets/img/' . ($hh_fallback_images[$hh_cat_slug] ?? 'hero-truck.jpg');
$hh_hero_image = (!empty($hh_service_hero_images[$hh_cat_slug]))
    ? HH_THEME_URI . '/assets/img/' . $hh_service_hero_images[$hh_cat_slug]
    : $hh_card_image;

// JSON-LD Service schema (SEO.tsx port) — Yoast handles the rest of <head>.
$hh_json_ld = [
    '@context'    => 'https://schema.org',
    '@type'       => 'Service',
    'serviceType' => get_the_title(),
    'provider'    => ['@type' => 'MovingCompany', 'name' => hh_setting('company_name', 'Heavy Haul Group'), 'telephone' => $hh_phone],
    'areaServed'  => 'United States',
    'description' => $hh_blurb,
];
?>
<script type="application/ld+json"><?php echo wp_json_encode($hh_json_ld); ?></script>

<?php if ($hh_template_type === 'service'): ?>
<?php
// ============================================================================
// SERVICE TEMPLATE — ports src/pages/ServiceDetail.tsx
// Used by: canada-shipping-service, mexico-shipping-service, catastrophic-recovery,
// rigging-and-lifting-service, heavy-machinery-towing, pilot-car-service,
// partial-load-shipping.
// ============================================================================
$hh_eyebrow          = get_field('eyebrow', $hh_cat_id) ?: ($hh_short . ' Services');
$hh_hero_badge        = get_field('hero_badge', $hh_cat_id) ?: 'Fully Insured · 24/7 Dispatch';
$hh_hero_title_lead   = get_field('hero_title_lead', $hh_cat_id) ?: $hh_short;
$hh_hero_title_accent = get_field('hero_title_accent', $hh_cat_id) ?: 'Heavy Haul Shipping';
$hh_hero_sub          = get_field('hero_sub', $hh_cat_id) ?: $hh_blurb;
$hh_intro_title       = get_field('intro_title', $hh_cat_id) ?: ('Full-Service ' . $hh_short . ' Transport');
$hh_intro_body        = hh_lines(get_field('intro_body', $hh_cat_id) ?: '');
if (empty($hh_intro_body) && $hh_blurb) {
    $hh_intro_body = [$hh_blurb];
}
$hh_pillars     = get_field('pillars', $hh_cat_id) ?: [];
$hh_steps       = get_field('steps', $hh_cat_id) ?: [];
$hh_highlights  = hh_lines(get_field('highlights', $hh_cat_id) ?: '');
$hh_stats       = get_field('stats', $hh_cat_id) ?: [];
$hh_facts_title = get_field('facts_title', $hh_cat_id) ?: ('What You Should Know About ' . $hh_short);
$hh_facts       = hh_lines(get_field('facts', $hh_cat_id) ?: '');
$hh_faqs        = get_field('faqs', $hh_cat_id) ?: [];
$hh_cta_title   = get_field('cta_title', $hh_cat_id) ?: ('Get Your ' . $hh_short . ' Quote');
$hh_service_gallery = get_field('service_gallery', $hh_cat_id) ?: [];

$hh_is_canada = $hh_cat_slug === 'canada-shipping-service';
$hh_is_mexico = $hh_cat_slug === 'mexico-shipping-service';
$hh_is_border = $hh_is_canada || $hh_is_mexico;
$hh_is_partial = $hh_cat_slug === 'partial-load-shipping';

// Which hero quote widget: ServiceQuoteForm.tsx built category-specific multi-step wizards
// for these 4 slugs; the rest fell back to InstantQuoteCalculator. Rather than duplicate a
// bespoke JS-driven wizard per category (the fields those variants captured — incident
// location, load dims, weight, etc. — aren't relayed by the existing lead-submit JS either
// way), we reuse the theme's existing quote-form.php "card" variant for those 4 (same
// card/badge/CTA chrome, generic pickup/delivery/equipment fields, already wired to real
// lead submission) and instant-quote-calculator.php for the rest — an exact match to the
// original for those 3. See final report for the full rationale.
$hh_uses_quote_form_card = in_array($hh_cat_slug, ['pilot-car-service', 'rigging-and-lifting-service', 'catastrophic-recovery', 'heavy-machinery-towing'], true);

// Static fallback photo galleries (GALLERIES map) — only used pre-content, when the
// `service_gallery` repeater hasn't been populated in wp-admin yet. Filenames are the real
// per-service photos copied from src/assets/*.
$hh_gallery_fallback_map = [
    'catastrophic-recovery' => [
        'eyebrow' => 'Recovery In Action', 'title' => 'Every Scenario', 'accent' => 'Covered',
        'sub' => 'From overturns and floods to highway incidents and wildfire zones — our crews and gear are built for the worst days on the job.',
        'items' => [
            ['src' => 'recovery-1.jpg', 'title' => 'Overturn & Rollover', 'desc' => 'Lifting equipment back upright with rotators and cranes.'],
            ['src' => 'recovery-2.jpg', 'title' => 'Flood & Storm Response', 'desc' => 'Recovering iron from flooded sites and storm aftermath.'],
            ['src' => 'recovery-3.jpg', 'title' => 'Highway Incidents', 'desc' => 'Fast-clear recoveries on active highways and interstates.'],
            ['src' => 'recovery-4.jpg', 'title' => 'Wildfire & Hazard Zones', 'desc' => 'Loading damaged equipment from fire and hazard zones.'],
        ],
    ],
    'canada-shipping-service' => [
        'eyebrow' => 'USA ↔ Canada Lanes', 'title' => 'Border To Border —', 'accent' => 'Coast To Coast',
        'sub' => 'From the Pacific Highway crossing to Detroit–Windsor and out to the Maritimes — bonded heavy haul wherever your equipment needs to go.',
        'items' => [
            ['src' => 'canada-1.jpg', 'title' => 'Pacific Highway Crossing', 'desc' => 'Daily lanes BC ↔ WA with CTPAT / FAST carriers staged at the border.'],
            ['src' => 'canada-2.jpg', 'title' => 'Alberta & Prairie Lanes', 'desc' => 'Heavy iron into Edmonton, Calgary, Saskatoon and back south for oil & gas.'],
            ['src' => 'canada-3.jpg', 'title' => 'CBSA Bonded Paperwork', 'desc' => 'ACI / ACE filings, PARS / PAPS labels, B3 entries — handled in-house.'],
            ['src' => 'canada-4.jpg', 'title' => 'Detroit ↔ Windsor', 'desc' => 'Ambassador & Gordie Howe crossings — Ontario, Quebec and the U.S. Midwest.'],
        ],
    ],
    'mexico-shipping-service' => [
        'eyebrow' => 'USA ↔ Mexico Lanes', 'title' => 'Bonded Drayage,', 'accent' => 'Bilingual Dispatch',
        'sub' => 'Laredo, Otay Mesa, El Paso, Pharr & Eagle Pass — we coordinate U.S. carriers, bonded drayage and OEA-certified Mexican carriers under one file.',
        'items' => [
            ['src' => 'mexico-1.jpg', 'title' => 'Laredo World Trade Bridge', 'desc' => 'The busiest commercial crossing on the southern border — daily heavy haul lanes.'],
            ['src' => 'mexico-2.jpg', 'title' => 'Monterrey & Maquiladora Lanes', 'desc' => 'Production equipment into IMMEX facilities under temporary import provisions.'],
            ['src' => 'mexico-3.jpg', 'title' => 'El Paso ↔ Ciudad Juárez', 'desc' => 'Bonded drayage and southbound Mexican carrier handoff coordinated end-to-end.'],
            ['src' => 'mexico-4.jpg', 'title' => 'Pedimento & SAT Clearance', 'desc' => 'Coordinated with your agente aduanal — or we introduce you to one of ours.'],
        ],
    ],
    'rigging-and-lifting-service' => [
        'eyebrow' => 'Rigging In Action', 'title' => 'Engineered Lifts,', 'accent' => 'Executed Right',
        'sub' => 'Mobile cranes, crawler cranes, hydraulic gantries and Versa-Lifts — sized to the load, planned to the inch.',
        'items' => [
            ['src' => 'rigging-1.jpg', 'title' => 'Heavy Mobile Crane Picks', 'desc' => '50T–500T+ mobile cranes for plant moves, machinery installs and load-outs.'],
            ['src' => 'rigging-2.jpg', 'title' => 'Hydraulic Gantry Systems', 'desc' => "In-plant lifts where cranes can't fit — gantries, jacking and air skates."],
            ['src' => 'rigging-3.jpg', 'title' => 'Crawler Crane Operations', 'desc' => 'Tandem picks and confined-site lifts with full engineered lift plans.'],
        ],
    ],
    'pilot-car-service' => [
        'eyebrow' => 'Escort In Action', 'title' => 'Lead, Chase,', 'accent' => 'High-Pole',
        'sub' => 'Certified pilot car operators in all 50 states — bundled with your heavy haul booking or dispatched standalone.',
        'items' => [
            ['src' => 'pilot-1.jpg', 'title' => 'Lead Pilot Cars', 'desc' => 'OVERSIZE LOAD banners, flashing lights, warning traffic ahead of your load.'],
            ['src' => 'pilot-2.jpg', 'title' => 'High-Pole Verification', 'desc' => 'Adjustable height poles physically test every overhead obstruction first.'],
            ['src' => 'pilot-3.jpg', 'title' => 'Chase & Long-Haul Escort', 'desc' => 'Chase units stay with your load coast-to-coast through every state.'],
        ],
    ],
    'heavy-machinery-towing' => [
        'eyebrow' => 'Recovery In Action', 'title' => 'When Standard', 'accent' => "Tow Trucks Can't",
        'sub' => '75-ton-plus rotators, integrated heavy wreckers and multi-axle lowboys — dispatched 24/7 nationwide.',
        'items' => [
            ['src' => 'towing-1.jpg', 'title' => 'Rotator Lift & Upright', 'desc' => 'Overturned semis and wrecked equipment uprighted with 75T+ rotators.'],
            ['src' => 'towing-2.jpg', 'title' => 'Integrated Heavy Wreckers', 'desc' => 'Disabled tractors, dumps and vocational vehicles back to the shop.'],
            ['src' => 'towing-3.jpg', 'title' => 'Lowboy Equipment Recovery', 'desc' => 'Stuck or disabled construction iron loaded onto multi-axle lowboys.'],
        ],
    ],
    'partial-load-shipping' => [
        'eyebrow' => 'Partial Loads In Action', 'title' => 'Pay Only For', 'accent' => 'Your Space',
        'sub' => 'Pallets, attachments, single machines — consolidated on shared trailers so you never pay for empty deck.',
        'items' => [
            ['src' => 'partial-1.jpg', 'title' => 'Consolidated Flatbeds', 'desc' => 'Multiple shippers, one lane — costs split by linear feet.'],
            ['src' => 'partial-2.jpg', 'title' => 'Single-Machine Partials', 'desc' => 'Skid steers, mini excavators and attachments at LTL rates.'],
            ['src' => 'partial-3.jpg', 'title' => 'Palletized LTL Freight', 'desc' => 'Crated machinery parts, tooling and dealer inventory.'],
        ],
    ],
];
$hh_gallery_data = $hh_gallery_fallback_map[$hh_cat_slug] ?? null;

// Border-crossing highlight cards (CrossBorderRoute companion list) — fixed copy specific
// to these 2 categories, same as the original hand-coded isCanada ternary.
$hh_border_highlights = $hh_is_canada ? [
    ['k' => 'Northbound', 'v' => 'ACE eManifest + PARS pre-cleared. Ritchie Bros / IronPlanet wins delivered to ON, AB, BC, QC.'],
    ['k' => 'Southbound', 'v' => 'PAPS sticker, bonded driver. Cat dozers & ag iron to U.S. jobsites — no broker chasing.'],
    ['k' => 'One Point', 'v' => 'One dispatcher, one quote (CAD/USD), one invoice. Live GPS pickup → drop.'],
] : [
    ['k' => 'Southbound', 'v' => 'Pedimento + bonded drayage to maquiladoras in MTY, Saltillo, Querétaro, CDMX.'],
    ['k' => 'Northbound', 'v' => 'ACE eManifest, EPA & DOT prepped before the bridge. MX auction iron rolled north.'],
    ['k' => 'Bilingual', 'v' => 'EN/ES dispatch staged at Laredo, Otay Mesa, El Paso, Pharr, Eagle Pass.'],
];
$hh_border_crossings = $hh_is_canada
    ? ['Pacific Hwy', 'Sweetgrass', 'Pembina', 'Detroit–Windsor', 'Buffalo', 'Champlain']
    : ['Laredo', 'Otay Mesa', 'El Paso', 'Pharr', 'Eagle Pass'];

// Partial-load cost-comparison section — only ever used by this one category, so kept as
// plain static PHP (matches the original's `cat.slug === "partial-load-shipping"` gate).
$hh_partial_benefits = [
    ['icon' => 'percent', 'big' => '40%', 'label' => 'Average Cost Savings', 'desc' => 'vs. paying for a full truckload when you only need part of the trailer.'],
    ['icon' => 'trending-down', 'big' => '$1.8K', 'label' => 'Avg. Saved Per Load', 'desc' => 'on a typical 1,000-mile partial haul instead of booking a dedicated truck.'],
    ['icon' => 'piggy-bank', 'big' => '1/3', 'label' => 'Pay Just A Third', 'desc' => 'of trailer linear feet — perfect for single machines or palletized freight.'],
    ['icon' => 'dollar-sign', 'big' => '$0', 'label' => 'Hidden Fees', 'desc' => 'One all-in quote — fuel, permits, insurance bundled. No surprises at delivery.'],
];

// Other real service_category posts for the "Related Services" grid at the bottom.
$hh_related_categories = array_filter(get_posts([
    'post_type' => 'service_category',
    'posts_per_page' => 7,
    'orderby' => 'menu_order',
    'order' => 'ASC',
]), fn($p) => $p->ID !== $hh_cat_id);
$hh_related_categories = array_slice($hh_related_categories, 0, 6);
?>

<!-- HERO with quote widget -->
<section class="relative bg-secondary text-secondary-foreground overflow-hidden">
    <img src="<?php echo esc_url($hh_hero_image); ?>" alt="<?php echo esc_attr(get_the_title()); ?>" class="absolute inset-0 h-full w-full object-cover" loading="eager" width="1920" height="900">
    <div class="absolute inset-0 bg-gradient-to-r from-secondary/75 via-secondary/25 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-secondary/10"></div>

    <div class="relative container-tight py-14 lg:py-24">
        <nav class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 mb-5">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-primary">Home</a>
            <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
            <a href="<?php echo esc_url(home_url('/services')); ?>" class="hover:text-primary">Services</a>
            <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
            <span class="text-primary"><?php echo esc_html($hh_short); ?></span>
        </nav>

        <div class="grid lg:grid-cols-12 gap-10 items-start">
            <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 rounded-sm bg-primary/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                    <?php echo hh_lucide('shield-check', 'h-3.5 w-3.5'); ?> <?php echo esc_html($hh_hero_badge); ?>
                </div>
                <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3"><?php echo esc_html($hh_eyebrow); ?></p>
                <h1 class="stencil text-4xl sm:text-6xl lg:text-7xl font-bold uppercase max-w-3xl leading-[0.95]">
                    <?php echo esc_html($hh_hero_title_lead); ?> <span class="text-primary"><?php echo esc_html($hh_hero_title_accent); ?></span>
                </h1>
                <p class="mt-5 text-lg text-white/85 max-w-2xl"><?php echo esc_html($hh_hero_sub); ?></p>
                <div class="mt-7 flex flex-wrap gap-3">
                    <a href="<?php echo esc_attr($hh_phone_href); ?>"><?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'hero', 'xl'); ?></a>
                    <a href="#quote"><?php hh_button('Get Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'call', 'xl'); ?></a>
                </div>
                <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-white/80">
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> Fully Insured</span>
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> 24/7 Dispatch</span>
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> Nationwide</span>
                </div>
            </div>
            <aside id="quote" class="lg:col-span-5 scroll-mt-24">
                <?php if ($hh_uses_quote_form_card): ?>
                    <?php get_template_part('template-parts/quote-form', null, ['variant' => 'card']); ?>
                <?php else: ?>
                    <?php get_template_part('template-parts/instant-quote-calculator'); ?>
                <?php endif; ?>
            </aside>
        </div>
    </div>

    <div class="relative h-[3px] w-full overflow-hidden bg-secondary-foreground/10">
        <div class="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_hsl(var(--primary))] animate-sweep-x"></div>
    </div>
</section>

<?php get_template_part('template-parts/recent-shipments-ticker'); ?>

<!-- INTRO -->
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight <?php echo $hh_is_border ? '' : 'grid lg:grid-cols-12 gap-10'; ?>">
        <div class="<?php echo $hh_is_border ? '' : 'lg:col-span-8'; ?>">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">About This Service</p>
            <h2 class="stencil text-3xl sm:text-5xl font-bold uppercase mb-5 leading-[0.95]"><?php echo esc_html($hh_intro_title); ?></h2>

            <?php if ($hh_is_border): ?>
                <?php if (!empty($hh_intro_body[0])): ?>
                    <p class="text-muted-foreground leading-relaxed text-[15px] max-w-3xl"><?php echo esc_html($hh_intro_body[0]); ?></p>
                <?php endif; ?>

                <div class="mt-10 grid lg:grid-cols-12 gap-8 items-center">
                    <div class="lg:col-span-7">
                        <?php get_template_part('template-parts/cross-border-route', null, [
                            'from' => ['code' => 'USA', 'name' => 'United States'],
                            'to' => $hh_is_canada ? ['code' => 'CAN', 'name' => 'Canada'] : ['code' => 'MEX', 'name' => 'Mexico'],
                            'crossings' => $hh_border_crossings,
                        ]); ?>
                    </div>
                    <div class="lg:col-span-5">
                        <ul class="divide-y divide-border border-2 border-border bg-card rounded-md">
                            <?php foreach ($hh_border_highlights as $h): ?>
                                <li class="p-4 sm:p-5">
                                    <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1.5"><?php echo esc_html($h['k']); ?></div>
                                    <p class="text-[13.5px] text-muted-foreground leading-relaxed"><?php echo esc_html($h['v']); ?></p>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
            <?php else: ?>
                <div class="text-muted-foreground leading-relaxed text-[15px] space-y-4">
                    <?php foreach ($hh_intro_body as $p): ?>
                        <p><?php echo esc_html($p); ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if ($hh_is_border && !empty($hh_highlights)): ?>
                <div class="mt-10 bg-secondary text-secondary-foreground rounded-md p-6 sm:p-7 border-t-4 border-primary shadow-card">
                    <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
                        <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary">What's Included</div>
                        <a href="#quote" class="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
                            Request Quote <?php echo hh_lucide('arrow-right', 'h-3.5 w-3.5'); ?>
                        </a>
                    </div>
                    <ul class="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        <?php foreach ($hh_highlights as $h): ?>
                            <li class="flex items-start gap-2 text-[13px] text-white/90">
                                <?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary mt-0.5 shrink-0'); ?>
                                <span class="font-medium"><?php echo esc_html($h); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>

        <?php if (!$hh_is_border && !empty($hh_highlights)): ?>
            <aside class="lg:col-span-4">
                <div class="bg-secondary text-secondary-foreground rounded-md p-6 border-t-4 border-primary shadow-card sticky top-24">
                    <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">What's Included</div>
                    <ul class="space-y-2.5">
                        <?php foreach ($hh_highlights as $h): ?>
                            <li class="flex items-start gap-2 text-[13px] text-white/90">
                                <?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary mt-0.5 shrink-0'); ?>
                                <span class="font-medium"><?php echo esc_html($h); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    <a href="#quote" class="mt-5 inline-flex items-center justify-between w-full gap-2 rounded-sm bg-primary px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
                        Request Quote <?php echo hh_lucide('arrow-right', 'h-4 w-4'); ?>
                    </a>
                </div>
            </aside>
        <?php endif; ?>
    </div>
</section>

<!-- PILLARS -->
<?php if (!empty($hh_pillars)): ?>
<section class="py-14 sm:py-20 bg-muted/40 border-y border-border">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">What We Deliver</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html($hh_short); ?> <span class="text-primary">Done Right</span></h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <?php foreach ($hh_pillars as $p): $icon_key = $p['icon'] ?: 'shield-check'; ?>
                <div class="h-full bg-card border-2 border-border rounded-md p-6 hover:border-primary hover:shadow-card transition-all">
                    <span class="inline-flex h-12 w-12 rounded-md bg-primary text-primary-foreground items-center justify-center mb-4">
                        <?php echo isset(HH_LUCIDE_PATHS[$icon_key]) ? hh_lucide($icon_key, 'h-6 w-6') : hh_icon($icon_key, 'h-6 w-6'); ?>
                    </span>
                    <h3 class="font-display uppercase text-lg mb-2 leading-tight"><?php echo esc_html($p['title'] ?? ''); ?></h3>
                    <p class="text-sm text-muted-foreground leading-relaxed"><?php echo esc_html($p['desc'] ?? ''); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- PHOTO GALLERY -->
<?php
$hh_sg_items = [];
if (!empty($hh_service_gallery)) {
    foreach ($hh_service_gallery as $row) {
        $src = is_array($row['src'] ?? null) ? ($row['src']['url'] ?? '') : '';
        if ($src) {
            $hh_sg_items[] = ['src' => $src, 'title' => $row['title'] ?? '', 'desc' => $row['desc'] ?? ''];
        }
    }
}
if (empty($hh_sg_items) && $hh_gallery_data) {
    foreach ($hh_gallery_data['items'] as $g) {
        $hh_sg_items[] = ['src' => HH_THEME_URI . '/assets/img/' . $g['src'], 'title' => $g['title'], 'desc' => $g['desc']];
    }
}
$hh_gallery_eyebrow = $hh_gallery_data['eyebrow'] ?? 'Recent Loads';
$hh_gallery_title = $hh_gallery_data['title'] ?? $hh_short;
$hh_gallery_accent = $hh_gallery_data['accent'] ?? 'In Action';
$hh_gallery_sub = $hh_gallery_data['sub'] ?? '';
?>
<?php if (!empty($hh_sg_items)): ?>
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2"><?php echo esc_html($hh_gallery_eyebrow); ?></p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html($hh_gallery_title); ?> <span class="text-primary"><?php echo esc_html($hh_gallery_accent); ?></span></h2>
            <?php if ($hh_gallery_sub): ?><p class="mt-3 text-muted-foreground text-[15px]"><?php echo esc_html($hh_gallery_sub); ?></p><?php endif; ?>
        </div>
        <div class="grid gap-5 <?php echo count($hh_sg_items) >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'; ?>">
            <?php foreach ($hh_sg_items as $i => $g): ?>
                <div class="group relative overflow-hidden rounded-md border-2 border-border hover:border-primary transition-all shadow-card">
                    <div class="aspect-[4/3] overflow-hidden bg-muted">
                        <img src="<?php echo esc_url($g['src']); ?>" alt="<?php echo esc_attr($g['title']); ?>" loading="lazy" width="1280" height="960" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                        <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1"><?php echo esc_html(str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT)); ?> · <?php echo esc_html(($w = explode(' ', $hh_gallery_eyebrow)) ? end($w) : ''); ?></div>
                        <h3 class="font-display uppercase text-base text-white leading-tight"><?php echo esc_html($g['title']); ?></h3>
                        <p class="text-[12px] text-white/80 mt-1 leading-snug"><?php echo esc_html($g['desc']); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- STATS -->
<?php if (!empty($hh_stats)): ?>
<section class="py-10 sm:py-12 bg-gradient-dark border-y border-white/10">
    <div class="container-tight grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <?php foreach ($hh_stats as $s): ?>
            <div>
                <div class="stencil text-3xl sm:text-4xl text-primary"><?php echo esc_html($s['v'] ?? ''); ?></div>
                <div class="font-bold uppercase tracking-wider text-xs sm:text-sm text-white mt-1"><?php echo esc_html($s['l'] ?? ''); ?></div>
            </div>
        <?php endforeach; ?>
    </div>
</section>
<?php endif; ?>

<!-- PARTIAL LOAD — revenue & cost benefits (static, single-category section) -->
<?php if ($hh_is_partial): ?>
<section class="py-14 sm:py-20 bg-gradient-dark text-white border-y border-white/10 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.06]" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 14px, hsl(var(--primary)) 14px, hsl(var(--primary)) 28px);"></div>
    <div class="relative container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Revenue & Cost Benefits</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase">Why Partial Loads <span class="text-primary">Win On Cost</span></h2>
            <p class="mt-3 text-white/75 text-[15px]">Booking a full truck for a single machine or a few pallets is money on the table. Partial loads share trailer space so your freight only pays for what it uses — and the savings compound on every lane.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php foreach ($hh_partial_benefits as $b): ?>
                <div class="h-full bg-white/[0.04] border border-white/10 rounded-md p-6 hover:border-primary transition-all">
                    <span class="inline-flex h-11 w-11 rounded-md bg-primary text-primary-foreground items-center justify-center mb-4"><?php echo hh_lucide($b['icon'], 'h-5 w-5'); ?></span>
                    <div class="stencil text-4xl sm:text-5xl text-primary leading-none"><?php echo esc_html($b['big']); ?></div>
                    <div class="font-display uppercase text-sm tracking-wider mt-2 text-white"><?php echo esc_html($b['label']); ?></div>
                    <p class="text-[13px] text-white/70 mt-2 leading-relaxed"><?php echo esc_html($b['desc']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="mt-10 grid lg:grid-cols-2 gap-5">
            <div class="bg-white/[0.04] border border-white/10 rounded-md p-6">
                <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">Full Truckload</div>
                <div class="flex items-baseline gap-2"><span class="stencil text-4xl text-white/40 line-through">$4,500</span><span class="text-xs text-white/50">1,000 mi · single machine</span></div>
                <ul class="mt-4 space-y-1.5 text-[13px] text-white/70">
                    <li>· Pay for 53 ft of empty deck</li>
                    <li>· Wait for dedicated dispatch</li>
                    <li>· Full insurance & fuel on you</li>
                </ul>
            </div>
            <div class="bg-primary/15 border-2 border-primary rounded-md p-6 relative">
                <span class="absolute -top-3 right-4 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm">You Save 40%</span>
                <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-3">Partial Load</div>
                <div class="flex items-baseline gap-2"><span class="stencil text-5xl text-primary">$2,700</span><span class="text-xs text-white/70">same 1,000 mi · same machine</span></div>
                <ul class="mt-4 space-y-1.5 text-[13px] text-white/90">
                    <li class="flex gap-2"><?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary shrink-0 mt-0.5'); ?> Pay only the linear feet you use</li>
                    <li class="flex gap-2"><?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary shrink-0 mt-0.5'); ?> Dispatched in 2–5 business days</li>
                    <li class="flex gap-2"><?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary shrink-0 mt-0.5'); ?> $1M cargo insurance included</li>
                </ul>
            </div>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- HOW IT WORKS -->
<?php if (!empty($hh_steps)): ?>
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight max-w-4xl">
        <div class="text-center mb-12">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">How It Works</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase">From Call To <span class="text-primary">Completed</span></h2>
        </div>
        <div class="relative pl-8 sm:pl-12">
            <div class="absolute left-3 sm:left-5 top-0 bottom-0 w-0.5 bg-border"></div>
            <ol class="space-y-7">
                <?php foreach ($hh_steps as $s): ?>
                    <li class="relative">
                        <span class="absolute -left-8 sm:-left-12 top-0 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] sm:text-xs font-extrabold ring-4 ring-background"><?php echo esc_html($s['n'] ?? ''); ?></span>
                        <div class="bg-card border border-border rounded-md p-5 hover:border-primary transition-colors">
                            <h3 class="font-display uppercase text-lg mb-1.5"><?php echo esc_html($s['t'] ?? ''); ?></h3>
                            <p class="text-sm text-muted-foreground leading-relaxed"><?php echo esc_html($s['d'] ?? ''); ?></p>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ol>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- FACTS -->
<?php if (!empty($hh_facts)): ?>
<section class="py-14 sm:py-20 bg-secondary text-secondary-foreground">
    <div class="container-tight max-w-5xl">
        <div class="mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Good To Know</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html($hh_facts_title); ?></h2>
        </div>
        <ul class="grid sm:grid-cols-2 gap-4">
            <?php foreach ($hh_facts as $i => $f): ?>
                <li class="flex gap-3 bg-background/[0.04] border border-white/10 rounded-md p-4">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-extrabold"><?php echo esc_html(str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT)); ?></span>
                    <p class="text-[14px] text-white/90 leading-relaxed"><?php echo esc_html($f); ?></p>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
<?php endif; ?>

<!-- TRUST STRIP -->
<section class="bg-background border-y border-border">
    <div class="container-tight py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('badge-check', 'h-3.5 w-3.5 text-primary'); ?> FMCSA Licensed</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('shield-check', 'h-3.5 w-3.5 text-primary'); ?> $1M Cargo Insured</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('award', 'h-3.5 w-3.5 text-primary'); ?> Bonded & Compliant</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('map-pin', 'h-3.5 w-3.5 text-primary'); ?> 50-State Authority</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('star', 'h-3.5 w-3.5 text-primary fill-primary'); ?> BBB A+ Rated</span>
    </div>
</section>

<!-- CTA BANNER -->
<section class="relative overflow-hidden bg-gradient-amber text-primary-foreground">
    <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(0,0,0,0.18) 14px, rgba(0,0,0,0.18) 28px);"></div>
    <div class="relative container-tight py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
            <span class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <span class="absolute inset-0 rounded-full bg-secondary animate-ping opacity-40"></span>
                <?php echo hh_lucide('phone', 'relative h-5 w-5'); ?>
            </span>
            <div>
                <div class="text-[11px] font-extrabold uppercase tracking-[0.25em] opacity-90">Dispatcher Online Now</div>
                <div class="font-display uppercase text-2xl sm:text-3xl leading-tight"><?php echo esc_html($hh_cta_title); ?></div>
            </div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
            <a href="<?php echo esc_attr($hh_phone_href); ?>"><?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'call', 'xl', 'hover-scale'); ?></a>
            <a href="#quote"><?php hh_button('Get Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'default', 'xl', 'bg-secondary text-white hover:bg-secondary/90 hover-scale font-bold uppercase tracking-wide'); ?></a>
        </div>
    </div>
</section>

<!-- FAQS -->
<?php if (!empty($hh_faqs)): ?>
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight max-w-4xl">
        <div class="text-center mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">FAQs</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html($hh_short); ?> <span class="text-primary">FAQs</span></h2>
        </div>
        <div class="space-y-3">
            <?php foreach ($hh_faqs as $i => $f): ?>
                <details class="group bg-card border border-border rounded-md px-5 shadow-sm hover:border-primary/50 transition-colors" <?php echo $i === 0 ? 'open' : ''; ?>>
                    <summary class="flex items-center justify-between gap-3 cursor-pointer list-none font-sans font-extrabold text-base sm:text-lg text-foreground hover:text-primary py-5 [&::-webkit-details-marker]:hidden">
                        <?php echo esc_html($f['q'] ?? ''); ?>
                        <?php echo hh_lucide('chevron-down', 'h-4 w-4 shrink-0 transition-transform group-open:rotate-180'); ?>
                    </summary>
                    <div class="text-muted-foreground text-[15px] leading-relaxed pb-5"><?php echo esc_html($f['a'] ?? ''); ?></div>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- RELATED SERVICES -->
<section class="py-14 bg-muted/40 border-t border-border">
    <div class="container-tight">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4">Related Services</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ($hh_related_categories as $rc):
                $rc_hero = get_field('hero_image', $rc->ID);
                $rc_img = (is_array($rc_hero) && !empty($rc_hero['url'])) ? $rc_hero['url'] : HH_THEME_URI . '/assets/img/' . ($hh_fallback_images[$rc->post_name] ?? 'hero-truck.jpg');
                ?>
                <a href="<?php echo esc_url(home_url('/services/' . $rc->post_name)); ?>" class="group flex items-center gap-4 bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                    <img src="<?php echo esc_url($rc_img); ?>" alt="<?php echo esc_attr($rc->post_title); ?>" loading="lazy" class="h-16 w-20 object-cover rounded-sm" width="80" height="64">
                    <div class="flex-1">
                        <div class="font-display uppercase text-sm"><?php echo esc_html($rc->post_title); ?></div>
                        <div class="text-xs text-muted-foreground">Heavy haul service</div>
                    </div>
                    <?php echo hh_lucide('arrow-right', 'h-4 w-4 text-muted-foreground group-hover:text-primary'); ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php else: ?>
<?php
// ============================================================================
// FREIGHT TEMPLATE — ports src/pages/Category.tsx
// Used by: construction-equipment-transport, agricultural-equipment-transport,
// industrial-machinery-transport, heavy-duty-truck-transport.
// ============================================================================
$hh_flag_url = $hh_state ? 'https://flagcdn.com/w1280/us-' . strtolower($hh_state['abbr']) . '.png' : '';
$hh_flag_badge = $hh_state ? 'https://flagcdn.com/w80/us-' . strtolower($hh_state['abbr']) . '.png' : '';

// Gallery — real per-category photo sets (GALLERY_BY_CAT / ALL_GALLERY fallback).
$hh_gallery_by_cat = [
    'construction-equipment-transport' => ['gallery/loaded-excavator.jpg', 'gallery/loaded-bulldozer.jpg', 'gallery/loaded-loader.jpg', 'gallery/loaded-bobcat.jpg', 'gallery/loaded-forklift.jpg', 'gallery/loaded-cnc.jpg', 'gallery/loaded-tractor.jpg', 'gallery/loaded-combine.jpg'],
    'agricultural-equipment-transport' => ['gallery/loaded-combine.jpg', 'gallery/loaded-tractor.jpg', 'gallery/loaded-bulldozer.jpg', 'gallery/loaded-loader.jpg', 'gallery/loaded-forklift.jpg', 'gallery/loaded-excavator.jpg', 'gallery/loaded-bobcat.jpg', 'gallery/loaded-cnc.jpg'],
    'industrial-machinery-transport'   => ['industrial-transformer.jpg', 'industrial-cnc.jpg', 'industrial-generator.jpg', 'industrial-windblade.jpg', 'gallery/loaded-cnc.jpg', 'gallery/loaded-forklift.jpg', 'gallery/loaded-loader.jpg', 'gallery/loaded-excavator.jpg'],
    'heavy-duty-truck-transport'       => ['truck-semi.jpg', 'truck-dump.jpg', 'truck-fire.jpg', 'truck-tow.jpg', 'truck-bus.jpg', 'gallery/loaded-bulldozer.jpg', 'gallery/loaded-loader.jpg', 'gallery/loaded-excavator.jpg'],
];
$hh_all_gallery = ['gallery/loaded-excavator.jpg', 'gallery/loaded-bulldozer.jpg', 'gallery/loaded-loader.jpg', 'gallery/loaded-bobcat.jpg', 'gallery/loaded-combine.jpg', 'gallery/loaded-tractor.jpg', 'gallery/loaded-cnc.jpg', 'gallery/loaded-forklift.jpg'];
$hh_gallery_files = $hh_gallery_by_cat[$hh_cat_slug] ?? $hh_all_gallery;
$hh_gallery_urls = array_map(fn($f) => HH_THEME_URI . '/assets/img/' . $f, $hh_gallery_files);

// Equipment list — real ACF content when populated; falls back to this category's
// subcategory titles for internal linking (matches the original's `?? cat.subcategories`).
$hh_equipment_list = hh_lines(get_field('equipment_list', $hh_cat_id) ?: '');
if (empty($hh_equipment_list)) {
    $hh_sub_posts = get_posts([
        'post_type' => 'service_subcategory',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
        'meta_query' => [['key' => 'parent_category', 'value' => $hh_cat_id]],
    ]);
    $hh_equipment_list = array_map(fn($s) => $s->post_title, $hh_sub_posts);
}

// Fixed chrome shared by all 4 freight categories (identical copy in the original, only
// the category-specific $hh_short_lower / $hh_state substitutions vary).
$hh_why_us = [
    ['icon' => 'shield-check', 't' => 'Fully Insured & DOT Compliant', 'd' => 'Up to $1M cargo coverage and full liability on every load — including specialty oversize permits.'],
    ['icon' => 'clock', 't' => 'Same-Day Dispatch', 'd' => 'Live dispatchers route your load within minutes, with same-week pickup on most lanes nationwide.'],
    ['icon' => 'dollar-sign', 't' => 'Transparent Pricing', 'd' => 'No hidden permit fees, no fuel surprises. One quote, locked in, all-in.'],
    ['icon' => 'users', 't' => 'Vetted Carrier Network', 'd' => 'Pre-screened heavy haul specialists with verified safety scores and equipment-specific experience.'],
    ['icon' => 'file-check', 't' => 'Permits & Route Surveys', 'd' => 'We handle all 50-state permits, pilot cars, escorts, and bridge analysis in-house.'],
    ['icon' => 'headphones', 't' => '24/7 Load Tracking', 'd' => 'Real-time GPS updates and a dispatcher on call from pickup to proof of delivery.'],
];

$hh_audience_cards = [
    ['icon' => 'gavel', 'tag' => 'Auction Buyers', 'title' => 'Bought At Auction', 'subtitle' => 'Ritchie Bros · IronPlanet · Purple Wave',
        'desc' => "Won a piece at auction? We pick up directly from the auction yard and deliver to your jobsite — title, gate pass, and load-out handled.",
        'bullets' => ['Yard pickup coordination', 'Same-week dispatch', 'Pay-after-pickup options'], 'cta' => 'Quote My Auction Win'],
    ['icon' => 'package', 'tag' => 'One-Time Shipper', 'title' => 'Single Move', 'subtitle' => 'Private sellers · Owner-operators',
        'desc' => 'Selling, relocating, or moving one machine? You get the same white-glove dispatch as a fleet customer — no minimums, no runaround.',
        'bullets' => ['No volume required', 'Insured door-to-door', 'Real human dispatcher'], 'cta' => 'Ship One Machine'],
    ['icon' => 'building-2', 'tag' => 'Dealers & Rentals', 'title' => 'Consistent Freight', 'subtitle' => 'Dealers · Rental yards · OEMs',
        'desc' => 'Ship with us week after week. Dedicated account reps, custom lane pricing, fleet portal, and Net-30 terms for qualified accounts.',
        'bullets' => ['Dedicated account rep', 'Volume lane pricing', 'Net-30 billing'], 'cta' => 'Open A Dealer Account'],
    ['icon' => 'hard-hat', 'tag' => 'Contractors & Fleets', 'title' => 'Construction Co. Fleets', 'subtitle' => 'GCs · Site contractors · Public works',
        'desc' => 'Contractors moving iron between jobsites get same-day dispatch, project-based COIs, and a dispatcher who knows your foreman by name.',
        'bullets' => ['Jobsite-to-jobsite moves', 'Project COIs in 15 min', '24/7 emergency dispatch'], 'cta' => 'Move My Fleet'],
];

$hh_faqs_freight = [
    ['q' => "How much does {$hh_short_lower} transport cost?", 'a' => "Most {$hh_short_lower} loads run \$2.50–\$5.50 per mile depending on weight, dimensions, distance, and oversize permits. Send your equipment make, model, and lane for a locked-in all-in quote in under 10 minutes."],
    ['q' => "How fast can you pick up my {$hh_short_lower} equipment?", 'a' => "Standard pickups dispatch within 24–48 hours. Same-day and emergency {$hh_short_lower} dispatch is available — we have vetted carriers staged in every region of the U.S."],
    ['q' => 'Do you handle permits, pilot cars, and route surveys?', 'a' => "Yes — every oversize/overweight {$hh_short_lower} load gets full in-house permit handling, route surveys, bridge analysis, and pilot car / escort coordination across all 50 states."],
    ['q' => "Is my {$hh_short_lower} equipment insured in transit?", 'a' => 'Every load carries up to $1M in cargo coverage plus $1M liability. Certificates of insurance are issued within 15 minutes of booking — name your project, jobsite, or lender as additional insured at no charge.'],
    ['q' => "What trailers do you use for {$hh_short_lower} transport?", 'a' => 'Depending on your load: RGN/lowboy for tall and tracked equipment, step deck for medium height, flatbed for standard, and multi-axle/perimeter trailers for superloads. We match the right trailer to your exact spec.'],
    ['q' => "Do you ship {$hh_short_lower} to Canada or Mexico?", 'a' => "Yes — fully licensed cross-border {$hh_short_lower} transport with customs brokerage, FAST/CTPAT clearance, and bilingual dispatch for Canada and Mexico lanes."],
];

$hh_related_categories = array_filter(get_posts([
    'post_type' => 'service_category',
    'posts_per_page' => 7,
    'orderby' => 'menu_order',
    'order' => 'ASC',
]), fn($p) => $p->ID !== $hh_cat_id);
$hh_related_categories = array_slice($hh_related_categories, 0, 6);
?>

<!-- HERO with embedded quote widget -->
<section class="relative bg-secondary text-secondary-foreground overflow-hidden">
    <img src="<?php echo esc_url($hh_hero_image); ?>" alt="<?php echo esc_attr(get_the_title() . ' loaded on heavy haul trailer'); ?>" class="absolute inset-0 h-full w-full object-cover opacity-95" loading="eager" width="1920" height="900">
    <div class="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-secondary/20"></div>

    <div class="relative container-tight py-14 lg:py-24">
        <nav class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/70 mb-5 flex-wrap">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-primary">Home</a>
            <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
            <a href="<?php echo esc_url(home_url('/services')); ?>" class="hover:text-primary">Services</a>
            <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
            <?php if ($hh_state): ?>
                <a href="<?php echo esc_url(home_url('/services/' . $hh_cat_slug)); ?>" class="hover:text-primary"><?php echo esc_html($hh_short); ?></a>
                <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
                <span class="text-primary"><?php echo esc_html($hh_state['name']); ?></span>
            <?php else: ?>
                <span class="text-primary"><?php echo esc_html($hh_short); ?></span>
            <?php endif; ?>
        </nav>

        <?php if ($hh_state): ?>
            <img src="<?php echo esc_url($hh_flag_url); ?>" alt="" aria-hidden="true" class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-[520px] w-auto opacity-20 mix-blend-screen pointer-events-none">
        <?php endif; ?>

        <div class="grid lg:grid-cols-12 gap-10 items-start">
            <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 rounded-sm bg-primary/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/40 mb-5">
                    <?php if ($hh_state): ?>
                        <img src="<?php echo esc_url($hh_flag_badge); ?>" alt="<?php echo esc_attr($hh_state['name'] . ' flag'); ?>" class="h-3.5 w-5 object-cover rounded-[2px]">
                        Serving All Of <?php echo esc_html($hh_state['name']); ?> · <?php echo esc_html($hh_state['abbr']); ?>
                    <?php else: ?>
                        <?php echo hh_lucide('shield-check', 'h-3.5 w-3.5'); ?> Nationwide · Fully Insured · 24/7 Dispatch
                    <?php endif; ?>
                </div>
                <h1 class="stencil text-4xl sm:text-6xl lg:text-7xl font-bold uppercase max-w-3xl leading-[0.95]">
                    <?php if ($hh_state):
                        echo esc_html($hh_state['name']) . ' ';
                        ?><span class="text-primary"><?php echo esc_html($hh_short); ?> Transport</span>
                    <?php else:
                        $hh_name_words = explode(' ', get_the_title());
                        $hh_last_word = array_pop($hh_name_words);
                        echo esc_html(implode(' ', $hh_name_words)) . ' ';
                        ?><span class="text-primary"><?php echo esc_html($hh_last_word); ?></span>
                    <?php endif; ?>
                </h1>
                <p class="mt-5 text-lg text-white/85 max-w-2xl">
                    <?php if ($hh_state): ?>
                        Nationwide <?php echo esc_html($hh_short_lower); ?> heavy haul carriers dispatching loads in and out of <?php echo esc_html($hh_state['name']); ?> every day — permits, pilot cars, and oversize escorts handled in-house for every <?php echo esc_html($hh_state['abbr']); ?> corridor.
                    <?php else: ?>
                        <?php echo esc_html($hh_blurb); ?>
                    <?php endif; ?>
                </p>
                <div class="mt-7 flex flex-wrap gap-3">
                    <a href="<?php echo esc_attr($hh_phone_href); ?>"><?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'hero', 'xl'); ?></a>
                    <a href="#quote"><?php hh_button(($hh_state ? 'Free ' . esc_html($hh_state['abbr']) . ' Quote' : 'Get Free Quote') . ' ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'call', 'xl'); ?></a>
                </div>
                <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-white/80">
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> $1M Cargo Insured</span>
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> <?php echo $hh_state ? 'All ' . esc_html($hh_state['name']) . ' Counties' : 'All 50 States'; ?></span>
                    <span class="flex items-center gap-1.5"><?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary'); ?> Same-Day Dispatch</span>
                </div>
            </div>

            <aside id="quote" class="lg:col-span-5 scroll-mt-24">
                <?php get_template_part('template-parts/instant-quote-calculator'); ?>
            </aside>
        </div>
    </div>

    <div class="relative h-[3px] w-full overflow-hidden bg-secondary-foreground/10">
        <div class="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_hsl(var(--primary))] animate-sweep-x"></div>
    </div>
</section>

<?php get_template_part('template-parts/recent-shipments-ticker'); ?>

<!-- WHO WE ARE -->
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight grid lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-7 order-2 lg:order-1">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3"><?php echo $hh_state ? esc_html($hh_state['name']) . ' Heavy Haul' : 'Who We Are'; ?></p>
            <h2 class="stencil text-3xl sm:text-5xl font-bold uppercase mb-5 leading-[0.95]">
                <?php if ($hh_state): ?>
                    <?php echo esc_html($hh_short); ?> Shipping <span class="text-primary">In <?php echo esc_html($hh_state['name']); ?></span>
                <?php else: ?>
                    Reliable <?php echo esc_html($hh_short); ?> <span class="text-primary">Heavy Haul Carriers</span>
                <?php endif; ?>
            </h2>
            <div class="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                    <?php if ($hh_state): ?>
                        Heavy Haul Group is the <?php echo esc_html($hh_state['name']); ?> <?php echo esc_html($hh_short_lower); ?> transport company shippers call when the load matters. We move <?php echo esc_html($hh_short_lower); ?> equipment to, from, and within every <?php echo esc_html($hh_state['name']); ?> county — same-day dispatch, <?php echo esc_html($hh_state['abbr']); ?> state permits filed in-house, and a dispatcher you can reach 24/7.
                    <?php else: ?>
                        Heavy Haul Group is a nationwide <?php echo esc_html($hh_short_lower); ?> transport company dispatching <?php echo esc_html($hh_short_lower); ?> loads across all 50 states every single day. From single-piece moves to multi-load fleet relocations, our specialists handle permits, pilot cars, route surveys, bridge analysis, and oversize escorts — start to finish.
                    <?php endif; ?>
                </p>
                <p>
                    <?php if ($hh_state): ?>
                        From dealer-to-jobsite deliveries inside <?php echo esc_html($hh_state['name']); ?> to multi-state <?php echo esc_html($hh_short_lower); ?> fleet relocations out of <?php echo esc_html($hh_state['abbr']); ?>, our carriers run RGN, lowboy, step deck, flatbed, and multi-axle trailers permitted for every <?php echo esc_html($hh_state['name']); ?> corridor. Whether you need <?php echo esc_html($hh_short_lower); ?> hauling across <?php echo esc_html($hh_state['name']); ?> or coast-to-coast, we quote in minutes and pick up in days.
                    <?php else: ?>
                        We move <?php echo esc_html($hh_short_lower); ?> equipment for contractors, dealers, rental yards, OEM manufacturers, auction houses, and Fortune-500 operators. Emergency breakdown haul or recurring monthly fleet rotations — our dispatchers match your load to the closest available <?php echo esc_html($hh_short_lower); ?> carrier and quote in minutes.
                    <?php endif; ?>
                </p>
                <p class="text-foreground font-medium">Every shipment is backed by up to $1M in cargo coverage, full DOT/MC compliance, real-time GPS tracking, and a dedicated dispatcher you can reach 24/7.</p>
            </div>
            <ul class="mt-7 grid sm:grid-cols-2 gap-2.5">
                <?php foreach (['Permits, pilot cars & route surveys', '$1M cargo & full liability insured', 'Vetted heavy haul carrier network', 'RGN, lowboy, step deck, flatbed', 'Same-day & emergency dispatch', 'Real-time load tracking 24/7'] as $t): ?>
                    <li class="flex items-start gap-2 text-sm">
                        <?php echo hh_lucide('circle-check-big', 'h-5 w-5 text-primary mt-0.5 shrink-0'); ?>
                        <span class="font-medium"><?php echo esc_html($t); ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
        <div class="lg:col-span-5 order-1 lg:order-2">
            <div class="relative rounded-md overflow-hidden border-t-4 border-primary shadow-card">
                <img src="<?php echo esc_url($hh_hero_image); ?>" alt="<?php echo esc_attr(get_the_title() . ' on the road'); ?>" loading="lazy" class="w-full h-[360px] sm:h-[440px] object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 inset-x-0 p-5 text-white">
                    <div class="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-1">Trusted Nationwide</div>
                    <div class="font-display uppercase text-lg leading-tight"><?php echo esc_html(get_the_title()); ?></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- TRUST CERTIFICATION STRIP -->
<section class="bg-secondary border-y border-white/10">
    <div class="container-tight py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/70">
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('badge-check', 'h-3.5 w-3.5 text-primary'); ?> FMCSA Licensed</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('shield-check', 'h-3.5 w-3.5 text-primary'); ?> $1M Cargo Insured</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('award', 'h-3.5 w-3.5 text-primary'); ?> Bonded & Compliant</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('map-pin', 'h-3.5 w-3.5 text-primary'); ?> 50-State Authority</span>
        <span class="flex items-center gap-1.5"><?php echo hh_lucide('star', 'h-3.5 w-3.5 text-primary fill-primary'); ?> BBB A+ Rated</span>
    </div>
</section>

<!-- WHO WE SERVE -->
<section class="py-14 sm:py-20 bg-background border-t border-border">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Who We Haul For</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase">One Load Or A <span class="text-primary">Full Fleet</span> — We Handle It</h2>
            <p class="text-muted-foreground mt-3">From a single auction win to year-round dealer freight, our <?php echo esc_html($hh_short_lower); ?> dispatch team is built to scale with you.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php foreach ($hh_audience_cards as $i => $card): ?>
                <div class="group relative h-full bg-card border-2 border-border rounded-md overflow-hidden hover:border-primary hover:shadow-card transition-all flex flex-col">
                    <div class="relative bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
                        <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary ring-2 ring-primary-foreground/30"><?php echo hh_lucide($card['icon'], 'h-5 w-5'); ?></span>
                        <div class="min-w-0">
                            <div class="font-display uppercase text-base sm:text-lg leading-tight tracking-wide truncate"><?php echo esc_html($card['tag']); ?></div>
                            <div class="text-[10px] font-bold uppercase tracking-widest opacity-80 truncate"><?php echo esc_html($card['subtitle']); ?></div>
                        </div>
                    </div>
                    <div class="relative aspect-[4/3] overflow-hidden">
                        <img src="<?php echo esc_url($hh_gallery_urls[$i] ?? $hh_gallery_urls[0]); ?>" alt="<?php echo esc_attr($card['title']); ?>" loading="lazy" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent"></div>
                        <div class="absolute top-3 right-3 h-14 w-14 text-primary/30"><?php echo hh_lucide($card['icon'], 'h-14 w-14'); ?></div>
                        <div class="absolute bottom-3 left-4 right-4">
                            <div class="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary mb-1">For <?php echo esc_html($card['tag']); ?></div>
                            <div class="font-display uppercase text-white text-xl leading-tight"><?php echo esc_html($card['title']); ?></div>
                        </div>
                    </div>
                    <div class="p-5 flex flex-col flex-1">
                        <p class="text-sm text-muted-foreground leading-relaxed"><?php echo esc_html($card['desc']); ?></p>
                        <ul class="mt-4 space-y-1.5">
                            <?php foreach ($card['bullets'] as $b): ?>
                                <li class="flex items-start gap-2 text-[13px]">
                                    <?php echo hh_lucide('circle-check-big', 'h-4 w-4 text-primary mt-0.5 shrink-0'); ?>
                                    <span class="font-medium"><?php echo esc_html($b); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                        <a href="#quote" class="mt-5 inline-flex items-center justify-between gap-2 rounded-sm border-2 border-primary px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                            <?php echo esc_html($card['cta']); ?> <?php echo hh_lucide('arrow-right', 'h-4 w-4'); ?>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- GALLERY + EQUIPMENT LIST -->
<section class="py-14 sm:py-20 bg-secondary text-secondary-foreground">
    <div class="container-tight">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Recent Loads</p>
                <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html($hh_short); ?> <span class="text-primary">On The Road</span></h2>
            </div>
            <p class="text-white/70 text-sm max-w-md md:text-right">A snapshot of recent <?php echo esc_html($hh_short_lower); ?> hauls — properly strapped, permitted, and delivered on schedule.</p>
        </div>

        <div class="space-y-8">
            <?php if (!empty($hh_equipment_list)): ?>
            <div class="bg-background/[0.04] border border-white/10 rounded-md p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                    <div>
                        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-1">Equipment We Transport</p>
                        <h3 class="font-display uppercase text-xl leading-tight">Common <?php echo esc_html($hh_short); ?> Equipment <span class="text-primary">We Ship</span></h3>
                    </div>
                    <a href="#quote" class="inline-flex items-center gap-2 text-primary font-bold uppercase text-sm hover:underline">Don't see your equipment? Get a quote <?php echo hh_lucide('arrow-right', 'h-4 w-4'); ?></a>
                </div>
                <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-1.5">
                    <?php foreach ($hh_equipment_list as $item):
                        $is_tractor = $item === 'Tractor Shipping Services';
                        $href = $is_tractor ? home_url('/services/agricultural-equipment-transport/tractor-transport') : '#quote';
                        ?>
                        <li>
                            <a href="<?php echo esc_url($href); ?>" class="group flex items-start gap-1.5 text-[13px] text-white/85 hover:text-primary transition-colors py-0.5">
                                <?php echo hh_lucide('chevron-right', 'h-3.5 w-3.5 text-primary/70 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition'); ?>
                                <span class="leading-snug"><?php echo esc_html($item); ?></span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <!-- Horizontal scroll-snap gallery row (embla carousel replacement — no JS dependency) -->
            <div class="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
                <?php $hh_lanes = ['TX → CO', 'FL → GA', 'CA → AZ', 'IL → OH', 'NY → PA', 'WA → ID', 'NC → VA', 'MI → IN'];
                foreach ($hh_gallery_urls as $i => $src): ?>
                    <div class="snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[24%]">
                        <div class="group relative overflow-hidden rounded-sm aspect-[4/3] border border-white/10">
                            <img src="<?php echo esc_url($src); ?>" alt="<?php echo esc_attr($hh_short . ' transport example ' . ($i + 1)); ?>" loading="lazy" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/10 to-transparent"></div>
                            <div class="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-lg">
                                <?php echo hh_lucide('circle-check-big', 'h-3 w-3'); ?> Delivered
                            </div>
                            <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-primary">Load #<?php echo esc_html(str_pad((string) (1240 + $i * 37), 4, '0', STR_PAD_LEFT)); ?></span>
                                <span class="text-[10px] uppercase tracking-widest text-white/80"><?php echo esc_html($hh_lanes[$i % 8]); ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/70">
                <span class="flex items-center gap-1.5"><?php echo hh_lucide('star', 'h-3.5 w-3.5 text-primary fill-primary'); ?> 4.9 / 5 · 2,400+ Reviews</span>
                <span class="flex items-center gap-1.5"><?php echo hh_lucide('trending-up', 'h-3.5 w-3.5 text-primary'); ?> 18,000+ Loads Delivered</span>
                <span class="flex items-center gap-1.5"><?php echo hh_lucide('zap', 'h-3.5 w-3.5 text-primary'); ?> 60-Sec Quote Response</span>
            </div>
        </div>
    </div>
</section>

<!-- STATS STRIP -->
<section class="py-10 sm:py-12 bg-gradient-dark border-y border-white/10">
    <div class="container-tight grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <?php foreach ([
            ['end' => '4.9', 'label' => 'Avg. Rating', 'sub' => '2,400+ shippers'],
            ['end' => '15+', 'label' => 'Years', 'sub' => 'In heavy haul'],
            ['end' => '18K+', 'label' => 'Loads', 'sub' => 'Delivered safely'],
            ['end' => '50', 'label' => 'States', 'sub' => 'Nationwide coverage'],
        ] as $s): ?>
            <div>
                <div class="stencil text-3xl sm:text-4xl text-primary"><?php echo esc_html($s['end']); ?></div>
                <div class="font-bold uppercase tracking-wider text-sm text-white mt-1"><?php echo esc_html($s['label']); ?></div>
                <div class="text-xs text-white/60 uppercase tracking-widest mt-0.5"><?php echo esc_html($s['sub']); ?></div>
            </div>
        <?php endforeach; ?>
    </div>
</section>

<!-- WHY CHOOSE US -->
<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">Why Choose Us</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase">Why Shippers Pick Us For <span class="text-primary"><?php echo esc_html($hh_short); ?> Transport</span></h2>
            <p class="text-muted-foreground mt-3">Specialist carriers, in-house permits, and a dispatch team that actually answers the phone — built for <?php echo esc_html($hh_short_lower); ?> freight.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <?php foreach ($hh_why_us as $w): ?>
                <div class="bg-card border border-border rounded-md p-6 hover:border-primary hover:shadow-card transition-all">
                    <span class="inline-flex h-11 w-11 rounded-full bg-primary/15 text-primary items-center justify-center mb-4"><?php echo hh_lucide($w['icon'], 'h-5 w-5'); ?></span>
                    <h3 class="font-display uppercase text-base mb-1.5"><?php echo esc_html($w['t']); ?></h3>
                    <p class="text-sm text-muted-foreground leading-relaxed"><?php echo esc_html($w['d']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CONVERSION CTA BANNER -->
<section class="relative overflow-hidden bg-gradient-amber text-primary-foreground">
    <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(0,0,0,0.18) 14px, rgba(0,0,0,0.18) 28px);"></div>
    <div class="relative container-tight py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
            <span class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <span class="absolute inset-0 rounded-full bg-secondary animate-ping opacity-40"></span>
                <?php echo hh_lucide('phone', 'relative h-5 w-5'); ?>
            </span>
            <div>
                <div class="text-[11px] font-extrabold uppercase tracking-[0.25em] opacity-90">Dispatcher Online Now</div>
                <div class="font-display uppercase text-2xl sm:text-3xl leading-tight">Get Your <?php echo esc_html($hh_short); ?> Quote In 60 Seconds</div>
            </div>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
            <a href="<?php echo esc_attr($hh_phone_href); ?>"><?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'call', 'xl', 'hover-scale'); ?></a>
            <a href="#quote"><?php hh_button('Get Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'default', 'xl', 'bg-secondary text-white hover:bg-secondary/90 hover-scale font-bold uppercase tracking-wide'); ?></a>
        </div>
    </div>
</section>

<!-- STATE LOCATIONS -->
<section class="py-14 sm:py-20 bg-muted/40 border-t border-border">
    <div class="container-tight">
        <div class="text-center max-w-2xl mx-auto mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2"><?php echo $hh_state ? 'Other Locations' : 'Service Locations'; ?></p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase">
                <?php if ($hh_state): ?>
                    <?php echo esc_html($hh_short); ?> Transport In <span class="text-primary">Other States</span>
                <?php else: ?>
                    <?php echo esc_html(get_the_title()); ?> <span class="text-primary">By State</span>
                <?php endif; ?>
            </h2>
            <p class="text-muted-foreground mt-3">We dispatch <?php echo esc_html($hh_short_lower); ?> loads in every U.S. state. Click your state for lane-specific <?php echo esc_html(strtolower(get_the_title())); ?> details.</p>
        </div>
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <?php foreach (hh_states() as $other):
                if ($hh_state && $other['slug'] === $hh_state['slug']) continue;
                ?>
                <li>
                    <a href="<?php echo esc_url(home_url('/services/' . $hh_cat_slug . '/state/' . $other['slug'])); ?>" class="group flex items-center gap-3 bg-card border border-border rounded-md px-3 py-2.5 hover:border-primary hover:shadow-card transition-all">
                        <img src="https://flagcdn.com/w80/us-<?php echo esc_attr(strtolower($other['abbr'])); ?>.png"
                             srcset="https://flagcdn.com/w160/us-<?php echo esc_attr(strtolower($other['abbr'])); ?>.png 2x"
                             alt="<?php echo esc_attr($other['name'] . ' state flag'); ?>" loading="lazy" width="40" height="26"
                             class="h-7 w-10 shrink-0 object-cover rounded-sm border border-border bg-secondary">
                        <div class="min-w-0 flex-1">
                            <div class="text-[13px] font-bold text-foreground group-hover:text-primary truncate leading-tight"><?php echo esc_html($other['name']); ?></div>
                            <div class="text-[10px] uppercase tracking-widest text-muted-foreground"><?php echo esc_html($hh_short); ?> Transport</div>
                        </div>
                        <?php echo hh_lucide('map-pin', 'h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0'); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>

<!-- FAQS -->
<section class="py-14 sm:py-20 bg-background border-t border-border">
    <div class="container-tight max-w-4xl">
        <div class="text-center mb-10">
            <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-2">FAQs</p>
            <h2 class="stencil text-3xl sm:text-4xl font-bold uppercase"><?php echo esc_html(get_the_title()); ?> <span class="text-primary">FAQs</span></h2>
            <p class="text-muted-foreground mt-3">Straight answers to the questions <?php echo esc_html($hh_short_lower); ?> shippers ask most before booking.</p>
        </div>
        <div class="space-y-3">
            <?php foreach ($hh_faqs_freight as $i => $f): ?>
                <details class="group bg-card border border-border rounded-md px-5 shadow-sm hover:border-primary/50 transition-colors" <?php echo $i === 0 ? 'open' : ''; ?>>
                    <summary class="flex items-center justify-between gap-3 cursor-pointer list-none font-sans font-extrabold text-base sm:text-lg text-foreground hover:text-primary py-5 [&::-webkit-details-marker]:hidden">
                        <?php echo esc_html($f['q']); ?>
                        <?php echo hh_lucide('chevron-down', 'h-4 w-4 shrink-0 transition-transform group-open:rotate-180'); ?>
                    </summary>
                    <div class="text-muted-foreground text-[15px] leading-relaxed pb-5"><?php echo esc_html($f['a']); ?></div>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- RELATED CATEGORIES -->
<section class="py-14 bg-background border-t border-border">
    <div class="container-tight">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4">Related Services</p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ($hh_related_categories as $rc):
                $rc_hero = get_field('hero_image', $rc->ID);
                $rc_img = (is_array($rc_hero) && !empty($rc_hero['url'])) ? $rc_hero['url'] : HH_THEME_URI . '/assets/img/' . ($hh_fallback_images[$rc->post_name] ?? 'hero-truck.jpg');
                $rc_sub_count = count(get_posts([
                    'post_type' => 'service_subcategory',
                    'posts_per_page' => -1,
                    'meta_query' => [['key' => 'parent_category', 'value' => $rc->ID]],
                ]));
                ?>
                <a href="<?php echo esc_url(home_url('/services/' . $rc->post_name)); ?>" class="group flex items-center gap-4 bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                    <img src="<?php echo esc_url($rc_img); ?>" alt="<?php echo esc_attr($rc->post_title); ?>" loading="lazy" class="h-16 w-20 object-cover rounded-sm" width="80" height="64">
                    <div class="flex-1">
                        <div class="font-display uppercase text-sm"><?php echo esc_html($rc->post_title); ?></div>
                        <div class="text-xs text-muted-foreground"><?php echo esc_html($rc_sub_count); ?> sub-services</div>
                    </div>
                    <?php echo hh_lucide('arrow-right', 'h-4 w-4 text-muted-foreground group-hover:text-primary'); ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php endif; ?>

<?php get_footer(); ?>
