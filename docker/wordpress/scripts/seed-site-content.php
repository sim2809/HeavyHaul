<?php
/**
 * Seed the "Site Content" options pages (inc/acf/acf-site-content.php) with one repeater
 * row per hh_content()/hh_ec() call found across the theme, using the exact fallback
 * string each call currently renders. Today every hh_site_content_{page_key} "items"
 * repeater has zero rows, so although the live site displays the correct copy (from the
 * PHP fallback arguments), none of it is actually editable in wp-admin. This script makes
 * every one of those ~150 strings a real, editable row that matches what's currently live,
 * byte-for-byte.
 *
 * Run with:
 *   wp eval-file docker/wordpress/scripts/seed-site-content.php --allow-root
 *
 * Idempotent by full replacement: each page_key's entire `items` array is rebuilt and
 * written with update_field() every run (not merged row-by-row) — there's no natural
 * unique ID to match existing rows against besides block_key itself, and a full replace
 * is simpler and always correct here since this script is the single source of truth for
 * the seed content.
 *
 * Scope note — the "trust" page_key (HH_SITE_CONTENT_PAGE_KEYS in acf-site-content.php)
 * has NO hh_content('trust', ...) calls anywhere in the theme today (the About page's
 * "trust_*" copy actually lives under page_key "about", not "trust"), so there is nothing
 * to seed for it and it's intentionally left untouched here.
 *
 * Dynamic-fallback exceptions — 4 hh_ec() calls in page-about.php pass a *computed*
 * fallback (the site's phone number from Theme Settings, via hh_setting()) rather than a
 * literal string, so there is no fixed "current fallback string" to seed and seeding one
 * would freeze a phone number into Site Content that's supposed to stay dynamic:
 *   - about / cover_phone_number  (fallback: hh_setting('phone_primary_display'))
 *   - about / cta_call_label      (fallback: 'Call ' . hh_setting('phone_primary_display'))
 *   - about / ch6_call_number     (fallback: hh_setting('phone_primary_display'))
 *   - about / ch6_btn_call        (fallback: 'Call A Dispatcher · ' . hh_setting('phone_primary_display'))
 * These 4 block_keys are intentionally NOT seeded — if an editor wants to override that
 * copy they can still add a row for these keys by hand in wp-admin.
 */

if (!function_exists('update_field')) {
    WP_CLI::error('ACF (update_field) is not available — is ACF/SCF active?');
}

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

/** "hero_title_line3" -> "Hero Title Line 3". Mechanical, not meant to be perfect prose —
 * just enough for an editor to recognize the block in the repeater's collapsed row list. */
function hh_sc_label(string $block_key): string {
    $words = explode('_', $block_key);
    $words = array_map(static function (string $w): string {
        $w = preg_replace('/([a-zA-Z])(\d)/', '$1 $2', $w);
        return ucfirst($w);
    }, $words);
    return implode(' ', $words);
}

/** Short strings stay "text"; longer paragraph copy becomes "textarea" so the editor gets
 * a bigger box. Purely an editorial hint — hh_content()/hh_content_style() never read
 * "kind" when rendering, so this has no effect on the live site either way. */
function hh_sc_kind(string $content): string {
    return strlen($content) > 100 ? 'textarea' : 'text';
}

/** Blank "no override" style group — matches every sub-field hh_style_subfields() defines
 * in inc/acf/acf-common.php, all left empty/null. */
function hh_sc_blank_style(): array {
    return [
        'color' => '',
        'background_color' => '',
        'font_size' => '',
        'font_weight' => null,
        'font_family' => null,
        'text_align' => null,
        'letter_spacing' => '',
        'line_height' => '',
    ];
}

/** Turns an ordered [block_key => fallback_content] map into the full repeater row shape. */
function hh_sc_build_rows(array $content_by_key): array {
    $rows = [];
    foreach ($content_by_key as $block_key => $content) {
        $rows[] = [
            'block_key' => $block_key,
            'label' => hh_sc_label($block_key),
            'kind' => hh_sc_kind($content),
            'content' => $content,
            'style' => hh_sc_blank_style(),
        ];
    }
    return $rows;
}

/* ────────────────────────────────────────────────────────────────────────
 * header.php — page key "header"
 * ──────────────────────────────────────────────────────────────────────── */
