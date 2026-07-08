<?php
// ACF field registration lives in wp-content/mu-plugins/heavy-haul-acf.php so the content
// schema is active regardless of which theme is active. This file only needs to register
// the nav menu locations the React frontend actually reads (see src/components/Layout.tsx).
add_action('after_setup_theme', function () {
    register_nav_menus([
        'header_primary' => 'Header Primary',
        'footer_company' => 'Footer — Company',
        'footer_resources' => 'Footer — Resources',
    ]);
});
