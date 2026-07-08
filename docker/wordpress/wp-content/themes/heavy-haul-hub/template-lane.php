<?php
/**
 * Virtual route: /lanes/{slug} where slug is either "from-{city}" (outbound listing) or
 * "{from}-to-{to}" (specific lane page). Ported from src/pages/Lane.tsx's LanePage. Loaded
 * by inc/rewrite-rules.php's template_include filter, which sets $GLOBALS['hh_lane_slug'].
 * No real WP post backs this — cities/estimateTransit come from inc/data/cities.php,
 * exactly like the React version computes everything from the small static dataset.
 */
$hh_lane_slug = $GLOBALS['hh_lane_slug'] ?? '';

$hh_from_slug = null;
$hh_to_slug = null;
if (strpos($hh_lane_slug, 'from-') === 0) {
    $hh_from_slug = substr($hh_lane_slug, 5);
} elseif (preg_match('/^(.+)-to-(.+)$/', $hh_lane_slug, $m)) {
    $hh_from_slug = $m[1];
    $hh_to_slug = $m[2];
}

$hh_from_city = $hh_from_slug ? hh_find_city($hh_from_slug) : null;
$hh_to_city = $hh_to_slug ? hh_find_city($hh_to_slug) : null;

if (!$hh_from_city) {
    global $wp_query;
    $wp_query->set_404();
    status_header(404);
    get_template_part('404');
    return;
}

get_header();

if (!$hh_to_city):
    // Outbound listing: all destinations from this city.
    ?>
    <section class="bg-secondary text-secondary-foreground py-14 lg:py-20">
        <div class="container-tight">
            <nav class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60 mb-4">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-primary">Home</a>
                <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
                <a href="<?php echo esc_url(home_url('/lanes')); ?>" class="hover:text-primary">Lanes</a>
                <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
                <span class="text-primary">From <?php echo esc_html($hh_from_city['name']); ?></span>
            </nav>
            <h1 class="stencil text-4xl sm:text-6xl font-bold uppercase">
                Heavy Haul From <span class="text-primary"><?php echo esc_html($hh_from_city['name'] . ', ' . $hh_from_city['state']); ?></span>
            </h1>
            <p class="mt-4 text-white/75 max-w-2xl">
                We dispatch lowboys, RGNs, and step decks out of <?php echo esc_html($hh_from_city['name']); ?> to all 50 states. Pick your destination below.
            </p>
        </div>
    </section>
    <section class="py-14 bg-background">
        <div class="container-tight grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <?php foreach (hh_cities() as $city):
                if ($city['slug'] === $hh_from_city['slug']) continue; ?>
                <a href="<?php echo esc_url(home_url('/lanes/' . $hh_from_city['slug'] . '-to-' . $city['slug'])); ?>" class="group flex items-center justify-between bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                    <div class="flex items-center gap-3">
                        <?php echo hh_lucide('map-pin', 'h-5 w-5 text-primary'); ?>
                        <div>
                            <div class="font-display uppercase"><?php echo esc_html($hh_from_city['name'] . ' → ' . $city['name'] . ', ' . $city['state']); ?></div>
                            <div class="text-xs text-muted-foreground">Heavy haul · Insured</div>
                        </div>
                    </div>
                    <?php echo hh_lucide('arrow-right', 'h-5 w-5 text-muted-foreground group-hover:text-primary'); ?>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
