<?php
/**
 * Ported from src/components/InstantQuoteCalculator.tsx — 3-step wizard (route/equipment →
 * contact info → confirmation). Step transitions, ZIP autocomplete, and the submit-lead
 * call are vanilla JS (assets/js/quote-forms.js); this file is just the markup for all 3
 * steps (steps 2/3 start hidden). Usage: <?php get_template_part('template-parts/instant-quote-calculator'); ?>
 */
$hh_equipment_options = [
    'Skid Steer / Bobcat',
    'Excavator (small/mid)',
    'Bulldozer / Loader',
    'Farm Tractor / Combine',
    'Crane / Boom Lift',
    'Semi / Dump / Vocational',
    'Industrial Machinery / CNC',
    'Other Heavy Equipment',
];
?>
<div class="bg-card text-card-foreground rounded-lg border-t-4 border-primary shadow-card overflow-hidden" data-hh-iqc>
    <div class="bg-secondary text-secondary-foreground px-5 sm:px-6 py-4">
        <div class="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
            <span class="flex items-center gap-1.5"><?php echo hh_lucide('check', 'h-3.5 w-3.5'); ?> Free Quote · Best Rate Guaranteed</span>
            <span class="flex items-center gap-1.5 text-green-400">
                <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                </span>
                Dispatchers Online
            </span>
        </div>
        <h2 class="mt-1.5 stencil text-2xl sm:text-3xl font-bold uppercase leading-tight">
            <span data-hh-iqc-title="1">Get Your <span class="text-primary">Best Rate</span></span>
            <span data-hh-iqc-title="2" class="hidden">Almost Done — <span class="text-primary">Your Info</span></span>
            <span data-hh-iqc-title="3" class="hidden">You're <span class="text-primary">All Set!</span></span>
        </h2>
        <div class="mt-3 flex gap-1.5">
            <div class="h-1 flex-1 rounded-full transition-colors bg-primary" data-hh-iqc-progress></div>
            <div class="h-1 flex-1 rounded-full transition-colors bg-white/15" data-hh-iqc-progress></div>
            <div class="h-1 flex-1 rounded-full transition-colors bg-white/15" data-hh-iqc-progress></div>
        </div>
    </div>

    <!-- STEP 1: Route + equipment -->
    <div data-hh-iqc-step="1">
        <form class="p-5 sm:p-6 space-y-3">
            <div class="relative" data-hh-zip-wrap>
                <label for="hh-iqc-pickup" class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <?php echo hh_lucide('map-pin', 'h-3 w-3 text-primary'); ?> Pickup Location *
                </label>
                <input id="hh-iqc-pickup" name="pickup" placeholder="Enter ZIP — e.g. 75201" autocomplete="off" required
                       class="h-12 w-full rounded-md border border-input bg-background px-3 font-semibold tracking-wide" data-hh-zip-input>
                <div class="absolute z-30 left-0 right-0 mt-1 bg-card border border-primary/40 rounded-md shadow-lg overflow-hidden hidden" data-hh-zip-suggestions></div>
            </div>
            <div class="relative" data-hh-zip-wrap>
                <label for="hh-iqc-delivery" class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <?php echo hh_lucide('map-pin', 'h-3 w-3 text-primary'); ?> Delivery Location *
                </label>
                <input id="hh-iqc-delivery" name="delivery" placeholder="Enter ZIP — e.g. 80202" autocomplete="off" required
                       class="h-12 w-full rounded-md border border-input bg-background px-3 font-semibold tracking-wide" data-hh-zip-input>
                <div class="absolute z-30 left-0 right-0 mt-1 bg-card border border-primary/40 rounded-md shadow-lg overflow-hidden hidden" data-hh-zip-suggestions></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                    <label for="hh-iqc-equipment" class="text-[11px] font-bold uppercase tracking-wider">Equipment Type *</label>
                    <input id="hh-iqc-equipment" name="equipment" list="hh-iqc-equipment-types" placeholder="Type or pick…" required autocomplete="off"
                           class="h-12 w-full rounded-md border border-input bg-background px-3">
                    <datalist id="hh-iqc-equipment-types">
                        <?php foreach ($hh_equipment_options as $eq): ?>
                            <option value="<?php echo esc_attr($eq); ?>"></option>
                        <?php endforeach; ?>
                    </datalist>
                </div>
                <div>
                    <label for="hh-iqc-model" class="text-[11px] font-bold uppercase tracking-wider">Model <span class="text-muted-foreground font-normal normal-case">(optional)</span></label>
                    <input id="hh-iqc-model" name="model" placeholder="e.g. CAT 320, D6" autocomplete="off"
                           class="h-12 w-full rounded-md border border-input bg-background px-3">
                </div>
            </div>

            <?php hh_submit_button('Continue →', 'hero', 'xl', 'w-full mt-2'); ?>
            <div class="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span class="flex items-center gap-1"><?php echo hh_lucide('check', 'h-3 w-3 text-primary'); ?> No spam</span>
                <span>·</span>
                <span class="flex items-center gap-1"><?php echo hh_lucide('check', 'h-3 w-3 text-primary'); ?> 60 seconds</span>
                <span>·</span>
                <span class="flex items-center gap-1"><?php echo hh_lucide('check', 'h-3 w-3 text-primary'); ?> Free</span>
            </div>
        </form>
    </div>

    <!-- STEP 2: Lead capture -->
    <div data-hh-iqc-step="2" class="hidden">
        <div class="p-5 sm:p-6 space-y-4">
            <div class="bg-muted/40 border border-border rounded-md p-3 text-xs space-y-1">
                <div class="flex items-center gap-2"><?php echo hh_lucide('map-pin', 'h-3.5 w-3.5 text-primary'); ?> <span class="font-bold" data-hh-iqc-summary-route></span></div>
                <div class="flex items-center gap-2"><?php echo hh_lucide('truck', 'h-3.5 w-3.5 text-primary'); ?> <span class="font-bold" data-hh-iqc-summary-equip></span></div>
            </div>

            <div class="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-2 border-primary/40 rounded-lg p-4 text-center">
                <div class="text-[10px] uppercase tracking-[0.25em] font-bold text-primary mb-1">A Dispatcher Will Call You</div>
                <div class="stencil text-2xl text-foreground leading-tight">Best Rate, <span class="text-primary">Guaranteed</span></div>
                <p class="text-xs text-muted-foreground mt-1.5">We'll beat any written quote — call back within <strong class="text-foreground">10 minutes</strong>.</p>
            </div>

            <form class="space-y-3">
                <div>
                    <label for="hh-iqc-name" class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><?php echo hh_lucide('user', 'h-3 w-3 text-primary'); ?> Your Name *</label>
                    <input id="hh-iqc-name" name="name" placeholder="John Smith" required class="h-12 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-iqc-phone" class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"><?php echo hh_lucide('phone', 'h-3 w-3 text-primary'); ?> Phone *</label>
                    <input id="hh-iqc-phone" name="phone" type="tel" inputmode="tel" placeholder="(555) 123-4567" required class="h-12 w-full rounded-md border border-input bg-background px-3">
                </div>
                <div>
                    <label for="hh-iqc-email" class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">Email *</label>
                    <input id="hh-iqc-email" name="email" type="email" placeholder="you@company.com" required class="h-12 w-full rounded-md border border-input bg-background px-3">
                </div>
                <?php hh_submit_button('Get My Best Rate', 'hero', 'xl', 'w-full'); ?>
                <button type="button" class="w-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition" data-hh-iqc-back>← Edit details</button>
                <p class="text-center text-[10px] text-muted-foreground">We never share your info. Used only to send your quote.</p>
            </form>
        </div>
    </div>

    <!-- STEP 3: Confirmation -->
    <div data-hh-iqc-step="3" class="hidden">
        <div class="p-6 text-center">
            <div class="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <?php echo hh_lucide('check', 'h-9 w-9 text-primary'); ?>
            </div>
            <h3 class="stencil text-2xl text-foreground">Thanks, <span data-hh-iqc-confirm-name></span>!</h3>
            <p class="text-sm text-muted-foreground mt-2">
                A dispatcher is preparing your best rate for <strong class="text-foreground" data-hh-iqc-confirm-details></strong>.
            </p>
            <p class="text-sm mt-2">
                Expect a call at <strong class="text-foreground" data-hh-iqc-confirm-phone></strong> within <strong class="text-primary">10 minutes</strong>.
            </p>
            <button type="button" class="<?php echo esc_attr(hh_button_classes('outline', 'lg', 'mt-5')); ?>" data-hh-iqc-restart>Submit Another</button>
        </div>
    </div>

    <div class="border-t border-border bg-muted/30 px-5 py-3 grid grid-cols-3 gap-2 text-center">
        <div class="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1"><?php echo hh_lucide('check', 'h-3 w-3 text-primary'); ?> Fully Insured</div>
        <div class="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1"><?php echo hh_lucide('truck', 'h-3 w-3 text-primary'); ?> MC# 123456</div>
        <div class="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center gap-1"><?php echo hh_lucide('check', 'h-3 w-3 text-primary'); ?> $1M Cargo</div>
    </div>
</div>