$HEADER = [
    'services_label' => 'Services',
    'featured_service_badge' => 'New',
    'featured_service_title' => 'Tractor Shipping Services',
    'featured_service_desc' => 'Compact, row-crop, 4WD & high-HP tractors nationwide',
    'about_label' => 'About',
    'blog_label' => 'News & Guides',
    'cta_label' => 'Get Quote',
    'tagline' => '24/7 Dispatch',
];

/* ────────────────────────────────────────────────────────────────────────
 * footer.php — page key "footer"
 * ──────────────────────────────────────────────────────────────────────── */
$FOOTER = [
    'description' => 'Nationwide heavy haul, oversize load, and equipment transport, built on safety, speed, and straight talk.',
    'call_label' => 'Call 24/7',
    'services_heading' => 'Services',
    'company_heading' => 'Company',
    'resources_heading' => 'Resources',
    'tagline' => 'heavyhaulgroup.com · Nationwide Service',
];

/* ────────────────────────────────────────────────────────────────────────
 * front-page.php — page key "home"
 * ──────────────────────────────────────────────────────────────────────── */
$HOME = [
    'hero_trust_1' => 'Fully Insured',
    'hero_trust_2' => 'DOT Compliant',
    'hero_trust_3' => 'Expert Drivers',
    'hero_trust_4' => 'All 50 States',

    'stat_1_label' => 'Avg. Rating',
    'stat_1_sub' => '2,400+ shippers',
    'stat_2_label' => 'Years',
    'stat_2_sub' => 'In heavy haul',
    'stat_3_label' => 'Loads',
    'stat_3_sub' => 'Delivered safely',
    'stat_4_label' => 'States',
    'stat_4_sub' => 'Nationwide coverage',

    'why_1_title' => 'Same / Next Day Dispatch',
    'why_1_desc' => 'Urgent loads moved within hours, not days.',
    'why_2_title' => 'Real-Time Updates',
    'why_2_desc' => 'Direct line to your dispatcher from pickup to delivery.',
    'why_3_title' => 'Heavy Haul Specialists',
    'why_3_desc' => 'Decades of oversize and superload experience.',
    'why_4_title' => 'Competitive Pricing',
    'why_4_desc' => 'Transparent quotes, no hidden fees.',
    'why_5_title' => 'Nationwide Network',
    'why_5_desc' => 'Thousands of vetted carriers across all 50 states.',
    'why_6_title' => 'Fully Insured Loads',
    'why_6_desc' => 'Cargo and liability coverage on every shipment.',

    'step_1_title' => 'Request a Quote',
    'step_1_desc' => 'Share your route, equipment and timing.',
    'step_2_title' => 'Plan & Assign Carrier',
    'step_2_desc' => 'We secure permits and the right rig.',
    'step_3_title' => 'Pickup & Secure Transport',
    'step_3_desc' => 'Loaded, strapped, and on the road.',
    'step_4_title' => 'Delivery & Confirmation',
    'step_4_desc' => 'Safe drop-off with proof of delivery.',

    'hero_badge_1' => '#1 Rated Heavy Haul Carrier Network',
    'hero_badge_2' => '12 Dispatchers Online Now',
    'hero_title_line1' => 'Heavy Haul &',
    'hero_title_line2' => 'Oversize Load',
    'hero_title_line3' => 'Transport Nationwide',
    'hero_subtitle' => 'Quality heavy load transport, anytime, anywhere across the United States. Same-day quotes. Fully insured. DOT compliant.',
    'hero_phone_label' => 'Speak To A Dispatcher',
    'hero_cta_label' => 'Get Free Quote',

    'services_eyebrow' => 'What We Haul',
    'services_title_1' => 'Specialized Transport',
    'services_title_2' => 'For Every Industry',
    'services_subtitle' => 'From farm equipment to industrial machinery, click any category for full sub-services, brand specialties, and shipping rates.',

    'coverage_eyebrow' => 'Nationwide Coverage',
    'coverage_title_1' => 'Heavy Haul',
    'coverage_title_2' => 'In Your State',
    'coverage_subtitle' => 'We dispatch heavy haul and oversize load transport in every U.S. state, coast to coast.',
    'coverage_card_value' => '50 / 50',
    'coverage_card_label' => 'States Covered',
    'coverage_card_note' => "Local dispatchers, nationwide network. Pick a state, we'll have a rig on it.",

    'why_eyebrow' => 'Why Heavy Haul Group',
    'why_title_1' => 'Built For Heavy.',
    'why_title_2' => 'Trusted For Every Mile.',
    'why_subtitle' => 'We move what others can\'t. Our dispatchers, drivers, and equipment are dedicated 100% to oversize and heavy haul freight.',

    'steps_eyebrow' => 'Strategic Execution',
    'steps_title' => 'From Quote To Delivery',
];

