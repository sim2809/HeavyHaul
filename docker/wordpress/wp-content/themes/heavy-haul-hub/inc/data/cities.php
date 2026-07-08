<?php
/**
 * Fixed cities + curated popular-lane pairs — NOT WordPress content, ported verbatim from
 * src/data/categories.ts's `cities`/`popularLanes` arrays. Drives the virtual /lanes/{slug}
 * pages (see inc/rewrite-rules.php and template-lane.php).
 */

function hh_cities(): array {
    static $cities = null;
    if ($cities === null) {
        $cities = [
            ['slug' => 'new-york', 'name' => 'New York', 'state' => 'NY'],
            ['slug' => 'los-angeles', 'name' => 'Los Angeles', 'state' => 'CA'],
            ['slug' => 'chicago', 'name' => 'Chicago', 'state' => 'IL'],
            ['slug' => 'houston', 'name' => 'Houston', 'state' => 'TX'],
            ['slug' => 'dallas', 'name' => 'Dallas', 'state' => 'TX'],
            ['slug' => 'phoenix', 'name' => 'Phoenix', 'state' => 'AZ'],
            ['slug' => 'philadelphia', 'name' => 'Philadelphia', 'state' => 'PA'],
            ['slug' => 'san-antonio', 'name' => 'San Antonio', 'state' => 'TX'],
            ['slug' => 'san-diego', 'name' => 'San Diego', 'state' => 'CA'],
            ['slug' => 'miami', 'name' => 'Miami', 'state' => 'FL'],
            ['slug' => 'atlanta', 'name' => 'Atlanta', 'state' => 'GA'],
            ['slug' => 'denver', 'name' => 'Denver', 'state' => 'CO'],
            ['slug' => 'seattle', 'name' => 'Seattle', 'state' => 'WA'],
            ['slug' => 'boston', 'name' => 'Boston', 'state' => 'MA'],
            ['slug' => 'detroit', 'name' => 'Detroit', 'state' => 'MI'],
            ['slug' => 'minneapolis', 'name' => 'Minneapolis', 'state' => 'MN'],
            ['slug' => 'charlotte', 'name' => 'Charlotte', 'state' => 'NC'],
            ['slug' => 'nashville', 'name' => 'Nashville', 'state' => 'TN'],
            ['slug' => 'kansas-city', 'name' => 'Kansas City', 'state' => 'MO'],
            ['slug' => 'las-vegas', 'name' => 'Las Vegas', 'state' => 'NV'],
        ];
    }
    return $cities;
}

function hh_find_city(string $slug): ?array {
    foreach (hh_cities() as $city) {
        if ($city['slug'] === $slug) {
            return $city;
        }
    }
    return null;
}

function hh_popular_lanes(): array {
    return [
        ['new-york', 'dallas'],
        ['los-angeles', 'houston'],
        ['chicago', 'atlanta'],
        ['dallas', 'denver'],
        ['miami', 'new-york'],
        ['houston', 'phoenix'],
        ['seattle', 'chicago'],
        ['atlanta', 'los-angeles'],
        ['denver', 'kansas-city'],
        ['philadelphia', 'miami'],
        ['detroit', 'nashville'],
        ['charlotte', 'boston'],
    ];
}

/**
 * Deterministic pseudo-random transit estimate — ported exactly from Lane.tsx's
 * estimateTransit() for parity with the original React app (not real distance data):
 *   const sum = (s) => sum of charCodeAt(0) for every char in s
 *   days = 2 + (abs(sum(a) - sum(b)) % 5)
 *   miles = 400 + ((sum(a + b) * 7) % 2200)
 * Slugs are plain ASCII (lowercase + hyphens) so PHP ord() matches JS charCodeAt() exactly.
 */
function hh_char_code_sum(string $s): int {
    $sum = 0;
    $len = strlen($s);
    for ($i = 0; $i < $len; $i++) {
        $sum += ord($s[$i]);
    }
    return $sum;
}

function hh_estimate_transit(string $a, string $b): array {
    $sumA = hh_char_code_sum($a);
    $sumB = hh_char_code_sum($b);

    $days = 2 + (abs($sumA - $sumB) % 5);
    $miles = 400 + ((($sumA + $sumB) * 7) % 2200);

    return ['days' => $days, 'miles' => $miles];
}
