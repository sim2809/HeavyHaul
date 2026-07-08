<?php
/**
 * Yoast SEO integration for the virtual (non-post-backed) category×state and lane pages.
 * Real posts (service_category, service_subcategory, page, post) get Yoast's normal
 * metabox/front-end output automatically once Yoast is active — the only thing that needs
 * a one-time manual step is enabling SEO fields for the two custom post types:
 *   wp-admin → Yoast SEO → Settings → Content Types → turn on "SEO settings" for
 *   "Service Categories" and "Service Subcategories" (public CPTs aren't always
 *   auto-enabled there depending on Yoast version).
 *
 * Virtual pages have no post to hang a metabox on, so their title/description/canonical
 * are generated here from the same template strings the original React <SEO> component
 * used per route — this is exactly how programmatic SEO pages work (titles are templated,
 * not hand-authored per page, in both the old and new version).
 */

add_filter('wpseo_frontend_presentation', function ($presentation) {
    if (!empty($GLOBALS['hh_state']) && is_singular('service_category')) {
        $state = $GLOBALS['hh_state'];
        $category = get_queried_object() instanceof WP_Post ? get_queried_object() : $GLOBALS['post'];
        $cat_name = $category ? get_the_title($category) : '';
        $short = $category ? (get_field('short', $category->ID) ?: $cat_name) : '';
        $slug = $category ? $category->post_name : '';

        $presentation->title = sprintf('%s Shipping in %s | Heavy Haul Group', $short, $state['name']);
        $presentation->meta_description = sprintf(
            '%s transport and heavy haul shipping in %s. Fully insured, DOT compliant, same-day quotes. Call now for fast equipment shipping.',
            $short,
            $state['name']
        );
        $presentation->canonical = home_url("/services/{$slug}/state/{$state['slug']}/");
    }

    if (!empty($GLOBALS['hh_lane_slug'])) {
        $lane_slug = $GLOBALS['hh_lane_slug'];
        $from_slug = null;
        $to_slug = null;
        if (strpos($lane_slug, 'from-') === 0) {
            $from_slug = substr($lane_slug, 5);
        } elseif (preg_match('/^(.+)-to-(.+)$/', $lane_slug, $m)) {
            $from_slug = $m[1];
            $to_slug = $m[2];
        }
        $from = $from_slug ? hh_find_city($from_slug) : null;
        $to = $to_slug ? hh_find_city($to_slug) : null;

        if ($from && !$to) {
            $presentation->title = sprintf('Heavy Haul From %s, %s | Outbound Lanes', $from['name'], $from['state']);
            $presentation->meta_description = sprintf(
                'Heavy haul and oversize load transport from %s, %s to anywhere in the USA. Same-day dispatch. Get a free quote now.',
                $from['name'],
                $from['state']
            );
            $presentation->canonical = home_url("/lanes/from-{$from['slug']}/");
        } elseif ($from && $to) {
            $transit = hh_estimate_transit($from['slug'], $to['slug']);
            $presentation->title = sprintf('Heavy Haul %s, %s to %s, %s | Free Quote', $from['name'], $from['state'], $to['name'], $to['state']);
            $presentation->meta_description = sprintf(
                'Oversize load and heavy equipment transport from %s to %s. Approx. %d miles · %d-%d day transit. Same-day dispatch.',
                $from['name'], $to['name'], $transit['miles'], $transit['days'], $transit['days'] + 1
            );
            $presentation->canonical = home_url("/lanes/{$from['slug']}-to-{$to['slug']}/");
        }
    }

    return $presentation;
});

/* -----------------------------------------------------------------------
 * Sitemap coverage for virtual pages — Yoast's default sitemap only walks real posts, so
 * the ~200 category×state and ~400 lane URLs need their own sitemap files, referenced from
 * Yoast's main sitemap index.
 * --------------------------------------------------------------------- */

add_action('init', function () {
    add_rewrite_rule('^category-state-sitemap\.xml$', 'index.php?hh_sitemap=category-state', 'top');
    add_rewrite_rule('^lanes-sitemap\.xml$', 'index.php?hh_sitemap=lanes', 'top');
});

add_filter('query_vars', function (array $vars): array {
    $vars[] = 'hh_sitemap';
    return $vars;
});

add_filter('wpseo_sitemap_index', function (string $sitemap_index): string {
    $entries = sprintf(
        '<sitemap><loc>%s</loc></sitemap><sitemap><loc>%s</loc></sitemap>',
        esc_url(home_url('/category-state-sitemap.xml')),
        esc_url(home_url('/lanes-sitemap.xml'))
    );
    return $sitemap_index . $entries;
});

add_action('template_redirect', function () {
    $which = get_query_var('hh_sitemap');
    if (!$which) {
        return;
    }

    header('Content-Type: application/xml; charset=UTF-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    if ($which === 'category-state') {
        $freight_categories = get_posts([
            'post_type' => 'service_category',
            'posts_per_page' => -1,
            'meta_query' => [['key' => 'template_type', 'value' => 'freight']],
        ]);
        foreach ($freight_categories as $category) {
            foreach (hh_states() as $state) {
                printf(
                    '<url><loc>%s</loc></url>',
                    esc_url(home_url("/services/{$category->post_name}/state/{$state['slug']}/"))
                );
            }
        }
    } elseif ($which === 'lanes') {
        $cities = hh_cities();
        foreach ($cities as $city) {
            printf('<url><loc>%s</loc></url>', esc_url(home_url("/lanes/from-{$city['slug']}/")));
            foreach ($cities as $other) {
                if ($other['slug'] === $city['slug']) {
                    continue;
                }
                printf('<url><loc>%s</loc></url>', esc_url(home_url("/lanes/{$city['slug']}-to-{$other['slug']}/")));
            }
        }
    }

    echo '</urlset>';
    exit;
});
