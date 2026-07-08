<?php
/**
 * Ported from src/pages/About.tsx — the "magazine" About page. Cover, six numbered
 * "chapters" (Who We Are / Mission & Values / The Dispatch Floor / Our Trailers /
 * States We Serve / Get In Touch), a mid-page CTA, and a colophon strip.
 *
 * Non-CMS hardcoded data (team, trailers, values, trust cards/strip, inside-issue index,
 * stats, promise list, the 50-state list) mirrors the TS source's static arrays exactly —
 * only the copy that flowed through <EC page="about" k="..."> in the original is wired to
 * hh_ec() so it stays editable via the "Site Content — About Page" ACF options screen.
 *
 * The original's <Reveal> scroll-fade-in wrapper (src/hooks/useInView.tsx) is NOT used
 * anywhere in About.tsx, so there's nothing to port for it here.
 */

$hh_phone = hh_setting('phone_primary');
$hh_display = hh_setting('phone_primary_display');
$hh_tel = hh_tel_href($hh_phone);

$team = [
    ['id' => 'm1', 'img' => 'dispatcher-mike.jpg',   'name' => 'Mike Reilly',    'role' => 'Senior Dispatcher',   'years' => '12 yrs', 'quote' => '"Every load is personal."'],
    ['id' => 'm2', 'img' => 'dispatcher-sarah.jpg',  'name' => 'Sarah Coleman',  'role' => 'Permits & Routing',   'years' => '9 yrs',  'quote' => '"Paperwork before pavement."'],
    ['id' => 'm3', 'img' => 'dispatcher-carlos.jpg', 'name' => 'Carlos Alvarez', 'role' => 'Oversize Specialist', 'years' => '15 yrs', 'quote' => '"If it\'s wide, I\'ve moved it."'],
    ['id' => 'm4', 'img' => 'dispatcher-danny.jpg',  'name' => 'Danny Williams', 'role' => 'Heavy Haul Lead',     'years' => '11 yrs', 'quote' => '"On time. Every time."'],
];

$trailers = [
    ['id' => 't1', 'img' => 'trailer-lowboy.jpg',    'name' => 'Lowboy / RGN',         'cap' => 'Up to 150,000 lbs', 'desc' => 'Removable goosenecks for dozers, cranes, transformers.'],
    ['id' => 't2', 'img' => 'trailer-stepdeck.jpg',  'name' => 'Step Deck',            'cap' => 'Up to 48,000 lbs',  'desc' => 'Drop deck for tall loads — legal to 10\'2" without permits.'],
    ['id' => 't3', 'img' => 'trailer-flatbed.jpg',   'name' => 'Flatbed (48\' / 53\')', 'cap' => 'Up to 48,000 lbs', 'desc' => 'Workhorse for machinery, steel, pipe, lumber, building materials.'],
    ['id' => 't4', 'img' => 'trailer-multiaxle.jpg', 'name' => 'Multi-Axle',           'cap' => 'Up to 500,000 lbs', 'desc' => 'Beam, jeep & booster combos for super-loads and heavy iron.'],
    ['id' => 't5', 'img' => 'trailer-stretch.jpg',   'name' => 'Stretch / Extendable', 'cap' => 'Up to 80\' long',  'desc' => 'Extendable decks for over-length loads beyond 53 ft.'],
    ['id' => 't6', 'img' => 'trailer-hotshot.jpg',   'name' => 'Hot Shot / Gooseneck', 'cap' => 'Up to 40,000 lbs', 'desc' => 'Fast, flexible smaller loads — same-day pickup available.'],
];

$values = [
    ['id' => 'v1', 'icon' => 'handshake',    'title' => 'Honest',         'desc' => 'Straight rates. No bait-and-switch. We quote what we mean.'],
    ['id' => 'v2', 'icon' => 'shield-check', 'title' => 'Dependable',     'desc' => 'We show up on time, with the right trailer, every single time.'],
    ['id' => 'v3', 'icon' => 'heart',        'title' => 'Customer First', 'desc' => "Your load is treated like it's our own — from quote to delivery."],
    ['id' => 'v4', 'icon' => 'target',       'title' => 'Accountable',    'desc' => 'One dispatcher owns your load end-to-end. No call-center hand-offs.'],
];

$trust_cards = [
    ['id' => 'tc1', 'icon' => 'shield-check', 'title' => 'Fully Insured',      'desc' => '$1M cargo + liability on every single load.'],
    ['id' => 'tc2', 'icon' => 'badge-check',  'title' => 'DOT Compliant',      'desc' => 'MC & USDOT authority. Every carrier vetted before dispatch.'],
    ['id' => 'tc3', 'icon' => 'users',        'title' => 'Expert Dispatchers', 'desc' => 'Decades of heavy haul experience — answering on the second ring.'],
    ['id' => 'tc4', 'icon' => 'truck',        'title' => 'Right Trailers',     'desc' => 'Lowboys, RGNs, step decks, multi-axles — always in stock.'],
    ['id' => 'tc5', 'icon' => 'map-pin',      'title' => 'All 50 States',      'desc' => 'Coast to coast. Door to door. Port pickups and cross-border too.'],
    ['id' => 'tc6', 'icon' => 'award',        'title' => '4.9★ Avg. Rating',   'desc' => 'From 2,400+ verified shippers and equipment dealers.'],
];