/* ────────────────────────────────────────────────────────────────────────
 * front-page.php DispatcherTeam — page key "dispatchers"
 * ──────────────────────────────────────────────────────────────────────── */
$DISPATCHERS_STATIC = [
    'eyebrow' => 'Human-Led Logistics',
    'title_1' => 'Meet Your',
    'title_2' => 'Dispatch Team',
    'subtitle' => 'No call centers. No bots. Speak directly with the specialized dispatcher handling your load — from quote to confirmation.',
    'cta_label' => 'Talk To A Dispatcher Now',
];
$DISPATCHER_MEMBERS = [
    ['name' => 'Mike', 'role' => 'Senior Dispatcher', 'years' => '12', 'online' => 'true'],
    ['name' => 'Sarah', 'role' => 'Permits & Routing', 'years' => '9', 'online' => 'true'],
    ['name' => 'Carlos', 'role' => 'Oversize Specialist', 'years' => '15', 'online' => 'true'],
    ['name' => 'Danny', 'role' => 'Heavy Haul Lead', 'years' => '11', 'online' => 'false'],
];
$DISPATCHERS = $DISPATCHERS_STATIC;
foreach ($DISPATCHER_MEMBERS as $i => $d) {
    $n = $i + 1;
    $DISPATCHERS["m{$n}_name"] = $d['name'];
    $DISPATCHERS["m{$n}_role"] = $d['role'];
    $DISPATCHERS["m{$n}_years"] = $d['years'];
    $DISPATCHERS["m{$n}_online"] = $d['online'];
}

/* ────────────────────────────────────────────────────────────────────────
 * front-page.php FAQ — page key "faq"
 * ──────────────────────────────────────────────────────────────────────── */
$FAQ_STATIC = [
    'eyebrow' => 'Frequently Asked',
    'title_1' => 'Got Questions?',
    'title_2' => "We've Got Answers.",
    'subtitle' => 'Most shippers ask the same things before booking. Here are straight answers to the top 8 — pricing, insurance, timing, and more.',
    'side_note' => 'Still have a question? Talk to a real dispatcher in under 60 seconds.',
    'side_email_label' => 'Email Dispatch',
];
$FAQ_DEFAULTS = [
    ['q' => 'How much does heavy haul shipping cost?', 'a' => 'Most heavy haul shipments range from $2.50 to $5.50 per mile, depending on equipment size, weight, distance, and required permits. Use our instant quote calculator above for a real estimate in 60 seconds. Final pricing always includes permits, pilot cars (if needed), and full insurance — no hidden fees.'],
    ['q' => 'Are my loads fully insured?', 'a' => 'Yes. Every shipment is covered by $1,000,000 in cargo insurance and $1,000,000 in liability coverage. We can provide certificates of insurance for your project or jobsite within 15 minutes of booking.'],
    ['q' => 'How fast can you pick up my equipment?', 'a' => "Standard pickups happen within 24–48 hours. Urgent and same-day dispatch is available — we have 12,000+ vetted carriers across all 50 states, so there's almost always a rig within a few hours of your pickup location."],
    ['q' => 'Do you handle permits and pilot cars?', 'a' => "Yes — we handle all oversize/overweight permits, route surveys, and pilot car coordination for every state on your route. You don't lift a finger. Permit costs are included in your quote."],
    ['q' => 'What if my equipment is damaged in transit?', 'a' => 'Damage during transit is extremely rare with our vetted carrier network, but if it ever happens, our $1M cargo insurance covers repairs. We document load condition with photos at pickup and delivery, and our claims team responds within 24 hours.'],
    ['q' => 'Can I cancel or reschedule my shipment?', 'a' => "Yes. You can reschedule for free up to 24 hours before pickup. Cancellations more than 24 hours out are 100% refunded. Inside 24 hours, a small dispatch fee may apply to cover the carrier's reserved time."],
    ['q' => 'Do you ship to Canada and Mexico?', 'a' => "Yes. We're licensed for cross-border heavy haul into Canada and Mexico, including all customs brokerage, FAST/CTPAT clearance, and bilingual coordination."],
    ['q' => 'What types of equipment can you haul?', 'a' => 'Construction equipment (excavators, dozers, cranes), agricultural machinery (combines, tractors), industrial equipment (CNC, generators), heavy-duty trucks (semis, dump trucks), and superloads up to 250,000+ lbs. If it fits on a lowboy, RGN, step deck, or specialized trailer — we move it.'],
];
$FAQ = $FAQ_STATIC;
foreach ($FAQ_DEFAULTS as $i => $f) {
    $n = $i + 1;
    $FAQ["q{$n}"] = $f['q'];
    $FAQ["a{$n}"] = $f['a'];
}

