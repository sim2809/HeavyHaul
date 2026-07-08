<?php
/**
 * Ported from src/components/Layout.tsx (the <header> + mobile menu + TopAlertStrip).
 * Dropdown/mobile-menu interactivity is vanilla JS (assets/js/main.js) instead of React
 * state — see data-hh-* attributes below.
 */
$hh_categories = get_posts([
    'post_type' => 'service_category',
    'posts_per_page' => -1,
    'orderby' => 'menu_order',
    'order' => 'ASC',
]);

$hh_category_taglines = [
    'construction-equipment-transport' => 'Excavators, dozers, cranes & more',
    'agricultural-equipment-transport' => 'Combines, tractors & farm machinery',
    'industrial-machinery-transport' => 'CNC, generators & factory equipment',
    'heavy-duty-truck-transport' => 'Semis, dump trucks & vocational rigs',
    'canada-shipping-service' => 'Cross-border hauls to Canada',
    'mexico-shipping-service' => 'Cross-border hauls to Mexico',
    'catastrophic-recovery' => 'Accident & disaster recovery',
    'rigging-and-lifting-service' => 'Crane lifts & precision rigging',
    'heavy-machinery-towing' => '24/7 heavy equipment towing',
    'pilot-car-service' => 'Escort & pilot car coordination',
    'partial-load-shipping' => 'LTL & shared-trailer hauls',
];

$hh_settings = hh_settings();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class('min-h-screen bg-background flex flex-col'); ?>>
<?php wp_body_open(); ?>

<div class="bg-secondary text-secondary-foreground text-xs sm:text-sm border-b border-white/5">
    <div class="container-tight flex items-center justify-center gap-2 py-2 text-center">
        <span class="inline-flex items-center gap-2 font-medium">
            <span class="inline-flex items-center gap-1 text-primary font-bold uppercase tracking-wider">
                <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span> We Are Open
            </span>
            <span class="text-white/70">Serving All 50 States</span>
        </span>
    </div>
</div>