<?php else:
    $hh_transit = hh_estimate_transit($hh_from_city['slug'], $hh_to_city['slug']);
    $hh_days = $hh_transit['days'];
    $hh_miles = $hh_transit['miles'];
    ?>
    <section class="relative bg-secondary text-secondary-foreground overflow-hidden">
        <div class="absolute inset-0 topo-bg opacity-30" aria-hidden="true"></div>
        <div class="relative container-tight py-14 lg:py-20">
            <nav class="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/60 mb-4 flex-wrap">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-primary">Home</a>
                <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
                <a href="<?php echo esc_url(home_url('/lanes')); ?>" class="hover:text-primary">Lanes</a>
                <?php echo hh_lucide('chevron-right', 'h-3 w-3'); ?>
                <span class="text-primary"><?php echo esc_html($hh_from_city['name'] . ' → ' . $hh_to_city['name']); ?></span>
            </nav>
            <div class="grid lg:grid-cols-12 gap-10 items-center">
                <div class="lg:col-span-7">
                    <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                        <?php echo hh_lucide('map-pin', 'h-3.5 w-3.5'); ?> Lane Specialists
                    </p>
                    <h1 class="stencil text-4xl sm:text-6xl font-bold uppercase leading-[0.95]">
                        Heavy Haul <br>
                        <span class="text-primary"><?php echo esc_html($hh_from_city['name'] . ', ' . $hh_from_city['state']); ?></span> →
                        <br>
                        <span class="text-primary"><?php echo esc_html($hh_to_city['name'] . ', ' . $hh_to_city['state']); ?></span>
                    </h1>
                    <p class="mt-4 text-lg text-white/80 max-w-xl">
                        Lowboys, RGNs, and step decks dispatched daily on this lane. Permits, pilot cars, and DOT compliance handled in-house.
                    </p>

                    <div class="mt-7 grid grid-cols-3 gap-3 max-w-lg">
                        <div class="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                            <?php echo hh_lucide('clock', 'h-5 w-5 text-primary mx-auto mb-1'); ?>
                            <div class="stencil text-2xl text-white"><?php echo esc_html($hh_days . '-' . ($hh_days + 1)); ?></div>
                            <div class="text-[10px] uppercase tracking-widest text-white/55">Day Transit</div>
                        </div>
                        <div class="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                            <?php echo hh_lucide('truck', 'h-5 w-5 text-primary mx-auto mb-1'); ?>
                            <div class="stencil text-2xl text-white">~<?php echo esc_html($hh_miles); ?></div>
                            <div class="text-[10px] uppercase tracking-widest text-white/55">Miles</div>
                        </div>
                        <div class="bg-white/5 backdrop-blur border border-white/10 rounded-md p-4 text-center">
                            <?php echo hh_lucide('map-pin', 'h-5 w-5 text-primary mx-auto mb-1'); ?>
                            <div class="stencil text-2xl text-white">24/7</div>
                            <div class="text-[10px] uppercase tracking-widest text-white/55">Dispatch</div>
                        </div>
                    </div>

                    <div class="mt-7 flex flex-wrap gap-3">
                        <?php hh_button('' . hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html(hh_setting('phone_primary_display')), hh_tel_href(hh_setting('phone_primary')), 'hero', 'xl'); ?>
                        <?php hh_button('Quote This Lane ' . hh_lucide('arrow-right', 'h-4 w-4'), '#quote', 'call', 'xl'); ?>
                    </div>
                </div>

                <div id="quote" class="lg:col-span-5 scroll-mt-24">
                    <?php get_template_part('template-parts/quote-form'); ?>
                </div>
            </div>
        </div>
    </section>

    <section class="py-14 bg-background">
        <div class="container-tight">
            <h2 class="stencil text-2xl sm:text-3xl uppercase mb-5">
                Common Equipment Moved On The <span class="text-primary"><?php echo esc_html($hh_from_city['name'] . ' → ' . $hh_to_city['name']); ?></span> Lane
            </h2>
            <p class="text-muted-foreground max-w-3xl mb-6">
                Whether you're shipping construction equipment, agricultural machinery, industrial freight, or commercial trucks
                from <?php echo esc_html($hh_from_city['name'] . ', ' . $hh_from_city['state']); ?> to <?php echo esc_html($hh_to_city['name'] . ', ' . $hh_to_city['state']); ?>, we have the trailer and the carrier ready today.
            </p>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <?php
                $hh_lane_equipment_links = [
                    ['label' => 'Excavators & Dozers', 'to' => '/services/construction-equipment-transport'],
                    ['label' => 'Tractors & Combines', 'to' => '/services/agricultural-equipment-transport'],
                    ['label' => 'Generators & CNC', 'to' => '/services/industrial-machinery-transport'],
                    ['label' => 'Semi & Dump Trucks', 'to' => '/services/heavy-duty-truck-transport'],
                ];
                foreach ($hh_lane_equipment_links as $x): ?>
                    <a href="<?php echo esc_url(home_url($x['to'])); ?>" class="group flex items-center justify-between bg-card border border-border rounded-md p-4 hover:border-primary transition-all">
                        <span class="font-display uppercase text-sm"><?php echo esc_html($x['label']); ?></span>
                        <?php echo hh_lucide('arrow-right', 'h-4 w-4 text-muted-foreground group-hover:text-primary'); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<?php get_footer(); ?>
