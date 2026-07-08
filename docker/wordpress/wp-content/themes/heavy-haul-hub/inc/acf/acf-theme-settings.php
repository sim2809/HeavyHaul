<?php
/**
 * "Theme Settings" options page — company info, social, hours, footer/SEO defaults,
 * analytics. Replaces Supabase's global_settings + analytics_settings tables and mirrors
 * useSiteSettings.tsx's shape exactly. Single global bucket (default ACF "options" post_id
 * is fine here — there's only one Theme Settings page, no collision risk like the
 * per-page-key Site Content options pages).
 */

if (function_exists('acf_add_local_field_group')) {
    acf_add_options_page([
        'page_title' => 'Theme Settings',
        'menu_title' => 'Theme Settings',
        'menu_slug' => 'acf-options-theme-settings',
        'capability' => 'manage_options',
        'position' => 4,
        'icon_url' => 'dashicons-admin-generic',
    ]);

    acf_add_local_field_group([
        'key' => 'group_hh_theme_settings',
        'title' => 'Theme Settings',
        'fields' => [
            ['key' => 'field_hh_ts_tab_company', 'label' => 'Company', 'type' => 'tab'],
            ['key' => 'field_hh_ts_company_name', 'name' => 'company_name', 'label' => 'Company Name', 'type' => 'text'],
            ['key' => 'field_hh_ts_logo_url', 'name' => 'logo_url', 'label' => 'Logo', 'type' => 'image', 'return_format' => 'array'],
            ['key' => 'field_hh_ts_phone_primary', 'name' => 'phone_primary', 'label' => 'Primary Phone', 'type' => 'text'],
            ['key' => 'field_hh_ts_phone_primary_display', 'name' => 'phone_primary_display', 'label' => 'Primary Phone (display format)', 'type' => 'text', 'instructions' => 'e.g. (800) 555-0199'],
            ['key' => 'field_hh_ts_phone_secondary', 'name' => 'phone_secondary', 'label' => 'Secondary Phone', 'type' => 'text'],
            ['key' => 'field_hh_ts_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email'],
            ['key' => 'field_hh_ts_address', 'name' => 'address', 'label' => 'Address', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_site_url', 'name' => 'site_url', 'label' => 'Site URL', 'type' => 'url'],

            ['key' => 'field_hh_ts_tab_social', 'label' => 'Social & Hours', 'type' => 'tab'],
            ['key' => 'field_hh_ts_social_facebook', 'name' => 'social_facebook', 'label' => 'Facebook URL', 'type' => 'url'],
            ['key' => 'field_hh_ts_social_instagram', 'name' => 'social_instagram', 'label' => 'Instagram URL', 'type' => 'url'],
            ['key' => 'field_hh_ts_social_x', 'name' => 'social_x', 'label' => 'X / Twitter URL', 'type' => 'url'],
            ['key' => 'field_hh_ts_social_linkedin', 'name' => 'social_linkedin', 'label' => 'LinkedIn URL', 'type' => 'url'],
            ['key' => 'field_hh_ts_social_youtube', 'name' => 'social_youtube', 'label' => 'YouTube URL', 'type' => 'url'],
            hh_items_repeater('hh_ts_hours', 'Business Hours', [
                ['key' => 'field_hh_ts_hours_day', 'name' => 'day', 'label' => 'Day(s)', 'type' => 'text'],
                ['key' => 'field_hh_ts_hours_hours', 'name' => 'hours', 'label' => 'Hours', 'type' => 'text'],
            ]),

            ['key' => 'field_hh_ts_tab_footer', 'label' => 'Footer & SEO Defaults', 'type' => 'tab'],
            ['key' => 'field_hh_ts_footer_content', 'name' => 'footer_content', 'label' => 'Footer Content', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_copyright_text', 'name' => 'copyright_text', 'label' => 'Copyright Text', 'type' => 'text'],
            ['key' => 'field_hh_ts_robots_txt', 'name' => 'robots_txt', 'label' => 'robots.txt Override', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_default_meta_title', 'name' => 'default_meta_title', 'label' => 'Default Meta Title', 'type' => 'text'],
            ['key' => 'field_hh_ts_default_meta_description', 'name' => 'default_meta_description', 'label' => 'Default Meta Description', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_default_og_image', 'name' => 'default_og_image', 'label' => 'Default OG Image', 'type' => 'image', 'return_format' => 'array'],

            ['key' => 'field_hh_ts_tab_analytics', 'label' => 'Analytics', 'type' => 'tab'],
            ['key' => 'field_hh_ts_gtm_id', 'name' => 'gtm_id', 'label' => 'Google Tag Manager ID', 'type' => 'text'],
            ['key' => 'field_hh_ts_ga_id', 'name' => 'ga_id', 'label' => 'Google Analytics ID', 'type' => 'text'],
            ['key' => 'field_hh_ts_meta_pixel_id', 'name' => 'meta_pixel_id', 'label' => 'Meta Pixel ID', 'type' => 'text'],
            ['key' => 'field_hh_ts_google_ads_remarketing_tag', 'name' => 'google_ads_remarketing_tag', 'label' => 'Google Ads Remarketing Tag', 'type' => 'textarea'],
            hh_items_repeater('hh_ts_ads_conversions', 'Google Ads Conversion IDs', [
                ['key' => 'field_hh_ts_ads_conversion_id', 'name' => 'conversion_id', 'label' => 'Conversion ID', 'type' => 'text'],
            ]),
            ['key' => 'field_hh_ts_call_tracking_script', 'name' => 'call_tracking_script', 'label' => 'Call Tracking Script', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_custom_header_scripts', 'name' => 'custom_header_scripts', 'label' => 'Custom Header Scripts', 'type' => 'textarea'],
            ['key' => 'field_hh_ts_custom_footer_scripts', 'name' => 'custom_footer_scripts', 'label' => 'Custom Footer Scripts', 'type' => 'textarea'],
        ],
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-theme-settings']]],
    ]);
}

/**
 * PHP equivalent of useSiteSettings.tsx — merges Theme Settings fields with the same
 * fallback defaults the React app used before WP data loaded.
 */
function hh_settings(): array {
    static $settings = null;
    if ($settings !== null) {
        return $settings;
    }

    $fallback = [
        'company_name' => 'Heavy Haul Group',
        'phone_primary' => '+18005550199',
        'phone_primary_display' => '(800) 555-0199',
        'phone_secondary' => '',
        'email' => 'dispatch@heavyhaulgroup.com',
        'address' => '',
        'logo_url' => null,
        'social_facebook' => '', 'social_instagram' => '', 'social_x' => '', 'social_linkedin' => '', 'social_youtube' => '',
        'footer_content' => "America's trusted heavy haul carrier network, moving oversize equipment nationwide since day one.",
        'copyright_text' => '© ' . date('Y') . ' Heavy Haul Group. All rights reserved.',
    ];

    if (!function_exists('get_field')) {
        $settings = $fallback;
        return $settings;
    }

    $fields = get_fields('option') ?: [];
    $settings = array_merge($fallback, array_filter($fields, fn($v) => $v !== null && $v !== ''));
    return $settings;
}

function hh_setting(string $key, $fallback = '') {
    $settings = hh_settings();
    $value = $settings[$key] ?? null;
    return ($value !== null && $value !== '') ? $value : $fallback;
}
