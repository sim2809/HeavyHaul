<?php
/**
 * `service_subcategory` CPT — the 40 real posts backing each category's `subcategories[]`
 * array (SubCategory.tsx), linked to a parent `service_category` post via the `parent_category`
 * ACF field (see inc/theme-settings.php's field-group registration, Phase 3).
 *
 * Rewrite is disabled here on purpose: the real URL is /services/{category-slug}/{subcategory-slug}/,
 * which needs both segments resolved together — that's handled by a custom rewrite rule in
 * inc/rewrite-rules.php (Phase 7), not this CPT's default (flat) rewrite base.
 */
add_action('init', function () {
    register_post_type('service_subcategory', [
        'labels' => [
            'name'          => 'Service Subcategories',
            'singular_name' => 'Service Subcategory',
            'add_new_item'  => 'Add New Subcategory',
            'edit_item'     => 'Edit Subcategory',
            'menu_name'     => 'Subcategories',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-category',
        'supports'     => ['title'],
        'rewrite'      => false,
        'query_var'    => 'service_subcategory',
    ]);
});