$trust_strip = [
    ['id' => 'ts1', 'icon' => 'shield-check', 'top' => '$1,000,000', 'bot' => 'Cargo Insurance'],
    ['id' => 'ts2', 'icon' => 'file-check',   'top' => 'MC & USDOT', 'bot' => 'Fully Authorized'],
    ['id' => 'ts3', 'icon' => 'award',        'top' => 'A+ BBB',     'bot' => 'Accredited'],
    ['id' => 'ts4', 'icon' => 'clock',        'top' => '24 / 7',     'bot' => 'Live Dispatch'],
];

$inside_issue = [
    ['id' => 'io1', 'n' => '01', 'l' => 'Who We Are',        'href' => 'who-we-are'],
    ['id' => 'io2', 'n' => '02', 'l' => 'Mission & Values',  'href' => 'mission'],
    ['id' => 'io3', 'n' => '03', 'l' => 'The Dispatch Floor', 'href' => 'our-team'],
    ['id' => 'io4', 'n' => '04', 'l' => 'Our Trailers',      'href' => 'trailers'],
    ['id' => 'io5', 'n' => '05', 'l' => 'Coast To Coast',    'href' => 'states-we-serve'],
    ['id' => 'io6', 'n' => '06', 'l' => 'Get In Touch',      'href' => 'contact-us'],
];

$stats = [
    ['id' => 'st1', 'v' => '18',     'l' => 'Years on the road'],
    ['id' => 'st2', 'v' => '2,400+', 'l' => 'Verified shippers'],
    ['id' => 'st3', 'v' => '50',     'l' => 'States covered'],
];

$promise_list = [
    ['id' => 'pl1', 't' => 'One dispatcher per load — no hand-offs, no confusion.'],
    ['id' => 'pl2', 't' => 'Permits & escorts handled in-house for oversize moves.'],
    ['id' => 'pl3', 't' => 'Photo updates at pickup, in-transit checkpoints, and delivery.'],
    ['id' => 'pl4', 't' => 'Bonded for cross-border into Canada and Mexico.'],
    ['id' => 'pl5', 't' => 'Catastrophic & emergency recovery available 24/7.'],
];

$us_states = [
    ['name' => 'Alabama', 'abbr' => 'AL'], ['name' => 'Alaska', 'abbr' => 'AK'], ['name' => 'Arizona', 'abbr' => 'AZ'],
    ['name' => 'Arkansas', 'abbr' => 'AR'], ['name' => 'California', 'abbr' => 'CA'], ['name' => 'Colorado', 'abbr' => 'CO'],
    ['name' => 'Connecticut', 'abbr' => 'CT'], ['name' => 'Delaware', 'abbr' => 'DE'], ['name' => 'Florida', 'abbr' => 'FL'],
    ['name' => 'Georgia', 'abbr' => 'GA'], ['name' => 'Hawaii', 'abbr' => 'HI'], ['name' => 'Idaho', 'abbr' => 'ID'],
    ['name' => 'Illinois', 'abbr' => 'IL'], ['name' => 'Indiana', 'abbr' => 'IN'], ['name' => 'Iowa', 'abbr' => 'IA'],
    ['name' => 'Kansas', 'abbr' => 'KS'], ['name' => 'Kentucky', 'abbr' => 'KY'], ['name' => 'Louisiana', 'abbr' => 'LA'],
    ['name' => 'Maine', 'abbr' => 'ME'], ['name' => 'Maryland', 'abbr' => 'MD'], ['name' => 'Massachusetts', 'abbr' => 'MA'],
    ['name' => 'Michigan', 'abbr' => 'MI'], ['name' => 'Minnesota', 'abbr' => 'MN'], ['name' => 'Mississippi', 'abbr' => 'MS'],
    ['name' => 'Missouri', 'abbr' => 'MO'], ['name' => 'Montana', 'abbr' => 'MT'], ['name' => 'Nebraska', 'abbr' => 'NE'],
    ['name' => 'Nevada', 'abbr' => 'NV'], ['name' => 'New Hampshire', 'abbr' => 'NH'], ['name' => 'New Jersey', 'abbr' => 'NJ'],
    ['name' => 'New Mexico', 'abbr' => 'NM'], ['name' => 'New York', 'abbr' => 'NY'], ['name' => 'North Carolina', 'abbr' => 'NC'],
    ['name' => 'North Dakota', 'abbr' => 'ND'], ['name' => 'Ohio', 'abbr' => 'OH'], ['name' => 'Oklahoma', 'abbr' => 'OK'],
    ['name' => 'Oregon', 'abbr' => 'OR'], ['name' => 'Pennsylvania', 'abbr' => 'PA'], ['name' => 'Rhode Island', 'abbr' => 'RI'],
    ['name' => 'South Carolina', 'abbr' => 'SC'], ['name' => 'South Dakota', 'abbr' => 'SD'], ['name' => 'Tennessee', 'abbr' => 'TN'],
    ['name' => 'Texas', 'abbr' => 'TX'], ['name' => 'Utah', 'abbr' => 'UT'], ['name' => 'Vermont', 'abbr' => 'VT'],
    ['name' => 'Virginia', 'abbr' => 'VA'], ['name' => 'Washington', 'abbr' => 'WA'], ['name' => 'West Virginia', 'abbr' => 'WV'],
    ['name' => 'Wisconsin', 'abbr' => 'WI'], ['name' => 'Wyoming', 'abbr' => 'WY'],
];

