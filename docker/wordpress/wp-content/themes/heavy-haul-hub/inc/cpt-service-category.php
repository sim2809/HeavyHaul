<?php
/**
 * `service_category` CPT — the 11 real posts backing src/data/categories.ts's `categories`
 * array (4 "freight" categories rendered like Category.tsx, 7 "service" categories rendered
 * like ServiceDetail.tsx). Category × state combinations are virtual (inc/rewrite-rules.php),
 * NOT additional posts.
 */
add_action('init', function () {
    register_post_type('service_category', [
        'labels' => [
            'name'          => 'Service Categories',
            'singular_name' => 'Service Category',
            'add_new_item'  => 'Add New Service Category',
            'edit_item'     => 'Edit Service Category',
            'menu_name'     => 'Service Categories',
        ],
        'public'       => true,
        'has_archive'  => false, // the real "Services Index" is a Page (page-services.php), not a CPT archive
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-truck',
        'supports'     => ['title', 'thumbnail'],
        'rewrite'      => ['slug' => 'services', 'with_front' => false],
    ]);
});