/* ────────────────────────────────────────────────────────────────────────
 * front-page.php Guarantees — page key "guarantees"
 * ──────────────────────────────────────────────────────────────────────── */
$GUARANTEES = [
    'g1_title' => 'On-Time Pickup',
    'g1_sub' => 'Guaranteed Schedule',
    'g2_title' => 'Price-Match Promise',
    'g2_sub' => 'Beat Any Valid Quote',
    'g3_title' => '$1M Cargo Insurance',
    'g3_sub' => 'Full Load Coverage',
    'g4_title' => 'Vetted Carriers Only',
    'g4_sub' => 'Elite Network',
    'heading_1' => 'Heavy Haul Group',
    'heading_2' => 'Guarantee',
];

/* ────────────────────────────────────────────────────────────────────────
 * page-services.php — page key "services"
 * ──────────────────────────────────────────────────────────────────────── */
$SERVICES = [
    'hero_eyebrow' => 'Services',
    'hero_title_1' => 'Heavy Haul',
    'hero_title_2' => 'Service Catalog',
    'hero_subtitle' => 'Browse every service we offer — from construction iron to cross-border freight. Click any card for trailers, brands, and instant rates.',
    'hero_cta_quote' => 'Get Free Quote',
    'featured_eyebrow' => 'Featured Service',
    'featured_badge' => 'Popular',
    'featured_title' => 'Tractor Shipping Services',
    'featured_desc' => 'Compact, utility, row-crop, high-horsepower, and articulated 4WD tractors hauled nationwide on the right trailer for the job. John Deere, Case IH, Kubota, New Holland & more.',
    'featured_cta' => 'View Tractor Shipping Details',
];

/* ────────────────────────────────────────────────────────────────────────
 * page-about.php — page key "about". Static singles first, then the
 * repeated "chapter" data (inside_issue/trust_strip/trust_cards/values/
 * team/trailers/promise_list), replicated exactly from page-about.php's own
 * hardcoded arrays so block_keys line up 1:1 with what hh_ec() reads there.
 * ──────────────────────────────────────────────────────────────────────── */
