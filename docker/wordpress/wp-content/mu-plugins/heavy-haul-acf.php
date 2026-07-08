<?php
/**
 * Heavy Haul Hub — ACF content schema, registered as code so it's git-tracked and
 * reproducible by anyone running `docker compose up` + bootstrap.sh, instead of being
 * hand-clicked together in the ACF Field Group UI.
 *
 * Requires ACF PRO (Flexible Content, Repeater, Options Page field types are PRO-only).
 * If ACF PRO isn't active yet, these acf_add_local_* calls are simply no-ops — WordPress
 * still boots fine, the fields just won't appear until ACF PRO is installed.
 *
 * Two content models, matching the two systems that existed in the old Supabase CMS:
 *
 * 1. Flexible Content "page_sections" field on the native `page` post type — one layout
 *    per section type from src/components/admin/SectionEditors.tsx (SECTION_DEFAULTS).
 *    This replaces the `pages` + `page_sections` tables.
 *
 * 2. A generic key/value repeater per "page_key" Options Page, replacing the flat
 *    `site_content` table. Deliberately NOT one named ACF field per block_key: the
 *    consuming React components (Index.tsx, About.tsx, etc.) reference well over 150
 *    block_keys total, many built from dynamic ids at render time (see About.tsx's
 *    `${io.id}_n` / `${s.id}_v` / `${p.id}_name` patterns) — hand-naming every one as a
 *    distinct ACF field would be a huge, brittle enumeration exercise for no real benefit,
 *    since the React side just wants a flat `page_key.block_key -> content` map either way.
 *    A repeater of {block_key, content, style} rows preserves 100% of the old data shape,
 *    survives new/renamed block_keys without a PHP change, and is still edited entirely
 *    inside wp-admin (each row shows its block_key so editors know what they're changing).
 */

if (!function_exists('acf_add_local_field_group')) {
    return; // ACF (PRO) not active yet.
}

/**
 * Shared per-block style sub-fields, matching BlockStyle in
 * src/components/admin/BlockStylePanel.tsx. Returned as a fresh array (with a unique
 * field key per caller) rather than a true ACF "clone" field, to keep this file simple —
 * clones require registering and referencing a separate field group first.
 */
/**
 * Per-section "enabled" toggle + style, merged into every flexible content layout —
 * replaces the old page_sections.enabled column (hide a section without deleting it).
 */
function hh_common_subfields(string $key_prefix): array {
    return array_merge(
        [
            ['key' => "field_{$key_prefix}_enabled", 'name' => 'enabled', 'label' => 'Enabled', 'type' => 'true_false', 'default_value' => 1, 'ui' => 1],
        ],
        hh_style_subfields($key_prefix)
    );
}

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
                        'Bebas Neue' => 'Bebas Neue',
                        'Playfair Display' => 'Playfair Display',
                        'Roboto Mono' => 'Roboto Mono',
                        'Georgia' => 'Georgia',
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

function hh_items_repeater(string $key_prefix, string $label, array $sub_fields): array {
    return [
        'key' => "field_{$key_prefix}_items",
        'name' => 'items',
        'label' => $label,
        'type' => 'repeater',
        'layout' => 'block',
        'button_label' => 'Add item',
        'sub_fields' => $sub_fields,
    ];
}

/* -----------------------------------------------------------------------
 * 1. Flexible Content "page_sections" on the native `page` post type
 * --------------------------------------------------------------------- */