$hh_img = HH_THEME_URI . '/assets/img/';

get_header();
?>

<!-- COVER -->
<section class="relative bg-secondary text-secondary-foreground overflow-hidden">
    <div class="absolute inset-0 opacity-30">
        <img src="<?php echo esc_url($hh_img . 'hero-trucks.jpg'); ?>" alt="" class="w-full h-full object-cover">
    </div>
    <div class="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/70"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.3),transparent_55%)]"></div>

    <div class="container-tight relative py-16 lg:py-24">
        <div class="flex items-center justify-between border-b border-white/20 pb-4 mb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-white/70">
            <?php hh_ec('about', 'masthead_left', 'Heavy Haul Group · The Magazine', 'span', 'text-primary'); ?>
            <?php hh_ec('about', 'masthead_center', 'Issue No. 01 · 2026', 'span', 'hidden sm:inline'); ?>
            <?php hh_ec('about', 'masthead_right', 'Vol. XVIII · Nationwide Edition', 'span'); ?>
        </div>

        <div class="grid lg:grid-cols-12 gap-10 items-end">
            <div class="lg:col-span-8">
                <?php hh_ec('about', 'cover_eyebrow', 'Cover Feature · About Us', 'p', 'text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4'); ?>
                <h1 class="stencil text-5xl sm:text-7xl lg:text-[7.5rem] font-bold uppercase leading-[0.88]">
                    <?php hh_ec('about', 'cover_title_1', 'Honest.'); ?> <br>
                    <?php hh_ec('about', 'cover_title_2', 'Dependable.'); ?> <br>
                    <?php hh_ec('about', 'cover_title_3', 'Customer-First.', 'span', 'text-primary'); ?>
                </h1>
                <?php hh_ec('about', 'cover_subtitle', 'A nationwide heavy haul network moving oversize loads, construction equipment, agricultural machinery, industrial freight, and heavy duty trucks across all 50 states.', 'p', 'mt-7 text-white/85 text-lg sm:text-xl max-w-2xl leading-relaxed'); ?>
            </div>
            <aside class="lg:col-span-4 space-y-3">
                <div class="bg-white/5 backdrop-blur border border-white/15 rounded-md p-5">
                    <?php hh_ec('about', 'cover_aside_heading', 'Inside This Issue', 'p', 'text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-3'); ?>
                    <ol class="space-y-2 text-sm">
                        <?php foreach ($inside_issue as $io): ?>
                            <li>
                                <a href="#<?php echo esc_attr($io['href']); ?>" class="group flex items-baseline justify-between gap-3 hover:text-primary transition">
                                    <span class="flex items-baseline gap-3 min-w-0">
                                        <?php hh_ec('about', $io['id'] . '_n', $io['n'], 'span', 'stencil text-primary text-base shrink-0'); ?>
                                        <?php hh_ec('about', $io['id'] . '_l', $io['l'], 'span', 'font-display uppercase truncate'); ?>
                                    </span>
                                    <span class="flex-1 border-b border-dotted border-white/20 mb-1"></span>
                                    <?php echo hh_lucide('arrow-right', 'h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition'); ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ol>
                </div>
                <a href="<?php echo esc_attr($hh_tel); ?>" class="block bg-primary text-secondary rounded-md p-4 shadow-cta hover:shadow-lg transition">
                    <?php hh_ec('about', 'cover_phone_label', '24/7 Direct Line', 'div', 'text-[10px] uppercase tracking-[0.3em] font-bold opacity-70'); ?>
                    <div class="stencil text-2xl flex items-center gap-2 mt-1"><?php echo hh_lucide('phone', 'h-5 w-5'); ?>
                        <?php hh_ec('about', 'cover_phone_number', $hh_display, 'span'); ?>
                    </div>
                </a>
            </aside>
        </div>
    </div>

    <!-- Trust strip -->
    <div class="relative border-t border-white/15 bg-black/30">
        <div class="container-tight grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            <?php foreach ($trust_strip as $ts): ?>
                <div class="flex items-center gap-2.5 px-3 sm:px-5 py-3.5">
                    <span class="h-8 w-8 rounded-md bg-primary/20 text-primary flex items-center justify-center shrink-0">
                        <?php echo hh_lucide($ts['icon'], 'h-4 w-4'); ?>
                    </span>
                    <div class="leading-tight min-w-0">
                        <?php hh_ec('about', $ts['id'] . '_top', $ts['top'], 'div', 'font-extrabold text-sm truncate'); ?>
                        <?php hh_ec('about', $ts['id'] . '_bot', $ts['bot'], 'div', 'text-[10px] uppercase tracking-wider text-white/60 font-bold truncate'); ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CHAPTER 01 -->