$ABOUT_STATIC = [
    'masthead_left' => 'Heavy Haul Group · The Magazine',
    'masthead_center' => 'Issue No. 01 · 2026',
    'masthead_right' => 'Vol. XVIII · Nationwide Edition',

    'cover_eyebrow' => 'Cover Feature · About Us',
    'cover_title_1' => 'Honest.',
    'cover_title_2' => 'Dependable.',
    'cover_title_3' => 'Customer-First.',
    'cover_subtitle' => 'A nationwide heavy haul network moving oversize loads, construction equipment, agricultural machinery, industrial freight, and heavy duty trucks across all 50 states.',
    'cover_aside_heading' => 'Inside This Issue',
    'cover_phone_label' => '24/7 Direct Line',
    // 'cover_phone_number' intentionally omitted — dynamic fallback, see file header note.

    'ch1_kicker' => 'Our Story',
    'ch1_num' => '01',
    'ch1_title' => 'Built On Trust. Forged In Iron. Driven By People.',
    'ch1_intro' => 'A heavy haul transport company built around customer trust — with a dispatch floor that picks up on the second ring, any hour of the day.',
    'ch1_p1' => "We're a heavy haul transport company built around customer trust. We listen to your specific shipping needs and take our expertise and professionalism to the next level — giving you the best transportation experience on the road.",
    'ch1_p2' => "Whether it's a farming & agriculture vehicle, industrial machinery, vocational freight, a full truck fleet or any oversize cargo — Heavy Haul Group can and will get it where it needs to be. Fill out our free estimate form or call us anytime, day or night.",
    'ch1_p3' => 'We started with one dispatcher and one phone line in 2008. Today our 50-state network moves thousands of loads a year for equipment dealers, auction buyers, OEM plants, contractors, and farmers — but the rule hasn\'t changed: one dispatcher owns your load, end to end.',
    'ch1_p4' => 'No call-center hand-offs. No mystery surcharges at delivery. Just iron moved right, on time, every time.',
    'ch1_quote' => '"If it rolls, tracks, lifts, drills or hauls — we\'ll get it where it needs to be."',
    'ch1_quote_attr' => '— The Dispatch Floor',
    'ch1_cover_eyebrow' => 'Cover Story',
    'ch1_cover_title' => 'Heavy Iron, Moved Right',
    'ch1_fig_fleet' => 'Fleet',
    'ch1_fig_oversize' => 'Oversize',
    'ch1_rating_score' => '4.9 / 5',
    'ch1_rating_meta' => ' · 2,400+ verified loads',

    'trust_eyebrow' => 'Sidebar · Why Shippers Trust Us',
    'trust_title_1' => 'By The ',
    'trust_title_2' => 'Numbers',
    'trust_meta' => 'Verified · Licensed · Insured',

    'ch2_kicker' => 'The Code We Run By',
    'ch2_chapter' => 'Chapter 02 · Mission & Values',
    'ch2_title_1' => 'Move Heavy.',
    'ch2_title_2' => 'Move Right.',
    'ch2_intro' => 'Get heavy iron from point A to point B safely, legally, and on time — while treating every shipper like our most important customer. We earn trust load by load.',
    'ch2_quote' => '"Your load is our reputation. We don\'t ship anything we wouldn\'t sign our name to."',
    'ch2_quote_attr' => '— Mike Reilly, Senior Dispatcher',
    'ch2_principles_label' => 'Four Guiding Principles',

    'ch3_kicker' => 'Profile',
    'ch3_chapter' => 'Chapter 03 · The Dispatch Floor',
    'ch3_title_1' => 'The People ',
    'ch3_title_2' => 'Behind The Load.',
    'ch3_intro' => 'Real dispatchers, not call-center reps. Each load gets one direct contact — from quote to delivery. Combined, our team has moved heavy iron for more than 47 years.',

    'cta_eyebrow' => 'A Word From Our Dispatch Floor',
    'cta_title_1' => 'Ready To Move',
    'cta_title_2' => 'Heavy Iron?',
    'cta_subtitle' => "Call now or request a no-obligation quote — we'll beat any written rate.",
    // 'cta_call_label' intentionally omitted — dynamic fallback, see file header note.
    'cta_quote_label' => 'Get Free Quote',

    'ch4_kicker' => 'Gallery Feature',
    'ch4_chapter' => 'Chapter 04 · Our Trailers',
    'ch4_title_1' => 'The Trailers ',
    'ch4_title_2' => 'We Use.',
    'ch4_intro' => 'From hot shots to multi-axle super-loads — the right trailer for every job. Owned and partner equipment, always inspected and ready to roll.',

    'ch5_kicker' => 'The Atlas',
    'ch5_chapter' => 'Chapter 05 · States We Serve',
    'ch5_title_1' => 'All 50 States · ',
    'ch5_title_2' => 'Coast To Coast.',
    'ch5_intro' => 'Door-to-door heavy haul coverage in every U.S. state — including Alaska & Hawaii. Local dispatchers, vetted carriers, and permit teams on the ground.',

    'ch6_kicker' => 'From The Editor',
    'ch6_chapter' => 'Chapter 06 · Get In Touch',
    'ch6_title_1' => 'Our Promise:',
    'ch6_title_2' => 'Safety, Speed, Straight Talk.',
    'ch6_intro' => "Every load is treated like it's our own. Our dispatchers don't disappear once a quote is signed — they call you with updates, handle permit paperwork, and make sure your equipment arrives when it's supposed to. No surprises.",
    'ch6_call_label' => 'Call 24/7',
    // 'ch6_call_number' intentionally omitted — dynamic fallback, see file header note.
    'ch6_email_label' => 'Email',
    'ch6_email_addr' => 'dispatch@heavyhaulgroup.com',
    // 'ch6_btn_call' intentionally omitted — dynamic fallback, see file header note.
    'ch6_side_title_1' => 'Why Shippers ',
    'ch6_side_title_2' => 'Stay With Us',
    'ch6_browse_btn' => 'Browse All Services',

    'colophon_left' => 'Heavy Haul Group · The Magazine',
    'colophon_center' => 'End Of Issue · Thank You For Reading',
    'colophon_right' => 'Vol. XVIII · Nationwide Edition',
];

