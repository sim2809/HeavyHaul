<?php
/**
 * Ported from src/components/RecentShipmentsTicker.tsx — static marquee strip used right
 * under the hero on Category.tsx / ServiceDetail.tsx / SubCategory.tsx / TractorPage.tsx.
 * Shared as a template-part since it's identical on every one of those templates.
 * Usage: get_template_part('template-parts/recent-shipments-ticker');
 */
$hh_shipments = [
    ['equipment' => 'CAT D6 Bulldozer', 'from' => 'Dallas, TX', 'to' => 'Atlanta, GA', 'ago' => '12 min ago'],
    ['equipment' => 'John Deere Combine', 'from' => 'Des Moines, IA', 'to' => 'Lincoln, NE', 'ago' => '34 min ago'],
    ['equipment' => 'Bobcat T595 Loader', 'from' => 'Chicago, IL', 'to' => 'Detroit, MI', 'ago' => '1 hr ago'],
    ['equipment' => 'Kenworth T800 Semi', 'from' => 'Phoenix, AZ', 'to' => 'Las Vegas, NV', 'ago' => '2 hr ago'],
    ['equipment' => 'CAT 320 Excavator', 'from' => 'Houston, TX', 'to' => 'New Orleans, LA', 'ago' => '3 hr ago'],
    ['equipment' => 'Komatsu PC290', 'from' => 'Denver, CO', 'to' => 'Salt Lake City, UT', 'ago' => '4 hr ago'],
    ['equipment' => 'Hitachi ZX350', 'from' => 'Seattle, WA', 'to' => 'Portland, OR', 'ago' => '5 hr ago'],
    ['equipment' => 'New Holland Tractor', 'from' => 'Omaha, NE', 'to' => 'Kansas City, MO', 'ago' => '6 hr ago'],
    ['equipment' => 'Volvo L90H Loader', 'from' => 'Cleveland, OH', 'to' => 'Pittsburgh, PA', 'ago' => '7 hr ago'],
    ['equipment' => 'Mack Dump Truck', 'from' => 'Tampa, FL', 'to' => 'Charlotte, NC', 'ago' => '8 hr ago'],
];
$hh_shipments_loop = array_merge($hh_shipments, $hh_shipments); // duplicate for seamless marquee loop
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
                        <?php echo hh_lucide('circle-check-big', 'h-3.5 w-3.5 text-primary shrink-0'); ?>
                        <?php echo hh_lucide('truck', 'h-3.5 w-3.5 text-white/60 shrink-0'); ?>
                        <span class="font-bold text-white"><?php echo esc_html($s['equipment']); ?></span>
                        <span class="text-white/40">·</span>
                        <span class="flex items-center gap-1 text-white/70">
                            <?php echo hh_lucide('map-pin', 'h-3 w-3'); ?>
                            <?php echo esc_html($s['from']); ?> → <?php echo esc_html($s['to']); ?>
                        </span>
                        <span class="text-white/40">·</span>
                        <span class="text-primary uppercase tracking-wider text-[10px] font-bold">Delivered <?php echo esc_html($s['ago']); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
