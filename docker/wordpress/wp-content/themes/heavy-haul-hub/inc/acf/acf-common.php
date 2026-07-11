<?php
/**
 * Shared ACF field-building helpers, reused by acf-page-sections.php, acf-site-content.php,
 * acf-theme-settings.php, and acf-category-fields.php. Ported from the old
 * docker/wordpress/wp-content/mu-plugins/heavy-haul-acf.php (headless-era file) with all
 * show_in_graphql/graphql_field_name/graphql_types args stripped — this theme renders via
 * PHP templates + get_field(), not GraphQL.
 */

// Pure array builders, safe to define even if ACF (PRO) isn't active yet — the files that
// actually call acf_add_local_field_group()/acf_add_options_page() each guard themselves.

function hh_style_subfields(string $key_prefix): array {
    return [
        [
            'key' => "field_{$key_prefix}_style",
            'name' => 'style',
            'label' => 'Style',
            'type' => 'group',
            'sub_fields' => [
                ['key' => "field_{$key_prefix}_style_color", 'name' => 'color', 'label' => 'Text Color', 'type' => 'color_picker'],
                ['key' => "field_{$key_prefix}_style_bg", 'name' => 'background_color', 'label' => 'Background Color', 'type' => 'color_picker'],
                ['key' => "field_{$key_prefix}_style_font_size", 'name' => 'font_size', 'label' => 'Font Size', 'type' => 'text', 'instructions' => 'e.g. 16px or 1.25rem'],
                [
                    'key' => "field_{$key_prefix}_style_font_weight", 'name' => 'font_weight', 'label' => 'Font Weight', 'type' => 'select',
                    'choices' => ['400' => '400', '500' => '500', '600' => '600', '700' => '700', '800' => '800', '900' => '900'],
                    'allow_null' => 1,
                ],
                [
                    'key' => "field_{$key_prefix}_style_font_family", 'name' => 'font_family', 'label' => 'Font Family', 'type' => 'select',
                    'choices' => [
                        'Inter' => 'Inter',
                        'Anton' => 'Anton',
                        'Oswald' => 'Oswald',
                        'System UI' => 'System UI',
                    ],
                    'allow_null' => 1,
                ],
                [
                    'key' => "field_{$key_prefix}_style_text_align", 'name' => 'text_align', 'label' => 'Text Align', 'type' => 'select',
                    'choices' => ['left' => 'Left', 'center' => 'Center', 'right' => 'Right', 'justify' => 'Justify'],
                    'allow_null' => 1,
                ],
                ['key' => "field_{$key_prefix}_style_letter_spacing", 'name' => 'letter_spacing', 'label' => 'Letter Spacing', 'type' => 'text'],
                ['key' => "field_{$key_prefix}_style_line_height", 'name' => 'line_height', 'label' => 'Line Height', 'type' => 'text'],
            ],
        ],
    ];
}

function hh_common_subfields(string $key_prefix): array {
    return array_merge(
        [
            ['key' => "field_{$key_prefix}_enabled", 'name' => 'enabled', 'label' => 'Enabled', 'type' => 'true_false', 'default_value' => 1, 'ui' => 1],
        ],
        hh_style_subfields($key_prefix)
    );
}

/**
 * $name defaults to 'items' (its original hardcoded value, still correct for callers like
 * acf-site-content.php where each repeater is the only field on its own dedicated options
 * page). Pass an explicit $name whenever a post/options page has more than one repeater
 * built with this helper — it becomes the actual postmeta key ACF stores rows under, so
 * siblings sharing the default would silently collide (last-saved-wins). This bit
 * service_category (pillars/steps/stats/faqs/service_gallery all on one post) and Theme
 * Settings (hours/ads_conversions both on the one global options page).
 */
function hh_items_repeater(string $key_prefix, string $label, array $sub_fields, string $name = 'items'): array {
    return [
        'key' => "field_{$key_prefix}_items",
        'name' => $name,
        'label' => $label,
        'type' => 'repeater',
        'layout' => 'block',
        'button_label' => 'Add item',
        'sub_fields' => $sub_fields,
    ];
}
