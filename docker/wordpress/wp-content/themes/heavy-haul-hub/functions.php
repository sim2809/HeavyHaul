<?php
/**
 * Heavy Haul Hub theme bootstrap.
 *
 * ACF field registration itself lives in wp-content/mu-plugins/heavy-haul-acf.php (loads
 * regardless of active theme). This file wires up everything theme-specific: post types,
 * rewrite rules for the virtual category/state and lane pages, nav menus, asset enqueueing,
 * and small render helpers shared by every template.
 */

define('HH_THEME_DIR', get_template_directory());
define('HH_THEME_URI', get_template_directory_uri());

require_once HH_THEME_DIR . '/inc/data/states.php';
require_once HH_THEME_DIR . '/inc/data/cities.php';
require_once HH_THEME_DIR . '/inc/leads.php';
require_once HH_THEME_DIR . '/inc/helpers.php';
require_once HH_THEME_DIR . '/inc/icons.php';
require_once HH_THEME_DIR . '/inc/cpt-service-category.php';
require_once HH_THEME_DIR . '/inc/cpt-service-subcategory.php';
require_once HH_THEME_DIR . '/inc/acf/acf-common.php';
require_once HH_THEME_DIR . '/inc/acf/acf-page-sections.php';
require_once HH_THEME_DIR . '/inc/acf/acf-site-content.php';
require_once HH_THEME_DIR . '/inc/acf/acf-theme-settings.php';
require_once HH_THEME_DIR . '/inc/acf/acf-category-fields.php';
require_once HH_THEME_DIR . '/inc/rewrite-rules.php';
require_once HH_THEME_DIR . '/inc/seo-yoast.php';

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo');
    add_theme_support('automatic-feed-links');

    register_nav_menus([
        'header_primary'  => 'Header Primary',
        'footer_company'  => 'Footer — Company',
        'footer_resources' => 'Footer — Resources',
        'footer_legal'    => 'Footer — Legal',
    ]);
});

add_action('widgets_init', function () {
    register_sidebar([
        'name'          => 'Footer Widgets',
        'id'            => 'footer-widgets',
        'description'   => 'Optional widgets rendered in the footer, in addition to the CMS-driven columns.',
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="stencil text-sm uppercase tracking-wide mb-4">',
        'after_title'   => '</h3>',
    ]);
});

add_action('wp_enqueue_scripts', function () {
    // Same 4 Google Fonts families/weights as the original React app's index.html.
    wp_enqueue_style(
        'hh-google-fonts',
        'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@500;600;700&family=Stardos+Stencil:wght@700&family=Inter:wght@400;500;600;700&display=swap',
        [],
        null
    );

    $css_path = HH_THEME_DIR . '/assets/css/tailwind.css';
    wp_enqueue_style(
        'hh-tailwind',
        HH_THEME_URI . '/assets/css/tailwind.css',
        [],
        file_exists($css_path) ? filemtime($css_path) : '1.0.0'
    );

    $js_path = HH_THEME_DIR . '/assets/js/main.js';
    wp_enqueue_script(
        'hh-main',
        HH_THEME_URI . '/assets/js/main.js',
        [],
        file_exists($js_path) ? filemtime($js_path) : '1.0.0',
        true
    );

    $quote_js_path = HH_THEME_DIR . '/assets/js/quote-forms.js';
    wp_enqueue_script(
        'hh-quote-forms',
        HH_THEME_URI . '/assets/js/quote-forms.js',
        [],
        file_exists($quote_js_path) ? filemtime($quote_js_path) : '1.0.0',
        true
    );

    wp_localize_script('hh-quote-forms', 'hhConfig', [
        'submitLeadUrl' => rest_url('hh/v1/submit-lead'),
    ]);

    if (is_front_page()) {
        $map_js_path = HH_THEME_DIR . '/assets/js/usa-map.js';
        wp_enqueue_script(
            'hh-usa-map',
            HH_THEME_URI . '/assets/js/usa-map.js',
            [],
            file_exists($map_js_path) ? filemtime($map_js_path) : '1.0.0',
            true
        );
    }
});

// Flush rewrite rules whenever this theme is activated, since Phase 7 registers custom
// rewrite rules for the virtual /services/{cat}/state/{state} and /lanes/{slug} routes.
add_action('after_switch_theme', function () {
    flush_rewrite_rules();
});