<section id="who-we-are" class="py-16 lg:py-24 bg-background scroll-mt-24 relative overflow-hidden">
    <div class="container-tight relative">
        <div class="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch1_kicker', 'Our Story', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <p class="font-display uppercase text-xs text-muted-foreground tracking-widest">Chapter <?php hh_ec('about', 'ch1_num', '01'); ?></p>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">01</span>
        </div>
        <h2 class="stencil text-4xl sm:text-6xl lg:text-7xl uppercase font-bold leading-[0.92] max-w-5xl">
            <?php hh_ec('about', 'ch1_title', 'Built On Trust. Forged In Iron. Driven By People.'); ?>
        </h2>
        <?php hh_ec('about', 'ch1_intro', 'A heavy haul transport company built around customer trust — with a dispatch floor that picks up on the second ring, any hour of the day.', 'p', 'mt-5 text-muted-foreground text-lg max-w-3xl leading-relaxed'); ?>

        <div class="mt-12 grid lg:grid-cols-12 gap-10 lg:gap-14">
            <div class="lg:col-span-7">
                <article class="text-foreground text-[16px] leading-[1.8] sm:columns-2 sm:gap-10 [column-fill:_balance]">
                    <?php hh_ec('about', 'ch1_p1', "We're a heavy haul transport company built around customer trust. We listen to your specific shipping needs and take our expertise and professionalism to the next level — giving you the best transportation experience on the road.", 'p', 'first-letter:stencil first-letter:text-primary first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]'); ?>
                    <?php hh_ec('about', 'ch1_p2', "Whether it's a farming & agriculture vehicle, industrial machinery, vocational freight, a full truck fleet or any oversize cargo — Heavy Haul Group can and will get it where it needs to be. Fill out our free estimate form or call us anytime, day or night.", 'p', 'mt-4'); ?>
                    <?php hh_ec('about', 'ch1_p3', 'We started with one dispatcher and one phone line in 2008. Today our 50-state network moves thousands of loads a year for equipment dealers, auction buyers, OEM plants, contractors, and farmers — but the rule hasn\'t changed: one dispatcher owns your load, end to end.', 'p', 'mt-4'); ?>
                    <?php hh_ec('about', 'ch1_p4', 'No call-center hand-offs. No mystery surcharges at delivery. Just iron moved right, on time, every time.', 'p', 'mt-4'); ?>
                </article>

                <figure class="mt-10 border-l-4 border-primary pl-6">
                    <?php echo hh_lucide('quote', 'h-7 w-7 text-primary mb-2'); ?>
                    <blockquote class="font-display uppercase text-2xl sm:text-3xl leading-tight text-foreground">
                        <?php hh_ec('about', 'ch1_quote', '"If it rolls, tracks, lifts, drills or hauls — we\'ll get it where it needs to be."'); ?>
                    </blockquote>
                    <?php hh_ec('about', 'ch1_quote_attr', '— The Dispatch Floor', 'figcaption', 'mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground font-bold'); ?>
                </figure>
            </div>

            <aside class="lg:col-span-5">
                <div class="grid grid-cols-6 grid-rows-6 gap-3 h-[480px] sm:h-[560px]">
                    <figure class="col-span-6 row-span-4 relative overflow-hidden rounded-md border border-border group">
                        <img src="<?php echo esc_url($hh_img . 'hero-trucks.jpg'); ?>" alt="Heavy haul fleet at sunset" loading="lazy" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent"></div>
                        <figcaption class="absolute bottom-3 left-3 right-3">
                            <?php hh_ec('about', 'ch1_cover_eyebrow', 'Cover Story', 'p', 'text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary'); ?>
                            <?php hh_ec('about', 'ch1_cover_title', 'Heavy Iron, Moved Right', 'p', 'font-display uppercase text-white text-lg leading-tight'); ?>
                        </figcaption>
                    </figure>
                    <figure class="col-span-3 row-span-2 relative overflow-hidden rounded-md border border-border group">
                        <img src="<?php echo esc_url($hh_img . 'truck-semi.jpg'); ?>" alt="Semi truck on the highway" loading="lazy" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700">
                        <?php hh_ec('about', 'ch1_fig_fleet', 'Fleet', 'figcaption', 'absolute bottom-2 left-2 text-[9px] uppercase tracking-widest font-bold text-white bg-secondary/80 px-2 py-0.5 rounded-sm'); ?>
                    </figure>
                    <figure class="col-span-3 row-span-2 relative overflow-hidden rounded-md border border-border group">
                        <img src="<?php echo esc_url($hh_img . 'industrial-transformer.jpg'); ?>" alt="Industrial transformer on multi-axle trailer" loading="lazy" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-700">
                        <?php hh_ec('about', 'ch1_fig_oversize', 'Oversize', 'figcaption', 'absolute bottom-2 left-2 text-[9px] uppercase tracking-widest font-bold text-white bg-secondary/80 px-2 py-0.5 rounded-sm'); ?>
                    </figure>
                </div>

                <div class="mt-5 grid grid-cols-3 gap-3">
                    <?php foreach ($stats as $s): ?>
                        <div class="bg-secondary text-secondary-foreground rounded-md p-4 text-center border-t-4 border-primary">
                            <?php hh_ec('about', $s['id'] . '_v', $s['v'], 'div', 'stencil text-primary text-3xl leading-none'); ?>
                            <?php hh_ec('about', $s['id'] . '_l', $s['l'], 'div', 'mt-1.5 text-[10px] uppercase tracking-widest text-white/80 font-bold'); ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="mt-3 flex items-center gap-3 bg-card border border-border rounded-md p-4">
                    <div class="flex">
                        <?php for ($i = 0; $i < 5; $i++): ?>
                            <?php echo hh_lucide('star', 'h-4 w-4 text-primary fill-primary'); ?>
                        <?php endfor; ?>
                    </div>
                    <div class="text-xs">
                        <?php hh_ec('about', 'ch1_rating_score', '4.9 / 5', 'span', 'font-bold text-foreground'); ?>
                        <?php hh_ec('about', 'ch1_rating_meta', ' · 2,400+ verified loads', 'span', 'text-muted-foreground'); ?>
                    </div>
                </div>
            </aside>
        </div>

        <!-- By the numbers -->
        <div class="mt-16 pt-10 border-t border-border">
            <div class="flex items-end justify-between flex-wrap gap-3 mb-6">
                <div>
                    <?php hh_ec('about', 'trust_eyebrow', 'Sidebar · Why Shippers Trust Us', 'p', 'text-primary font-bold uppercase tracking-[0.3em] text-[11px] mb-1'); ?>
                    <h3 class="stencil text-2xl sm:text-3xl uppercase font-bold">
                        <?php hh_ec('about', 'trust_title_1', 'By The '); ?>
                        <?php hh_ec('about', 'trust_title_2', 'Numbers', 'span', 'text-primary'); ?>
                    </h3>
                </div>
                <?php hh_ec('about', 'trust_meta', 'Verified · Licensed · Insured', 'p', 'text-xs uppercase tracking-widest text-muted-foreground font-bold'); ?>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php foreach ($trust_cards as $tc): ?>
                    <div class="group relative bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-card transition-all overflow-hidden">
                        <div class="absolute top-0 left-0 h-1 w-12 bg-primary group-hover:w-full transition-all duration-500"></div>
                        <div class="flex items-start gap-4">
                            <span class="h-12 w-12 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                                <?php echo hh_lucide($tc['icon'], 'h-6 w-6'); ?>
                            </span>
                            <div class="min-w-0">
                                <?php hh_ec('about', $tc['id'] . '_title', $tc['title'], 'h4', 'font-display uppercase text-lg leading-tight'); ?>
                                <?php hh_ec('about', $tc['id'] . '_desc', $tc['desc'], 'p', 'text-sm text-muted-foreground leading-relaxed mt-2'); ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- CHAPTER 02 — MISSION -->
