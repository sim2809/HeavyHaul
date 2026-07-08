<?php
/**
 * Virtual routes for the pages that don't have one-post-per-URL: category×state pages
 * (/services/{category}/state/{state}/, ~200 combinations from 11 categories × 50 states)
 * and lane pages (/lanes/{slug}, hundreds of city×city combinations from 20 cities).
 * Mirrors exactly how Category.tsx/Lane.tsx compute these client-side from a small static
 * dataset — no per-combination WordPress post is created.
 *
 * Plain category pages (/services/{category}/) and subcategory pages need no special
 * handling beyond what's here either: the `service_category` CPT's own rewrite (registered
 * in inc/cpt-service-category.php) already serves single-segment URLs nativately via
 * single-service_category.php. Only 2-segment /services/{a}/{b}/ URLs (state or
 * subcategory) and /lanes/{slug} need the custom rules below.
 *
 * Convention every virtual-route template can rely on: by the time
 * single-service_category.php / single-service_subcategory.php / template-lane.php is
 * included, $post/setup_postdata() are already set up exactly as they would be for a
 * normal single template (so get_field(), the_title(), get_the_ID() etc. all just work).
 * Extra context lives in these globals:
 *   $GLOBALS['hh_state']            array{slug,name,abbr}|null   — set on category×state routes
 *   $GLOBALS['hh_parent_category']  WP_Post|null                 — set on subcategory routes
 *   $GLOBALS['hh_lane_slug']        string|null                  — set on /lanes/{slug} routes
 */

add_filter('query_vars', function (array $vars): array {
    $vars[] = 'hh_category_slug';
    $vars[] = 'hh_state';
    $vars[] = 'hh_subcategory_slug';
    $vars[] = 'hh_lane_slug';
    return $vars;
});

add_action('init', function () {
    // Most specific first (defensive — regexes don't actually overlap since /state/ is a
    // literal path segment, but 'top' + declaration order keeps intent obvious).
    add_rewrite_rule(
        '^services/([^/]+)/state/([^/]+)/?$',
        'index.php?hh_category_slug=$matches[1]&hh_state=$matches[2]',
        'top'
    );
    add_rewrite_rule(
        '^services/([^/]+)/([^/]+)/?$',
        'index.php?hh_category_slug=$matches[1]&hh_subcategory_slug=$matches[2]',
        'top'
    );
    add_rewrite_rule(
        '^lanes/([^/]+)/?$',
        'index.php?hh_lane_slug=$matches[1]',
        'top'
    );
});

/**
 * Resolves a service_category post by its slug (post_name). Small helper shared by both
 * virtual-route branches below.
 */
function hh_get_category_by_slug(string $slug): ?WP_Post {
    $posts = get_posts([
        'post_type' => 'service_category',
        'name' => $slug,
        'posts_per_page' => 1,
        'post_status' => 'publish',
    ]);
    return $posts[0] ?? null;
}

function hh_get_subcategory_by_slug(string $slug, int $parent_category_id): ?WP_Post {
    $posts = get_posts([
        'post_type' => 'service_subcategory',
        'name' => $slug,
        'posts_per_page' => 1,
        'post_status' => 'publish',
    ]);
    if (empty($posts)) {
        return null;
    }
    $sub = $posts[0];
    $parent_id = (int) get_field('parent_category', $sub->ID);
    return $parent_id === $parent_category_id ? $sub : null;
}

add_filter('template_include', function (string $template): string {
    $lane_slug = get_query_var('hh_lane_slug');
    if ($lane_slug) {
        $GLOBALS['hh_lane_slug'] = $lane_slug;
        $found = locate_template('template-lane.php');
        return $found ?: $template;
    }

    $category_slug = get_query_var('hh_category_slug');
    if (!$category_slug) {
        return $template; // not one of our virtual routes — normal WP routing.
    }

    $category = hh_get_category_by_slug($category_slug);
    if (!$category) {
        global $wp_query;
        $wp_query->set_404();
        status_header(404);
        return get_404_template() ?: $template;
    }

    $state_slug = get_query_var('hh_state');
    if ($state_slug) {
        $state = hh_find_state($state_slug);
        if (!$state) {
            global $wp_query;
            $wp_query->set_404();
            status_header(404);
            return get_404_template() ?: $template;
        }
        hh_setup_virtual_post($category);
        $GLOBALS['hh_state'] = $state;
        $found = locate_template('single-service_category.php');
        return $found ?: $template;
    }

    $subcategory_slug = get_query_var('hh_subcategory_slug');
    if ($subcategory_slug) {
        $subcategory = hh_get_subcategory_by_slug($subcategory_slug, $category->ID);
        if (!$subcategory) {
            global $wp_query;
            $wp_query->set_404();
            status_header(404);
            return get_404_template() ?: $template;
        }
        hh_setup_virtual_post($subcategory);
        $GLOBALS['hh_parent_category'] = $category;
        $found = locate_template('single-service_subcategory.php');
        return $found ?: $template;
    }

    return $template;
});

/** Sets up $post/global query state for a resolved post the same way WP would for a real single view. */
function hh_setup_virtual_post(WP_Post $post): void {
    global $wp_query;
    $GLOBALS['post'] = $post;
    setup_postdata($post);
    $wp_query->is_404 = false;
    $wp_query->is_single = true;
    $wp_query->queried_object = $post;
    $wp_query->queried_object_id = $post->ID;
}
