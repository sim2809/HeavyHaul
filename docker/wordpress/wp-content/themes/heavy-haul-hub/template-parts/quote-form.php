<?php
/**
 * Ported from src/components/QuoteForm.tsx. Pass $args['variant'] = 'card' (default) or
 * 'bare'. Usage:
 *   get_template_part('template-parts/quote-form', null, ['variant' => 'bare']);
 * Wired to the real submit-lead endpoint via assets/js/quote-forms.js's
 * [data-hh-quote-form] handler (the original QuoteForm.tsx only simulated a submit —
 * fixed here since a lead form that doesn't actually send leads is a bug, not a feature).
 */
$hh_variant = $args['variant'] ?? 'card';
$hh_brands = ['Caterpillar', 'John Deere', 'Komatsu', 'Volvo', 'Kenworth', 'Peterbilt', 'Freightliner', 'Mack', 'Hitachi', 'Kubota', 'Case', 'New Holland', 'Bobcat', 'JCB', 'Doosan', 'Liebherr'];
$hh_datalist_id = 'hh-equipment-brands-' . wp_unique_id();
?>
<?php if ($hh_variant === 'bare'): ?>
    <form class="grid grid-cols-1 sm:grid-cols-2 gap-3" data-hh-quote-form data-hh-source="quote_form_bare">
        <datalist id="<?php echo esc_attr($hh_datalist_id); ?>">
            <?php foreach ($hh_brands as $b): ?><option value="<?php echo esc_attr($b); ?>"></option><?php endforeach; ?>
        </datalist>
        <input name="name" placeholder="Full Name" required class="sm:col-span-2 h-12 rounded-md border border-input bg-background px-3">
        <input name="phone" type="tel" placeholder="Phone Number" required class="sm:col-span-2 h-12 rounded-md border border-input bg-background px-3">
        <input name="pickup" placeholder="Pickup City, State" required class="h-12 rounded-md border border-input bg-background px-3">
        <input name="delivery" placeholder="Delivery City, State" required class="h-12 rounded-md border border-input bg-background px-3">
        <input name="brand" list="<?php echo esc_attr($hh_datalist_id); ?>" placeholder="Equipment Brand (optional)" class="h-12 rounded-md border border-input bg-background px-3">
        <input name="model" placeholder="Model (optional, e.g. 320, D6)" class="h-12 rounded-md border border-input bg-background px-3">
        <?php hh_submit_button('Get My Free Quote In 60 Seconds', 'hero', 'xl', 'sm:col-span-2 w-full'); ?>
    </form>
<?php else: ?>
    <div class="bg-card text-card-foreground rounded-md border-t-4 border-primary shadow-card overflow-hidden">
        <datalist id="<?php echo esc_attr($hh_datalist_id); ?>">
            <?php foreach ($hh_brands as $b): ?><option value="<?php echo esc_attr($b); ?>"></option><?php endforeach; ?>
        </datalist>
        <div class="bg-secondary text-secondary-foreground px-6 py-4">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <?php echo hh_lucide('clock', 'h-3.5 w-3.5'); ?> Free · No Obligation · 10-Min Response
            </div>
            <h2 class="mt-1 stencil text-2xl sm:text-3xl font-bold uppercase">Request A Shipping Quote</h2>
        </div>

        <form class="p-6 sm:p-7" data-hh-quote-form data-hh-source="quote_form_card">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                    <label for="hh-qf-name" class="text-xs font-bold uppercase tracking-wider">Full Name *</label>
                    <input id="hh-qf-name" name="name" placeholder="John Smith" required class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div class="sm:col-span-2">
                    <label for="hh-qf-phone" class="text-xs font-bold uppercase tracking-wider">Phone *</label>
                    <input id="hh-qf-phone" name="phone" type="tel" placeholder="(555) 123-4567" required class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-qf-pickup" class="text-xs font-bold uppercase tracking-wider">Pickup *</label>
                    <input id="hh-qf-pickup" name="pickup" placeholder="Dallas, TX" required class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-qf-delivery" class="text-xs font-bold uppercase tracking-wider">Delivery *</label>
                    <input id="hh-qf-delivery" name="delivery" placeholder="Denver, CO" required class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-qf-brand" class="text-xs font-bold uppercase tracking-wider">Equipment Brand <span class="text-muted-foreground font-normal normal-case">(optional)</span></label>
                    <input id="hh-qf-brand" name="brand" list="<?php echo esc_attr($hh_datalist_id); ?>" placeholder="Type or pick (Caterpillar, John Deere…)" class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-qf-model" class="text-xs font-bold uppercase tracking-wider">Model <span class="text-muted-foreground font-normal normal-case">(optional)</span></label>
                    <input id="hh-qf-model" name="model" placeholder="320, D6, 9R…" class="h-11 w-full rounded-md border border-input bg-background px-3">
                </div>
            </div>
            <?php hh_submit_button('Get My Free Quote In 60 Seconds', 'hero', 'xl', 'w-full mt-5'); ?>
            <div class="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <?php echo hh_lucide('shield-check', 'h-3.5 w-3.5 text-primary'); ?> Your information is secure. We never share data.
            </div>
        </form>
    </div>
<?php endif; ?>