<section id="mission" class="py-16 lg:py-24 bg-secondary text-secondary-foreground scroll-mt-24 relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.18),transparent_55%)]"></div>
    <div class="container-tight relative">
        <div class="flex items-end justify-between gap-4 border-b-2 border-white/30 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch2_kicker', 'The Code We Run By', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <?php hh_ec('about', 'ch2_chapter', 'Chapter 02 · Mission & Values', 'p', 'font-display uppercase text-xs text-white/50 tracking-widest'); ?>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-white/10 leading-none select-none">02</span>
        </div>

        <div class="grid lg:grid-cols-12 gap-10 lg:gap-14">
            <div class="lg:col-span-5">
                <h2 class="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
                    <?php hh_ec('about', 'ch2_title_1', 'Move Heavy.'); ?> <br>
                    <?php hh_ec('about', 'ch2_title_2', 'Move Right.', 'span', 'text-primary'); ?>
                </h2>
                <?php hh_ec('about', 'ch2_intro', 'Get heavy iron from point A to point B safely, legally, and on time — while treating every shipper like our most important customer. We earn trust load by load.', 'p', 'text-white/75 mt-5 leading-relaxed text-lg'); ?>
                <figure class="mt-8 border-l-4 border-primary pl-5">
                    <?php echo hh_lucide('quote', 'h-6 w-6 text-primary mb-2'); ?>
                    <blockquote class="font-display uppercase text-xl leading-tight">
                        <?php hh_ec('about', 'ch2_quote', '"Your load is our reputation. We don\'t ship anything we wouldn\'t sign our name to."'); ?>
                    </blockquote>
                    <?php hh_ec('about', 'ch2_quote_attr', '— Mike Reilly, Senior Dispatcher', 'figcaption', 'mt-3 text-[10px] uppercase tracking-[0.25em] text-white/50 font-bold'); ?>
                </figure>
                <div class="mt-6 flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
                    <?php echo hh_lucide('compass', 'h-5 w-5'); ?> <?php hh_ec('about', 'ch2_principles_label', 'Four Guiding Principles'); ?>
                </div>
            </div>
            <div class="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                <?php foreach ($values as $idx => $v): ?>
                    <div class="bg-white/5 backdrop-blur border border-white/10 rounded-md p-6 hover:border-primary hover:bg-white/10 transition group">
                        <div class="flex items-start justify-between mb-3">
                            <?php echo hh_lucide($v['icon'], 'h-7 w-7 text-primary'); ?>
                            <span class="stencil text-2xl text-white/20 group-hover:text-primary/40 transition">0<?php echo (int) ($idx + 1); ?></span>
                        </div>
                        <?php hh_ec('about', $v['id'] . '_title', $v['title'], 'h3', 'font-display uppercase text-xl'); ?>
                        <?php hh_ec('about', $v['id'] . '_desc', $v['desc'], 'p', 'text-sm text-white/70 mt-2 leading-relaxed'); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<!-- CHAPTER 03 — TEAM -->
