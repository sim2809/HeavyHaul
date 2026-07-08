<?php
/**
 * Flexible Content "Page Sections" field on the native `page` post type — gives the
 * client a real drag-and-drop section builder for ANY new page they create in wp-admin
 * (12 layouts: hero/cta/faq/reviews/services/stats/gallery/rich_text/image_block/
 * video_block/features/custom_html), rendered by template-parts/section-*.php via
 * template-parts/section-renderer.php. Home/About/Contact/Services-Index use their own
 * hand-ported templates instead of this (see acf-site-content.php) since those need
 * pixel-perfect specific layouts, not generic blocks — this is for pages beyond those.
 */

if (!function_exists('acf_add_local_field_group')) {
    return; // ACF (PRO) not active yet.
}

acf_add_local_field_group([
    'key' => 'group_hh_page_sections',
    'title' => 'Page Sections',
    'fields' => [
        [
            'key' => 'field_hh_page_sections',
            'name' => 'page_sections',
            'label' => 'Sections',
            'type' => 'flexible_content',
            'button_label' => 'Add section',
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
    'location' => [[
        ['param' => 'post_type', 'operator' => '==', 'value' => 'page'],
    ]],
    // Exclude the hand-templated pages (Home/About/Contact/Services Index use their own
    // page-*.php templates + Site Content fields instead of generic flexible sections).
    'hide_on_screen' => [],
]);