<header class="bg-secondary text-secondary-foreground border-b border-white/5 sticky top-0 z-40">
    <div class="container-tight flex items-center justify-between gap-4 h-14 lg:h-16">
        <?php $hh_logo = hh_setting('logo_url'); $hh_logo_src = is_array($hh_logo) ? ($hh_logo['url'] ?? '') : (HH_THEME_URI . '/assets/img/logo-hhg-white.png'); ?>
        <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center select-none" aria-label="Heavy Haul Group home">
            <img src="<?php echo esc_url($hh_logo_src); ?>" alt="Heavy Haul Group logo" class="h-16 sm:h-20 lg:h-24 w-auto object-contain" width="600" height="360">
        </a>

        <nav class="hidden lg:flex items-center gap-7 text-sm font-bold uppercase tracking-wider">
            <div class="relative" data-hh-dropdown="services">
                <button type="button" class="flex items-center gap-1 hover:text-primary transition-colors py-3" data-hh-dropdown-trigger>
                    <?php echo esc_html(hh_content('header', 'services_label', 'Services')); ?> <?php echo hh_lucide('chevron-down', 'h-3.5 w-3.5'); ?>
                </button>
                <div class="absolute left-0 top-full w-[640px] hidden" data-hh-dropdown-panel>
                    <div class="bg-white text-secondary rounded-md shadow-card border border-border p-2 max-h-[70vh] overflow-y-auto">
                        <a href="<?php echo esc_url(home_url('/services/agricultural-equipment-transport/tractor-transport')); ?>"
                           class="group flex items-center gap-3 px-4 py-3 rounded bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-colors mb-2">
                            <span class="inline-flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest"><?php echo esc_html(hh_content('header', 'featured_service_badge', 'New')); ?></span>
                            <span class="min-w-0">
                                <span class="block font-sans font-bold text-[15px] leading-tight"><?php echo esc_html(hh_content('header', 'featured_service_title', 'Tractor Shipping Services')); ?></span>
                                <span class="block text-[11px] text-muted-foreground group-hover:text-primary-foreground/80 mt-0.5"><?php echo esc_html(hh_content('header', 'featured_service_desc', 'Compact, row-crop, 4WD & high-HP tractors nationwide')); ?></span>
                            </span>
                        </a>
                        <div class="grid grid-cols-2">
                            <?php foreach ($hh_categories as $cat): ?>
                                <a href="<?php echo esc_url(home_url('/services/' . $cat->post_name)); ?>" class="group px-4 py-3 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                                    <div class="font-sans font-semibold text-[15px] leading-tight"><?php echo esc_html($cat->post_title); ?></div>
                                    <div class="text-[11px] text-muted-foreground group-hover:text-primary-foreground/80 font-normal mt-1">
                                        <?php echo esc_html($hh_category_taglines[$cat->post_name] ?? 'Nationwide heavy haul'); ?>
                                    </div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="relative" data-hh-dropdown="about">
                <button type="button" class="flex items-center gap-1 hover:text-primary transition-colors py-3" data-hh-dropdown-trigger>
                    <?php echo esc_html(hh_content('header', 'about_label', 'About')); ?> <?php echo hh_lucide('chevron-down', 'h-3.5 w-3.5'); ?>
                </button>
                <div class="absolute left-0 top-full w-[240px] hidden" data-hh-dropdown-panel>
                    <div class="bg-white text-secondary rounded-md shadow-card border border-border p-2">
                        <?php
                        $hh_about_links = [
                            ['/about#who-we-are', 'Who We Are'],
                            ['/about#our-team', 'Our Team'],
                            ['/about#states-we-serve', 'States We Serve'],
                            ['/about#contact-us', 'Contact Us'],
                        ];
                        foreach ($hh_about_links as [$to, $label]): ?>
                            <a href="<?php echo esc_url(home_url($to)); ?>" class="block px-4 py-2.5 rounded font-sans font-semibold text-[14px] hover:bg-primary hover:text-primary-foreground transition-colors"><?php echo esc_html($label); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <?php hh_nav_menu('header_primary', 'div', 'flex items-center gap-7', 'hover:text-primary transition-colors', function () {
                printf(
                    '<a href="%s" class="hover:text-primary transition-colors">%s</a>',
                    esc_url(home_url('/blog')),
                    esc_html(hh_content('header', 'blog_label', 'News & Guides'))
                );
            }); ?>

            <a href="<?php echo esc_url(home_url('/contact#quote')); ?>" class="bg-gradient-amber text-secondary px-4 py-2 rounded-md shadow-cta hover:brightness-110 transition">
                <?php echo esc_html(hh_content('header', 'cta_label', 'Get Quote')); ?>
            </a>
        </nav>

        <div class="flex items-center gap-2">
            <a href="<?php echo esc_attr(hh_tel_href(hh_setting('phone_primary'))); ?>" class="hidden sm:flex items-center gap-2.5 group">
                <span class="h-10 w-10 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta">
                    <?php echo hh_lucide('phone', 'h-5 w-5 text-secondary'); ?>
                </span>
                <span class="leading-tight">
                    <span class="block text-[9px] uppercase tracking-widest text-white/55"><?php echo esc_html(hh_content('header', 'tagline', '24/7 Dispatch')); ?></span>
                    <span class="block stencil text-base lg:text-lg text-primary group-hover:text-primary-glow"><?php echo esc_html(hh_setting('phone_primary_display')); ?></span>
                </span>
            </a>
            <button type="button" class="lg:hidden p-2 text-white" aria-label="Toggle menu" data-hh-mobile-toggle>
                <span data-hh-mobile-icon-open><?php echo hh_lucide('menu', 'h-6 w-6'); ?></span>
                <span data-hh-mobile-icon-close class="hidden"><?php echo hh_lucide('x', 'h-6 w-6'); ?></span>
            </button>
        </div>
    </div>

    <div class="lg:hidden border-t border-white/10 bg-secondary hidden" data-hh-mobile-panel>
        <div class="container-tight py-4 space-y-1">
            <div class="py-1">
                <div class="text-[10px] uppercase tracking-widest text-primary font-bold pt-2 pb-1">Services</div>
                <a href="<?php echo esc_url(home_url('/services/agricultural-equipment-transport/tractor-transport')); ?>" class="block py-2 text-sm font-bold pl-2 text-primary">★ Tractor Shipping Services</a>
                <?php foreach ($hh_categories as $cat): ?>
                    <a href="<?php echo esc_url(home_url('/services/' . $cat->post_name)); ?>" class="block py-2 text-sm font-semibold pl-2 hover:text-primary"><?php echo esc_html($cat->post_title); ?></a>
                <?php endforeach; ?>
            </div>
            <div class="py-1">
                <div class="text-[10px] uppercase tracking-widest text-primary font-bold pt-2 pb-1">About</div>
                <?php foreach ($hh_about_links as [$to, $label]): ?>
                    <a href="<?php echo esc_url(home_url($to)); ?>" class="block py-2 text-sm font-semibold pl-2 hover:text-primary"><?php echo esc_html($label); ?></a>
                <?php endforeach; ?>
            </div>
            <a href="<?php echo esc_url(home_url('/blog')); ?>" class="block py-2 font-bold uppercase tracking-wider text-sm">News & Guides</a>
            <a href="<?php echo esc_url(home_url('/contact#quote')); ?>" class="block py-2 font-bold uppercase tracking-wider text-sm text-primary">Get Quote</a>
        </div>
    </div>
</header>

<div class="h-1.5 bg-gradient-stripe" aria-hidden="true"></div>

<main class="flex-1">