acf_add_local_field_group([
    'key' => 'group_hh_page_sections',
    'title' => 'Page Sections',
    'show_in_graphql' => 1,
    'graphql_field_name' => 'pageSections',
    'graphql_types' => ['Page'],
    'fields' => [
        [
            'key' => 'field_hh_page_sections',
            'name' => 'page_sections',
            'label' => 'Sections',
            'type' => 'flexible_content',
            'button_label' => 'Add section',
            'show_in_graphql' => 1,
            'graphql_field_name' => 'sections',
            'layouts' => [
                'layout_hh_hero' => [
                    'key' => 'layout_hh_hero', 'name' => 'hero', 'label' => 'Hero / Banner', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_hero_eyebrow', 'name' => 'eyebrow', 'label' => 'Eyebrow', 'type' => 'text'],
                        ['key' => 'field_hh_hero_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text', 'required' => 1],
                        ['key' => 'field_hh_hero_subheadline', 'name' => 'subheadline', 'label' => 'Subheadline', 'type' => 'textarea'],
                        ['key' => 'field_hh_hero_cta_label', 'name' => 'cta_label', 'label' => 'CTA Label', 'type' => 'text'],
                        ['key' => 'field_hh_hero_cta_href', 'name' => 'cta_href', 'label' => 'CTA Link', 'type' => 'text'],
                        ['key' => 'field_hh_hero_image', 'name' => 'image', 'label' => 'Background Image', 'type' => 'image', 'return_format' => 'array'],
                    ], hh_common_subfields('hh_hero')),
                ],
                'layout_hh_cta' => [
                    'key' => 'layout_hh_cta', 'name' => 'cta', 'label' => 'Call To Action', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_cta_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text', 'required' => 1],
                        ['key' => 'field_hh_cta_subheadline', 'name' => 'subheadline', 'label' => 'Subheadline', 'type' => 'textarea'],
                        ['key' => 'field_hh_cta_cta_label', 'name' => 'cta_label', 'label' => 'CTA Label', 'type' => 'text'],
                        ['key' => 'field_hh_cta_cta_href', 'name' => 'cta_href', 'label' => 'CTA Link', 'type' => 'text'],
                    ], hh_common_subfields('hh_cta')),
                ],
                'layout_hh_faq' => [
                    'key' => 'layout_hh_faq', 'name' => 'faq', 'label' => 'FAQ', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_faq_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text'],
                        hh_items_repeater('hh_faq', 'Questions', [
                            ['key' => 'field_hh_faq_item_q', 'name' => 'q', 'label' => 'Question', 'type' => 'text'],
                            ['key' => 'field_hh_faq_item_a', 'name' => 'a', 'label' => 'Answer', 'type' => 'textarea'],
                        ]),
                    ], hh_common_subfields('hh_faq')),
                ],
                // Covers both the "reviews" and "testimonials" DB aliases from SECTION_EDITORS —
                // the read-side mapper (src/integrations/wordpress/mappers.ts) picks the canonical type.
                'layout_hh_reviews' => [
                    'key' => 'layout_hh_reviews', 'name' => 'reviews', 'label' => 'Reviews / Testimonials', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_reviews_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text'],
                        hh_items_repeater('hh_reviews', 'Reviews', [
                            ['key' => 'field_hh_reviews_item_quote', 'name' => 'quote', 'label' => 'Quote', 'type' => 'textarea'],
                            ['key' => 'field_hh_reviews_item_author', 'name' => 'author', 'label' => 'Author', 'type' => 'text'],
                            ['key' => 'field_hh_reviews_item_company', 'name' => 'company', 'label' => 'Company', 'type' => 'text'],
                            ['key' => 'field_hh_reviews_item_rating', 'name' => 'rating', 'label' => 'Rating (1-5)', 'type' => 'number', 'min' => 1, 'max' => 5],
                        ]),
                    ], hh_common_subfields('hh_reviews')),
                ],
                'layout_hh_services' => [
                    'key' => 'layout_hh_services', 'name' => 'services', 'label' => 'Services Grid', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_services_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text'],
                        hh_items_repeater('hh_services', 'Services', [
                            ['key' => 'field_hh_services_item_title', 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'field_hh_services_item_desc', 'name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                            ['key' => 'field_hh_services_item_href', 'name' => 'href', 'label' => 'Link', 'type' => 'text'],
                            ['key' => 'field_hh_services_item_icon', 'name' => 'icon', 'label' => 'Icon (Lucide name)', 'type' => 'text'],
                        ]),
                    ], hh_common_subfields('hh_services')),
                ],
                'layout_hh_stats' => [
                    'key' => 'layout_hh_stats', 'name' => 'stats', 'label' => 'Stats Strip', 'display' => 'block',
                    'sub_fields' => array_merge([
                        hh_items_repeater('hh_stats', 'Stats', [
                            ['key' => 'field_hh_stats_item_value', 'name' => 'value', 'label' => 'Value', 'type' => 'text'],
                            ['key' => 'field_hh_stats_item_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text'],
                        ]),
                    ], hh_common_subfields('hh_stats')),
                ],
                'layout_hh_gallery' => [
                    'key' => 'layout_hh_gallery', 'name' => 'gallery', 'label' => 'Gallery', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_gallery_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text'],
                        hh_items_repeater('hh_gallery', 'Images', [
                            ['key' => 'field_hh_gallery_item_src', 'name' => 'src', 'label' => 'Image', 'type' => 'image', 'return_format' => 'array'],
                            ['key' => 'field_hh_gallery_item_alt', 'name' => 'alt', 'label' => 'Alt Text', 'type' => 'text'],
                            ['key' => 'field_hh_gallery_item_caption', 'name' => 'caption', 'label' => 'Caption', 'type' => 'text'],
                        ]),
                    ], hh_common_subfields('hh_gallery')),
                ],
                // Covers both "rich_text" and "text_block" DB aliases.
                'layout_hh_rich_text' => [
                    'key' => 'layout_hh_rich_text', 'name' => 'rich_text', 'label' => 'Rich Text', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_rich_text_html', 'name' => 'html', 'label' => 'Content', 'type' => 'wysiwyg'],
                    ], hh_common_subfields('hh_rich_text')),
                ],
                'layout_hh_image_block' => [
                    'key' => 'layout_hh_image_block', 'name' => 'image_block', 'label' => 'Image Block', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_image_block_src', 'name' => 'src', 'label' => 'Image', 'type' => 'image', 'required' => 1, 'return_format' => 'array'],
                        ['key' => 'field_hh_image_block_alt', 'name' => 'alt', 'label' => 'Alt Text', 'type' => 'text'],
                        ['key' => 'field_hh_image_block_caption', 'name' => 'caption', 'label' => 'Caption', 'type' => 'text'],
                        ['key' => 'field_hh_image_block_href', 'name' => 'href', 'label' => 'Link', 'type' => 'text'],
                    ], hh_common_subfields('hh_image_block')),
                ],
                'layout_hh_video_block' => [
                    'key' => 'layout_hh_video_block', 'name' => 'video_block', 'label' => 'Video Block', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_video_block_url', 'name' => 'url', 'label' => 'Video URL', 'type' => 'url', 'required' => 1, 'instructions' => 'YouTube, Vimeo, or direct MP4 URL'],
                        ['key' => 'field_hh_video_block_poster', 'name' => 'poster', 'label' => 'Poster Image', 'type' => 'image', 'return_format' => 'array'],
                        ['key' => 'field_hh_video_block_caption', 'name' => 'caption', 'label' => 'Caption', 'type' => 'text'],
                    ], hh_common_subfields('hh_video_block')),
                ],
                'layout_hh_features' => [
                    'key' => 'layout_hh_features', 'name' => 'features', 'label' => 'Features Grid', 'display' => 'block',
                    'sub_fields' => array_merge([
                        ['key' => 'field_hh_features_headline', 'name' => 'headline', 'label' => 'Headline', 'type' => 'text'],
                        hh_items_repeater('hh_features', 'Features', [
                            ['key' => 'field_hh_features_item_icon', 'name' => 'icon', 'label' => 'Icon (Lucide name)', 'type' => 'text'],
                            ['key' => 'field_hh_features_item_title', 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
                            ['key' => 'field_hh_features_item_desc', 'name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                        ]),
                    ], hh_common_subfields('hh_features')),
                ],
                'layout_hh_custom_html' => [
                    'key' => 'layout_hh_custom_html', 'name' => 'custom_html', 'label' => 'Custom HTML', 'display' => 'block',
                    'sub_fields' => [
                        ['key' => 'field_hh_custom_html_html', 'name' => 'html', 'label' => 'Raw HTML', 'type' => 'textarea', 'instructions' => 'Rendered as-is, unsanitized. Admin-only.'],
                        ['key' => 'field_hh_custom_html_enabled', 'name' => 'enabled', 'label' => 'Enabled', 'type' => 'true_false', 'default_value' => 1, 'ui' => 1],
                    ],
                ],
            ],
        ],
    ],
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'page']]],
]);