$INSIDE_ISSUE = [
    ['id' => 'io1', 'n' => '01', 'l' => 'Who We Are'],
    ['id' => 'io2', 'n' => '02', 'l' => 'Mission & Values'],
    ['id' => 'io3', 'n' => '03', 'l' => 'The Dispatch Floor'],
    ['id' => 'io4', 'n' => '04', 'l' => 'Our Trailers'],
    ['id' => 'io5', 'n' => '05', 'l' => 'Coast To Coast'],
    ['id' => 'io6', 'n' => '06', 'l' => 'Get In Touch'],
];
$TRUST_STRIP = [
    ['id' => 'ts1', 'top' => '$1,000,000', 'bot' => 'Cargo Insurance'],
    ['id' => 'ts2', 'top' => 'MC & USDOT', 'bot' => 'Fully Authorized'],
    ['id' => 'ts3', 'top' => 'A+ BBB', 'bot' => 'Accredited'],
    ['id' => 'ts4', 'top' => '24 / 7', 'bot' => 'Live Dispatch'],
];
$ABOUT_STATS = [
    ['id' => 'st1', 'v' => '18', 'l' => 'Years on the road'],
    ['id' => 'st2', 'v' => '2,400+', 'l' => 'Verified shippers'],
    ['id' => 'st3', 'v' => '50', 'l' => 'States covered'],
];
$TRUST_CARDS = [
    ['id' => 'tc1', 'title' => 'Fully Insured', 'desc' => '$1M cargo + liability on every single load.'],
    ['id' => 'tc2', 'title' => 'DOT Compliant', 'desc' => 'MC & USDOT authority. Every carrier vetted before dispatch.'],
    ['id' => 'tc3', 'title' => 'Expert Dispatchers', 'desc' => 'Decades of heavy haul experience — answering on the second ring.'],
    ['id' => 'tc4', 'title' => 'Right Trailers', 'desc' => 'Lowboys, RGNs, step decks, multi-axles — always in stock.'],
    ['id' => 'tc5', 'title' => 'All 50 States', 'desc' => 'Coast to coast. Door to door. Port pickups and cross-border too.'],
    ['id' => 'tc6', 'title' => '4.9★ Avg. Rating', 'desc' => 'From 2,400+ verified shippers and equipment dealers.'],
];
$VALUES = [
    ['id' => 'v1', 'title' => 'Honest', 'desc' => 'Straight rates. No bait-and-switch. We quote what we mean.'],
    ['id' => 'v2', 'title' => 'Dependable', 'desc' => 'We show up on time, with the right trailer, every single time.'],
    ['id' => 'v3', 'title' => 'Customer First', 'desc' => "Your load is treated like it's our own — from quote to delivery."],
    ['id' => 'v4', 'title' => 'Accountable', 'desc' => 'One dispatcher owns your load end-to-end. No call-center hand-offs.'],
];
$ABOUT_TEAM = [
    ['id' => 'm1', 'name' => 'Mike Reilly', 'role' => 'Senior Dispatcher', 'years' => '12 yrs', 'quote' => '"Every load is personal."'],
    ['id' => 'm2', 'name' => 'Sarah Coleman', 'role' => 'Permits & Routing', 'years' => '9 yrs', 'quote' => '"Paperwork before pavement."'],
    ['id' => 'm3', 'name' => 'Carlos Alvarez', 'role' => 'Oversize Specialist', 'years' => '15 yrs', 'quote' => '"If it\'s wide, I\'ve moved it."'],
    ['id' => 'm4', 'name' => 'Danny Williams', 'role' => 'Heavy Haul Lead', 'years' => '11 yrs', 'quote' => '"On time. Every time."'],
];
$TRAILERS = [
    ['id' => 't1', 'name' => 'Lowboy / RGN', 'cap' => 'Up to 150,000 lbs', 'desc' => 'Removable goosenecks for dozers, cranes, transformers.'],
    ['id' => 't2', 'name' => 'Step Deck', 'cap' => 'Up to 48,000 lbs', 'desc' => 'Drop deck for tall loads — legal to 10\'2" without permits.'],
    ['id' => 't3', 'name' => 'Flatbed (48\' / 53\')', 'cap' => 'Up to 48,000 lbs', 'desc' => 'Workhorse for machinery, steel, pipe, lumber, building materials.'],
    ['id' => 't4', 'name' => 'Multi-Axle', 'cap' => 'Up to 500,000 lbs', 'desc' => 'Beam, jeep & booster combos for super-loads and heavy iron.'],
    ['id' => 't5', 'name' => 'Stretch / Extendable', 'cap' => 'Up to 80\' long', 'desc' => 'Extendable decks for over-length loads beyond 53 ft.'],
    ['id' => 't6', 'name' => 'Hot Shot / Gooseneck', 'cap' => 'Up to 40,000 lbs', 'desc' => 'Fast, flexible smaller loads — same-day pickup available.'],
];
$PROMISE_LIST = [
    ['id' => 'pl1', 't' => 'One dispatcher per load — no hand-offs, no confusion.'],
    ['id' => 'pl2', 't' => 'Permits & escorts handled in-house for oversize moves.'],
    ['id' => 'pl3', 't' => 'Photo updates at pickup, in-transit checkpoints, and delivery.'],
    ['id' => 'pl4', 't' => 'Bonded for cross-border into Canada and Mexico.'],
    ['id' => 'pl5', 't' => 'Catastrophic & emergency recovery available 24/7.'],
];

