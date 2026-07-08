<?php
/**
 * Ported from src/components/Layout.tsx's <Footer> + StickyCallBar (mobile-only bottom bar).
 */
$hh_categories = get_posts([
    'post_type' => 'service_category',
    'posts_per_page' => -1,
    'orderby' => 'menu_order',
    'order' => 'ASC',
]);

$hh_settings = hh_settings();
$hh_socials = array_filter([
    'facebook'  => $hh_settings['social_facebook'] ?? '',
    'instagram' => $hh_settings['social_instagram'] ?? '',
    'linkedin'  => $hh_settings['social_linkedin'] ?? '',
    'youtube'   => $hh_settings['social_youtube'] ?? '',
    'x'         => $hh_settings['social_x'] ?? '',
]);
?>
</main>

<footer class="bg-secondary text-secondary-foreground border-t border-white/10 pt-14 pb-24 md:pb-10">
    <div class="container-tight grid md:grid-cols-5 gap-10 text-sm">
        <div class="md:col-span-2">
            <?php $hh_logo = hh_setting('logo_url'); $hh_logo_src = is_array($hh_logo) ? ($hh_logo['url'] ?? '') : (HH_THEME_URI . '/assets/img/logo-hhg-white.png'); ?>
            <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center select-none" aria-label="Heavy Haul Group home">
                <img src="<?php echo esc_url($hh_logo_src); ?>" alt="Heavy Haul Group logo" class="h-28 sm:h-32 w-auto object-contain" width="600" height="360">
            </a>

            <p class="mt-4 text-white/60 max-w-sm">
                <?php echo esc_html(hh_setting('footer_content') ?: hh_content('footer', 'description', 'Nationwide heavy haul, oversize load, and equipment transport, built on safety, speed, and straight talk.')); ?>
            </p>
            <a href="<?php echo esc_attr(hh_tel_href(hh_setting('phone_primary'))); ?>" class="mt-5 inline-flex items-center gap-3 group">
                <span class="h-11 w-11 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta">
                    <?php echo hh_lucide('phone', 'h-5 w-5 text-secondary'); ?>
                </span>
                <span>
                    <span class="block text-[10px] uppercase tracking-widest text-white/55"><?php echo esc_html(hh_content('footer', 'call_label', 'Call 24/7')); ?></span>
                    <span class="block stencil text-xl text-primary group-hover:text-primary-glow"><?php echo esc_html(hh_setting('phone_primary_display')); ?></span>
                </span>
            </a>
            <?php if ($email = hh_setting('email')): ?>
                <a href="mailto:<?php echo esc_attr($email); ?>" class="mt-3 block text-xs text-white/60 hover:text-primary"><?php echo esc_html($email); ?></a>
            <?php endif; ?>
            <?php if ($address = hh_setting('address')): ?>
                <p class="mt-2 text-xs text-white/55 max-w-sm"><?php echo esc_html($address); ?></p>
            <?php endif; ?>
            <?php if (!empty($hh_socials)): ?>
                <div class="mt-4 flex gap-2">
                    <?php foreach ($hh_socials as $key => $url): ?>
                        <a href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener noreferrer"
                           class="h-9 w-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-primary hover:border-primary transition-colors"
                           aria-label="<?php echo esc_attr($key); ?>">
                            <?php echo hh_lucide($key, 'h-4 w-4'); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <div>
            <p class="font-display text-base uppercase mb-3 text-primary"><?php echo esc_html(hh_content('footer', 'services_heading', 'Services')); ?></p>
            <ul class="space-y-2 text-white/70">
                <?php foreach ($hh_categories as $cat):
                    $short = get_field('short', $cat->ID) ?: $cat->post_title; ?>
                    <li><a href="<?php echo esc_url(home_url('/services/' . $cat->post_name)); ?>" class="hover:text-primary"><?php echo esc_html($short); ?></a></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div>
            <p class="font-display text-base uppercase mb-3 text-primary"><?php echo esc_html(hh_content('footer', 'company_heading', 'Company')); ?></p>
            <?php hh_nav_menu('footer_company', 'ul', 'space-y-2 text-white/70', 'hover:text-primary', function () {
                ?>
                <ul class="space-y-2 text-white/70">
                    <li><a href="<?php echo esc_url(home_url('/about')); ?>" class="hover:text-primary">About Us</a></li>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>" class="hover:text-primary">News & Guides</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contact#quote')); ?>" class="hover:text-primary">Get A Quote</a></li>
                </ul>
                <?php
            }); ?>
        </div>

        <div>
            <p class="font-display text-base uppercase mb-3 text-primary"><?php echo esc_html(hh_content('footer', 'resources_heading', 'Resources')); ?></p>
            <?php hh_nav_menu('footer_resources', 'ul', 'space-y-1.5 text-white/60', 'hover:text-primary', function () {
                ?>
                <ul class="space-y-1.5 text-white/60">
                    <li>DOT Compliant</li>
                    <li>Fully Insured</li>
                    <li>MC & USDOT Authority</li>
                    <li>Cargo Insurance Up To $250K</li>
                </ul>
                <?php
            }); ?>
        </div>
    </div>
    <div class="container-tight mt-10 pt-6 border-t border-white/10 text-xs text-white/45 flex flex-wrap justify-between gap-2">
        <p><?php echo esc_html(hh_setting('copyright_text') ?: sprintf('© %s %s. All rights reserved.', date('Y'), hh_setting('company_name'))); ?></p>
        <p><?php echo esc_html(hh_content('footer', 'tagline', 'heavyhaulgroup.com · Nationwide Service')); ?></p>
    </div>
</footer>

<div class="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 shadow-glow border-t-2 border-primary">
    <a href="<?php echo esc_attr(hh_tel_href(hh_setting('phone_primary'))); ?>" class="bg-gradient-amber text-secondary py-3.5 px-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm" aria-label="Call now">
        <?php echo hh_lucide('phone', 'h-5 w-5'); ?> Call Now
    </a>
    <a href="<?php echo esc_url(home_url('/#quote')); ?>" class="bg-secondary text-primary py-3.5 px-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm border-l border-primary/40" aria-label="Get a free quote">
        <?php echo hh_lucide('message-square', 'h-5 w-5'); ?> Free Quote
    </a>
</div>

<?php wp_footer(); ?>
</body>
</html>