/* -----------------------------------------------------------------------
 * 2. Site Content options pages — one per legacy `site_content.page_key`
 * --------------------------------------------------------------------- */

acf_add_options_page([
    'page_title' => 'Site Content',
    'menu_title' => 'Site Content',
    'menu_slug' => 'acf-options-site-content',
    'capability' => 'edit_posts',
    'position' => 3,
    'icon_url' => 'dashicons-editor-textcolor',
    'redirect' => true,
]);

$hh_site_content_page_keys = [
    'header' => 'Header',
    'footer' => 'Footer',
    'home' => 'Home Page',
    'dispatchers' => 'Dispatch Team',
    'faq' => 'FAQ',
    'guarantees' => 'Guarantees',
    'trust' => 'Trust Strip',
    'services' => 'Services Index',
    'about' => 'About Page',
];

foreach ($hh_site_content_page_keys as $page_key => $page_label) {
    // show_in_graphql + graphql_field_name set on BOTH the options page registration and
    // its field group below — WPGraphQL for ACF's docs (https://acf.wpgraphql.com/upgrade-guide/)
    // note breaking changes across v1 -> v2 in exactly where this setting needs to live for
    // options pages, so both are set defensively. Confirm via schema introspection
    // (GraphiQL IDE in wp-admin) once ACF PRO + WPGraphQL for ACF are actually installed,
    // and adjust OPTIONS_ROOT_FIELD in src/integrations/wordpress/queries.ts to match
    // whichever one actually won.
    acf_add_options_page([
        'page_title' => "Site Content: {$page_label}",
        'menu_title' => $page_label,
        'menu_slug' => "acf-options-{$page_key}",
        'parent_slug' => 'acf-options-site-content',
        'capability' => 'edit_posts',
        'show_in_graphql' => true,
        'graphql_field_name' => "acfOptionsSiteContent" . ucfirst($page_key),
    ]);

    acf_add_local_field_group([
        'key' => "group_hh_site_content_{$page_key}",
        'title' => "Site Content — {$page_label}",
        'show_in_graphql' => 1,
        'graphql_field_name' => "acfOptionsSiteContent" . ucfirst($page_key),
        'fields' => [
            hh_items_repeater("hh_site_content_{$page_key}", 'Content Blocks', [
                ['key' => "field_hh_sc_{$page_key}_block_key", 'name' => 'block_key', 'label' => 'Block Key', 'type' => 'text', 'required' => 1,
                    'instructions' => 'Matches the key used in code, e.g. "hero_title_line1" or "m1_name". Do not rename existing keys unless updating the corresponding React component.'],
                ['key' => "field_hh_sc_{$page_key}_label", 'name' => 'label', 'label' => 'Editor Label', 'type' => 'text'],
                ['key' => "field_hh_sc_{$page_key}_kind", 'name' => 'kind', 'label' => 'Field Type', 'type' => 'select',
                    'choices' => ['text' => 'Short text', 'textarea' => 'Long text', 'html' => 'HTML'], 'default_value' => 'text'],
                ['key' => "field_hh_sc_{$page_key}_content", 'name' => 'content', 'label' => 'Content', 'type' => 'textarea', 'rows' => 3],
                ...hh_style_subfields("hh_sc_{$page_key}"),
            ]),
        ],
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => "acf-options-{$page_key}"]]],
    ]);
}

