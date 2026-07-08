<?php
/**
 * Ported from src/pages/ServicesIndex.tsx. Uses page key "services" for hh_content()
 * lookups, and queries ALL service_category posts (unlike front-page.php, which only
 * shows the first 4) for the card grid, plus their service_subcategory children for the
 * "first 4 + N more" chip treatment.
 *
 * NOTE: This template only renders when a WordPress Page exists with the slug "services"
 * (Pages → Add New → set the URL slug to exactly "services") — see final report. Note
 * WordPress will also need this Page's slug to not collide with the `service_category`
 * CPT's rewrite base ("services", registered in inc/cpt-service-category.php) — the CPT
 * rewrite uses "services" as a *prefix* for individual category permalinks
 * (/services/{category}), while this Page itself lives at the bare /services/ URL, which
 * is the standard WP behavior for a CPT slug + top-level Page sharing a base segment.
 */
get_header();

$hh_phone         = hh_setting('phone_primary');
$hh_phone_display = hh_setting('phone_primary_display');
$hh_phone_href    = hh_tel_href($hh_phone);

$hh_all_categories = get_posts([
    'post_type'      => 'service_category',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
]);

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
?>

<!-- HERO -->
<section class="bg-secondary text-secondary-foreground py-14 lg:py-20">
    <div class="container-tight">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3"><?php echo esc_html(hh_content('services', 'hero_eyebrow', 'Services')); ?></p>
        <h1 class="stencil text-4xl sm:text-6xl font-bold uppercase">
            <?php echo esc_html(hh_content('services', 'hero_title_1', 'Heavy Haul')); ?> <span class="text-primary"><?php echo esc_html(hh_content('services', 'hero_title_2', 'Service Catalog')); ?></span>
        </h1>
        <p class="mt-4 text-white/75 max-w-2xl">
            <?php echo esc_html(hh_content('services', 'hero_subtitle', 'Browse every service we offer — from construction iron to cross-border freight. Click any card for trailers, brands, and instant rates.')); ?>
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
            <a href="<?php echo esc_attr($hh_phone_href); ?>">
                <?php hh_button(hh_lucide('phone', 'h-4 w-4') . ' Call ' . esc_html($hh_phone_display), $hh_phone_href, 'hero', 'lg'); ?>
            </a>
            <a href="<?php echo esc_url(home_url('/#quote')); ?>">
                <?php hh_button(esc_html(hh_content('services', 'hero_cta_quote', 'Get Free Quote')) . ' ' . hh_lucide('arrow-right', 'h-4 w-4'), home_url('/#quote'), 'outline', 'lg', 'bg-white/5 border-white/20 text-white hover:bg-white hover:text-secondary'); ?>
            </a>
        </div>
    </div>
</section>

<!-- FEATURED SERVICE -->
<section class="py-10 bg-background border-b border-border">
    <div class="container-tight">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-4"><?php echo esc_html(hh_content('services', 'featured_eyebrow', 'Featured Service')); ?></p>
        <a href="<?php echo esc_url(home_url('/services/agricultural-equipment-transport/tractor-transport')); ?>"
           class="group flex flex-col sm:flex-row overflow-hidden rounded-md shadow-card border-2 border-primary/40 hover:border-primary hover:shadow-glow transition-all bg-card">
            <div class="relative sm:w-5/12 aspect-[16/10] sm:aspect-auto overflow-hidden bg-muted">
                <img src="<?php echo esc_url(HH_THEME_URI . '/assets/img/tractor-hero.jpg'); ?>"
                     alt="Tractor Shipping Services, tractor loaded on heavy haul trailer"
                     class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="1024" height="640">
                <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded-sm shadow-cta">
                    <?php echo esc_html(hh_content('services', 'featured_badge', 'Popular')); ?>
                </div>
            </div>
            <div class="p-6 sm:p-8 sm:w-7/12 flex flex-col justify-center">
                <h3 class="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors"><?php echo esc_html(hh_content('services', 'featured_title', 'Tractor Shipping Services')); ?></h3>
                <p class="text-sm text-muted-foreground mt-3 max-w-xl">
                    <?php echo esc_html(hh_content('services', 'featured_desc', 'Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job. John Deere, Case IH, Kubota, New Holland & more.')); ?>
                </p>
                <div class="mt-5 flex flex-wrap gap-2">
                    <span class="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Flatbed</span>
                    <span class="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Step Deck</span>
                    <span class="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">RGN / Lowboy</span>
                    <span class="text-[10px] uppercase tracking-wider font-bold bg-muted text-foreground px-2.5 py-1 rounded-sm border border-border">Hot Shot</span>
                </div>
                <div class="mt-5 flex items-center gap-2 text-primary font-bold uppercase text-sm">
                    <span><?php echo esc_html(hh_content('services', 'featured_cta', 'View Tractor Shipping Details')); ?></span>
                    <?php echo hh_lucide('arrow-right', 'h-4 w-4 group-hover:translate-x-1 transition-transform'); ?>
                </div>
            </div>
        </a>
    </div>
</section>

<!-- CARDS — clean photo on top, content below (matches main page style) -->
<section class="py-14 bg-background">
    <div class="container-tight">
        <div class="grid sm:grid-cols-2 gap-6">
            <?php foreach ($hh_all_categories as $cat):
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
                        <div class="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-secondary/80 backdrop-blur text-white text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-sm border border-white/15">
                            <?php echo hh_lucide('shield-check', 'h-3 w-3 text-primary'); ?> Insured
                        </div>
                    </div>
                    <div class="p-5 sm:p-6">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <h3 class="font-sans font-extrabold text-xl sm:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    <?php echo esc_html($cat->post_title); ?>
                                </h3>
                                <p class="text-sm text-muted-foreground mt-2 line-clamp-2"><?php echo esc_html($blurb); ?></p>
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

<?php get_footer(); ?>