$ABOUT = $ABOUT_STATIC;
foreach ($INSIDE_ISSUE as $io) {
    $ABOUT["{$io['id']}_n"] = $io['n'];
    $ABOUT["{$io['id']}_l"] = $io['l'];
}
foreach ($TRUST_STRIP as $ts) {
    $ABOUT["{$ts['id']}_top"] = $ts['top'];
    $ABOUT["{$ts['id']}_bot"] = $ts['bot'];
}
foreach ($ABOUT_STATS as $s) {
    $ABOUT["{$s['id']}_v"] = $s['v'];
    $ABOUT["{$s['id']}_l"] = $s['l'];
}
foreach ($TRUST_CARDS as $tc) {
    $ABOUT["{$tc['id']}_title"] = $tc['title'];
    $ABOUT["{$tc['id']}_desc"] = $tc['desc'];
}
foreach ($VALUES as $v) {
    $ABOUT["{$v['id']}_title"] = $v['title'];
    $ABOUT["{$v['id']}_desc"] = $v['desc'];
}
foreach ($ABOUT_TEAM as $p) {
    $ABOUT["{$p['id']}_years"] = $p['years'];
    $ABOUT["{$p['id']}_quote"] = $p['quote'];
    $ABOUT["{$p['id']}_name"] = $p['name'];
    $ABOUT["{$p['id']}_role"] = $p['role'];
}
foreach ($TRAILERS as $t) {
    $ABOUT["{$t['id']}_cap"] = $t['cap'];
    $ABOUT["{$t['id']}_name"] = $t['name'];
    $ABOUT["{$t['id']}_desc"] = $t['desc'];
}
foreach ($PROMISE_LIST as $pl) {
    $ABOUT[$pl['id']] = $pl['t'];
}

/* ────────────────────────────────────────────────────────────────────────
 * Write every page_key's repeater in one shot.
 * ──────────────────────────────────────────────────────────────────────── */
$PAGES = [
    'header' => $HEADER,
    'footer' => $FOOTER,
    'home' => $HOME,
    'dispatchers' => $DISPATCHERS,
    'faq' => $FAQ,
    'guarantees' => $GUARANTEES,
    'services' => $SERVICES,
    'about' => $ABOUT,
];

$counts = [];
$grand_total = 0;

foreach ($PAGES as $page_key => $content_by_key) {
    $rows = hh_sc_build_rows($content_by_key);
    update_field('items', $rows, "hh_site_content_{$page_key}");

    $count = count($rows);
    $counts[$page_key] = $count;
    $grand_total += $count;

    WP_CLI::log("Wrote {$count} rows to page_key: {$page_key}");
}

/* ────────────────────────────────────────────────────────────────────────
 * Summary
 * ──────────────────────────────────────────────────────────────────────── */
foreach ($counts as $page_key => $count) {
    WP_CLI::log(sprintf('  %-12s %d rows', $page_key, $count));
}
WP_CLI::success(sprintf('Site Content seeded: %d rows across %d page_keys.', $grand_total, count($counts)));