/* -----------------------------------------------------------------------
 * 3. Theme Settings — global_settings + analytics_settings
 * --------------------------------------------------------------------- */

acf_add_options_page([
    'page_title' => 'Theme Settings',
    'menu_title' => 'Theme Settings',
    'menu_slug' => 'acf-options-theme-settings',
    'capability' => 'manage_options',
    'position' => 4,
    'icon_url' => 'dashicons-admin-generic',
    'show_in_graphql' => true,
    'graphql_field_name' => 'acfOptionsThemeSettings',
]);

acf_add_local_field_group([
    'key' => 'group_hh_theme_settings',
    'title' => 'Theme Settings',
    'show_in_graphql' => 1,
    'graphql_field_name' => 'acfOptionsThemeSettings',
    'fields' => [
        ['key' => 'field_hh_ts_tab_company', 'label' => 'Company', 'type' => 'tab'],
        ['key' => 'field_hh_ts_company_name', 'name' => 'company_name', 'label' => 'Company Name', 'type' => 'text'],
        ['key' => 'field_hh_ts_logo_url', 'name' => 'logo_url', 'label' => 'Logo', 'type' => 'image', 'return_format' => 'array'],
        ['key' => 'field_hh_ts_phone_primary', 'name' => 'phone_primary', 'label' => 'Primary Phone', 'type' => 'text'],
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