<section id="our-team" class="py-16 lg:py-24 bg-background scroll-mt-24">
    <div class="container-tight">
        <div class="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch3_kicker', 'Profile', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <?php hh_ec('about', 'ch3_chapter', 'Chapter 03 · The Dispatch Floor', 'p', 'font-display uppercase text-xs text-muted-foreground tracking-widest'); ?>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">03</span>
        </div>
        <h2 class="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92] max-w-4xl">
            <?php hh_ec('about', 'ch3_title_1', 'The People '); ?>
            <?php hh_ec('about', 'ch3_title_2', 'Behind The Load.', 'span', 'text-primary'); ?>
        </h2>
        <?php hh_ec('about', 'ch3_intro', 'Real dispatchers, not call-center reps. Each load gets one direct contact — from quote to delivery. Combined, our team has moved heavy iron for more than 47 years.', 'p', 'text-muted-foreground max-w-2xl mt-5 mb-12 leading-relaxed text-lg'); ?>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php foreach ($team as $idx => $p): ?>
                <article class="bg-card border border-border rounded-md overflow-hidden group hover:border-primary hover:shadow-card transition">
                    <div class="aspect-[4/5] overflow-hidden bg-muted relative">
                        <img src="<?php echo esc_url($hh_img . $p['img']); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 grayscale group-hover:grayscale-0">
                        <span class="absolute top-3 left-3 stencil text-3xl text-white drop-shadow-lg">0<?php echo (int) ($idx + 1); ?></span>
                        <?php hh_ec('about', $p['id'] . '_years', $p['years'], 'span', 'absolute top-3 right-3 bg-primary text-secondary text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-sm'); ?>
                        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/90 to-transparent p-4">
                            <?php hh_ec('about', $p['id'] . '_quote', $p['quote'], 'p', 'font-display uppercase text-xs italic text-white/90 leading-snug'); ?>
                        </div>
                    </div>
                    <div class="p-5 border-t border-border">
                        <?php hh_ec('about', $p['id'] . '_name', $p['name'], 'h3', 'font-display uppercase text-lg leading-tight'); ?>
                        <?php hh_ec('about', $p['id'] . '_role', $p['role'], 'p', 'text-xs uppercase tracking-wider text-primary mt-1 font-bold'); ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- MID-CTA -->
