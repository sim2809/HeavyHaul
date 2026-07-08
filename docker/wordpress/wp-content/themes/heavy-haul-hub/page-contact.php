<?php
/**
 * Ported from src/pages/Contact.tsx — 100% static markup in the original (no
 * useSiteContent() get() calls), so no hh_content() lookups here either. Phone/email
 * use hh_setting() the same way header.php/footer.php do, so they stay in sync with the
 * single site-wide phone number instead of a second hardcoded copy.
 *
 * NOTE: This template only renders when a WordPress Page exists with the slug "contact"
 * (Pages → Add New → set the URL slug to exactly "contact") — see final report.
 */
get_header();

$hh_phone         = hh_setting('phone_primary');
$hh_phone_display = hh_setting('phone_primary_display');
$hh_phone_href    = hh_tel_href($hh_phone);
$hh_email         = hh_setting('email');
?>

<section class="bg-secondary text-secondary-foreground py-14 lg:py-20">
    <div class="container-tight max-w-4xl">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Contact Dispatch</p>
        <h1 class="stencil text-4xl sm:text-6xl font-bold uppercase">
            Get Your <span class="text-primary">Best Rate.</span>
        </h1>
        <p class="mt-4 text-white/80 text-lg">Available 24/7 &middot; Response in under 10 minutes</p>
    </div>
</section>

<section class="py-14 bg-background">
    <div class="container-tight grid lg:grid-cols-12 gap-10">
        <div class="lg:col-span-5 space-y-4">
            <a href="<?php echo esc_attr($hh_phone_href); ?>" class="flex items-center gap-4 bg-card border border-border rounded-md p-5 hover:border-primary transition">
                <span class="h-12 w-12 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta"><?php echo hh_lucide('phone', 'h-6 w-6 text-secondary'); ?></span>
                <div>
                    <div class="text-[10px] uppercase tracking-widest text-muted-foreground">Call 24/7</div>
                    <div class="stencil text-2xl text-foreground"><?php echo esc_html($hh_phone_display); ?></div>
                </div>
            </a>
            <a href="mailto:<?php echo esc_attr($hh_email); ?>" class="flex items-center gap-4 bg-card border border-border rounded-md p-5 hover:border-primary transition">
                <span class="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><?php echo hh_lucide('mail', 'h-6 w-6'); ?></span>
                <div>
                    <div class="text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
                    <div class="font-display uppercase text-base"><?php echo esc_html($hh_email); ?></div>
                </div>
            </a>
            <div class="flex items-center gap-4 bg-card border border-border rounded-md p-5">
                <span class="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><?php echo hh_lucide('clock', 'h-6 w-6'); ?></span>
                <div>
                    <div class="text-[10px] uppercase tracking-widest text-muted-foreground">Hours</div>
                    <div class="font-display uppercase text-base">24 / 7 &middot; 365 Days</div>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-card border border-border rounded-md p-5">
                <span class="h-12 w-12 rounded-md bg-secondary text-primary flex items-center justify-center"><?php echo hh_lucide('map-pin', 'h-6 w-6'); ?></span>
                <div>
                    <div class="text-[10px] uppercase tracking-widest text-muted-foreground">Service Area</div>
                    <div class="font-display uppercase text-base">All 50 States &middot; Cross-Border</div>
                </div>
            </div>
        </div>
        <div id="quote" class="lg:col-span-7 scroll-mt-24">
            <?php get_template_part('template-parts/instant-quote-calculator'); ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