<section class="relative py-16 bg-secondary text-secondary-foreground overflow-hidden">
    <div class="absolute inset-0 opacity-25">
        <img src="<?php echo esc_url($hh_img . 'hero-trucks.jpg'); ?>" alt="" class="w-full h-full object-cover">
    </div>
    <div class="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_60%)]"></div>
    <div class="container-tight relative">
        <div class="border-y-2 border-primary py-10 sm:py-14 text-center max-w-3xl mx-auto">
            <?php hh_ec('about', 'cta_eyebrow', 'A Word From Our Dispatch Floor', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-4'); ?>
            <h2 class="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.95]">
                <?php hh_ec('about', 'cta_title_1', 'Ready To Move'); ?> <br>
                <?php hh_ec('about', 'cta_title_2', 'Heavy Iron?', 'span', 'text-primary'); ?>
            </h2>
            <?php hh_ec('about', 'cta_subtitle', "Call now or request a no-obligation quote — we'll beat any written rate.", 'p', 'mt-5 text-white/80 text-lg'); ?>
            <div class="mt-7 flex flex-wrap gap-3 justify-center">
                <?php
                ob_start();
                echo hh_lucide('phone', 'h-5 w-5') . ' ';
                hh_ec('about', 'cta_call_label', 'Call ' . $hh_display);
                $hh_cta_call_label = ob_get_clean();
                hh_button($hh_cta_call_label, $hh_tel, 'hero', 'xl');

                ob_start();
                hh_ec('about', 'cta_quote_label', 'Get Free Quote');
                echo ' ' . hh_lucide('arrow-right', 'h-5 w-5');
                $hh_cta_quote_label = ob_get_clean();
                hh_button($hh_cta_quote_label, home_url('/#quote'), 'call', 'xl');
                ?>
            </div>
        </div>
    </div>
</section>

<!-- CHAPTER 04 — TRAILERS -->
<section id="trailers" class="py-16 lg:py-24 bg-background scroll-mt-24">
    <div class="container-tight">
        <div class="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch4_kicker', 'Gallery Feature', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <?php hh_ec('about', 'ch4_chapter', 'Chapter 04 · Our Trailers', 'p', 'font-display uppercase text-xs text-muted-foreground tracking-widest'); ?>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">04</span>
        </div>

        <div class="grid lg:grid-cols-12 gap-6 items-end mb-10">
            <h2 class="lg:col-span-7 stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
                <?php hh_ec('about', 'ch4_title_1', 'The Trailers '); ?>
                <?php hh_ec('about', 'ch4_title_2', 'We Use.', 'span', 'text-primary'); ?>
            </h2>
            <?php hh_ec('about', 'ch4_intro', 'From hot shots to multi-axle super-loads — the right trailer for every job. Owned and partner equipment, always inspected and ready to roll.', 'p', 'lg:col-span-5 text-muted-foreground leading-relaxed'); ?>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <?php foreach ($trailers as $idx => $t):
                $is_first = $idx === 0;
                $card_class = 'bg-card border border-border rounded-lg overflow-hidden group hover:border-primary hover:shadow-card transition-all' . ($is_first ? ' lg:col-span-2 lg:row-span-2' : '');
                $frame_class = 'overflow-hidden bg-muted relative ' . ($is_first ? 'aspect-[16/10] lg:aspect-[16/11]' : 'aspect-[16/10]');
                $name_class = 'font-display uppercase leading-tight ' . ($is_first ? 'text-2xl sm:text-3xl' : 'text-xl');
                ?>
                <article class="<?php echo esc_attr($card_class); ?>">
                    <div class="<?php echo esc_attr($frame_class); ?>">
                        <img src="<?php echo esc_url($hh_img . $t['img']); ?>" alt="<?php echo esc_attr($t['name'] . ' trailer'); ?>" loading="lazy" width="1280" height="800" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <?php hh_ec('about', $t['id'] . '_cap', $t['cap'], 'span', 'absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-sm border border-primary/40'); ?>
                        <span class="absolute top-3 right-3 stencil text-2xl text-white drop-shadow-lg">0<?php echo (int) ($idx + 1); ?></span>
                    </div>
                    <div class="p-5">
                        <?php hh_ec('about', $t['id'] . '_name', $t['name'], 'h3', $name_class); ?>
                        <?php hh_ec('about', $t['id'] . '_desc', $t['desc'], 'p', 'text-sm text-muted-foreground mt-2 leading-relaxed'); ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CHAPTER 05 — STATES -->
<section id="states-we-serve" class="py-16 lg:py-24 bg-muted/40 scroll-mt-24">
    <div class="container-tight">
        <div class="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch5_kicker', 'The Atlas', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <?php hh_ec('about', 'ch5_chapter', 'Chapter 05 · States We Serve', 'p', 'font-display uppercase text-xs text-muted-foreground tracking-widest'); ?>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">05</span>
        </div>

        <h2 class="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92] max-w-5xl">
            <?php hh_ec('about', 'ch5_title_1', 'All 50 States · '); ?>
            <?php hh_ec('about', 'ch5_title_2', 'Coast To Coast.', 'span', 'text-primary'); ?>
        </h2>
        <?php hh_ec('about', 'ch5_intro', 'Door-to-door heavy haul coverage in every U.S. state — including Alaska & Hawaii. Local dispatchers, vetted carriers, and permit teams on the ground.', 'p', 'text-muted-foreground mt-5 mb-10 max-w-2xl leading-relaxed text-lg'); ?>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <?php foreach ($us_states as $s):
                $abbr_lower = strtolower($s['abbr']); ?>
                <div class="group flex items-center gap-3 bg-card border border-border rounded-md p-3 hover:border-primary hover:shadow-card transition">
                    <div class="w-12 h-9 shrink-0 rounded-sm overflow-hidden border border-border bg-muted">
                        <img
                            src="https://flagcdn.com/w80/us-<?php echo esc_attr($abbr_lower); ?>.png"
                            srcset="https://flagcdn.com/w160/us-<?php echo esc_attr($abbr_lower); ?>.png 2x"
                            alt="<?php echo esc_attr($s['name'] . ' state flag'); ?>"
                            loading="lazy"
                            class="w-full h-full object-cover">
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="font-display uppercase text-sm leading-tight truncate"><?php echo esc_html($s['name']); ?></div>
                        <div class="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5 flex items-center gap-1">
                            <?php echo hh_lucide('map-pin', 'h-2.5 w-2.5 text-primary'); ?> <?php echo esc_html($s['abbr']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- CHAPTER 06 — CONTACT -->
<section id="contact-us" class="py-16 lg:py-24 bg-background scroll-mt-24">
    <div class="container-tight">
        <div class="flex items-end justify-between gap-4 border-b-2 border-foreground/90 pb-4 mb-8">
            <div>
                <?php hh_ec('about', 'ch6_kicker', 'From The Editor', 'p', 'text-primary font-bold uppercase tracking-[0.4em] text-[11px] mb-1'); ?>
                <?php hh_ec('about', 'ch6_chapter', 'Chapter 06 · Get In Touch', 'p', 'font-display uppercase text-xs text-muted-foreground tracking-widest'); ?>
            </div>
            <span class="stencil text-5xl sm:text-7xl text-foreground/10 leading-none select-none">06</span>
        </div>

        <div class="grid lg:grid-cols-12 gap-10 items-start">
            <div class="lg:col-span-7">
                <h2 class="stencil text-4xl sm:text-6xl uppercase font-bold leading-[0.92]">
                    <?php hh_ec('about', 'ch6_title_1', 'Our Promise:'); ?> <br>
                    <?php hh_ec('about', 'ch6_title_2', 'Safety, Speed, Straight Talk.', 'span', 'text-primary'); ?>
                </h2>
                <?php hh_ec('about', 'ch6_intro', "Every load is treated like it's our own. Our dispatchers don't disappear once a quote is signed — they call you with updates, handle permit paperwork, and make sure your equipment arrives when it's supposed to. No surprises.", 'p', 'text-muted-foreground mt-5 leading-relaxed text-lg'); ?>
                <div class="mt-6 grid sm:grid-cols-2 gap-3">
                    <a href="<?php echo esc_attr($hh_tel); ?>" class="flex items-center gap-3 bg-card border border-border rounded-md p-4 hover:border-primary transition">
                        <span class="h-11 w-11 rounded-md bg-gradient-amber flex items-center justify-center shadow-cta"><?php echo hh_lucide('phone', 'h-5 w-5 text-secondary'); ?></span>
                        <div>
                            <?php hh_ec('about', 'ch6_call_label', 'Call 24/7', 'div', 'text-[10px] uppercase tracking-widest text-muted-foreground'); ?>
                            <?php hh_ec('about', 'ch6_call_number', $hh_display, 'div', 'stencil text-xl'); ?>
                        </div>
                    </a>
                    <a href="mailto:dispatch@heavyhaulgroup.com" class="flex items-center gap-3 bg-card border border-border rounded-md p-4 hover:border-primary transition">
                        <span class="h-11 w-11 rounded-md bg-secondary text-primary flex items-center justify-center"><?php echo hh_lucide('mail', 'h-5 w-5'); ?></span>
                        <div>
                            <?php hh_ec('about', 'ch6_email_label', 'Email', 'div', 'text-[10px] uppercase tracking-widest text-muted-foreground'); ?>
                            <?php hh_ec('about', 'ch6_email_addr', 'dispatch@heavyhaulgroup.com', 'div', 'font-display uppercase text-sm'); ?>
                        </div>
                    </a>
                </div>
                <?php
                ob_start();
                hh_ec('about', 'ch6_btn_call', 'Call A Dispatcher · ' . $hh_display);
                $hh_ch6_btn_call = ob_get_clean();
                hh_button($hh_ch6_btn_call, $hh_tel, 'hero', 'xl', 'mt-6');
                ?>
            </div>
            <div class="lg:col-span-5 bg-card border border-border rounded-md p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 stencil text-[8rem] text-foreground/[0.04] leading-none select-none">06</div>
                <h3 class="stencil text-2xl uppercase mb-4 relative">
                    <?php hh_ec('about', 'ch6_side_title_1', 'Why Shippers '); ?>
                    <?php hh_ec('about', 'ch6_side_title_2', 'Stay With Us', 'span', 'text-primary'); ?>
                </h3>
                <ul class="space-y-3 text-sm text-muted-foreground relative">
                    <?php foreach ($promise_list as $pl): ?>
                        <li class="flex gap-2.5">
                            <?php echo hh_lucide('circle-check', 'h-5 w-5 text-primary shrink-0 mt-0.5'); ?>
                            <?php hh_ec('about', $pl['id'], $pl['t'], 'span'); ?>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php
                ob_start();
                hh_ec('about', 'ch6_browse_btn', 'Browse All Services');
                echo ' ' . hh_lucide('arrow-right', 'h-5 w-5');
                $hh_browse_label = ob_get_clean();
                hh_button($hh_browse_label, home_url('/services'), 'outline', 'lg', 'mt-6 w-full');
                ?>
            </div>
        </div>

        <!-- Colophon -->
        <div class="mt-16 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">
            <?php hh_ec('about', 'colophon_left', 'Heavy Haul Group · The Magazine', 'span'); ?>
            <?php hh_ec('about', 'colophon_center', 'End Of Issue · Thank You For Reading', 'span'); ?>
            <?php hh_ec('about', 'colophon_right', 'Vol. XVIII · Nationwide Edition', 'span'); ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
